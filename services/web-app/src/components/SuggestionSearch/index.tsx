/* decided to ditch the control props as they seemed to be adding more complexity than 
    they were worth for my use case, and anything I could think of wanting to do was 10x easier
    to do with just a state reducer. I understand that control props can be a useful pattern because 
    they offer more control than a state reducer but for something this simple didnt see the benefit.
    left the control props in the js example to show that I understand them but that wont be used. 
 */

import React, { Component } from "react";
import { fromEvent, Observable, Subscription, Observer } from "rxjs";
import { pluck, map, distinctUntilChanged, catchError } from "rxjs/operators";
import { throttle } from "lodash";
import combineEventHandlers from "./utils/combineEventHandlers";
import checkScrollNeeded from "./utils/checkScrollNeeded";
import calculateHighlightedIndex from "./utils/calculateHighlightedIndex";
import { Props, State, changeTypes, StateChange } from "./types";

export default class SuggestionSearch extends Component<Props, State> {
  public static defaultProps = {
    defaultSuggestions: [],
    highlightOnStart: -1,
    initialInputValue: "",
    openOnStart: false,
    streamTransform: (input$: Observable<string>) => input$,
    stateReducer: (
      changes: Partial<State>,
      state: object,
      changeType: changeTypes
    ) => changes
  };

  public inputRef = React.createRef<HTMLInputElement>();
  public menuRef = React.createRef<HTMLElement>();
  public higlightedRef = React.createRef<HTMLElement>();
  public subscription?: Subscription;

  constructor(props: Props) {
    super(props);

    this.handleItemHover = throttle(this.handleItemHover, 100);

    const {
      defaultSuggestions: suggestions,
      highlightOnStart: highlightedIndex,
      initialInputValue: inputValue,
      openOnStart: open
    } = this.props;

    const error: string | null = null;

    this.state = {
      error,
      highlightedIndex,
      inputValue,
      open,
      suggestions
    };
  }

  public triggerSuggestion$: (value: string) => void = () => {
    return;
  };

  /*  public createOnChange$ = (): Observable<any> =>
    Observable.create((observer: Observer<any>) => {
      this.triggerFieldChange$ = (name: string, value: any) => {
        observer.next({ name, value });
      };
    }).pipe(
      startWith({ name: "any string" }),
      pairwise(),
      share()
    );


*/

  protected initialzeSuggestionStream = (): Observable<any> =>
    this.props
      .streamTransform(
        Observable.create((observer: Observer<any>) => {
          this.triggerSuggestion$ = (value: string) => {
            observer.next(value);
          };
        }).pipe(distinctUntilChanged())
      )
      .pipe(
        catchError((error: Error) => {
          this.setState({ error: error.message });
          return this.state.suggestions;
        })
      );

  public componentDidMount() {
    /*
    if (this.inputRef.current) {
      this.subscription = this.initialzeSuggestionStream(
        this.inputRef.current
      ).subscribe(
        (suggestions: string[]) => {
          this.setState({ suggestions });
        },
        (error: Error) => {
          this.setState({
            suggestions: [],
            error: error.message
          });
        }
      );
    }
    */
    this.forceUpdate();
  }

  public componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public internalSetState = (
    stateChanges: StateChange,
    changeType: changeTypes
  ) => {
    const changes =
      typeof stateChanges === "function"
        ? stateChanges(this.state)
        : stateChanges;

    this.setState(
      this.props.stateReducer(changes, this.state, changeType),
      () => {
        if (
          changes.highlightedIndex &&
          this.higlightedRef.current &&
          this.menuRef.current &&
          changeType === changeTypes.keyArrow
        ) {
          if (
            checkScrollNeeded(this.menuRef.current, this.higlightedRef.current)
          ) {
            window.requestAnimationFrame(() => {
              if (this.higlightedRef.current) {
                this.higlightedRef.current.scrollIntoView({
                  behavior: "smooth"
                });
              }
            });
          }
        }
      }
    );
  };

  public moveHighlightedIndex = (
    moveAmt: number,
    changeType: changeTypes,
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    const { inputValue, suggestions } = this.state;
    const updatedIndex = calculateHighlightedIndex(moveAmt, this.state);
    this.internalSetState(
      {
        highlightedIndex: updatedIndex,
        inputValue: suggestions[updatedIndex] || inputValue,
        open: true
      },
      changeType
    );
  };

  public handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { open, highlightedIndex, suggestions } = this.state;
    const currentSuggestion = suggestions[highlightedIndex];
    if (open && currentSuggestion !== undefined) {
      if (
        !this.higlightedRef.current ||
        !this.higlightedRef.current.hasAttribute("disabled")
      ) {
        this.props.onSelect(currentSuggestion);
        this.internalSetState(
          {
            open: false
          },
          changeTypes.itemSelected
        );
      }
    }
  };

  public keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.keyCode) {
      case 38:
        this.moveHighlightedIndex(-1, changeTypes.keyArrow, event);
        break;
      // arrow keydown
      case 40:
        this.moveHighlightedIndex(1, changeTypes.keyArrow, event);
        break;

      // enter
      case 13:
        this.handleEnterKey(event);
        break;

      // escape
      case 27:
        this.closeMenu();
    }
  };

  public openMenu = () => {
    this.internalSetState(
      {
        open: true
      },
      changeTypes.menuOpen
    );
  };

  public closeMenu = () => {
    this.internalSetState(
      {
        open: false,
        inputValue: "",
        highlightedIndex: this.props.highlightOnStart
      },
      changeTypes.menuClose
    );
  };

  public inputHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        inputValue: event.target.value,
        highlightedIndex: -1,
        open: true
      }
      //  changeTypes.inputChange
    );
  };

  public inputHandleBlur = () => {
    this.closeMenu();
  };

  public inputHandleFocus = () => {
    this.internalSetState(
      {
        open: true
      },
      changeTypes.inputFocus
    );
  };

  public focusInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  public handleItemHover = (index: number) => {
    const { highlightedIndex, suggestions } = this.state;

    if (index !== highlightedIndex) {
      this.internalSetState(
        {
          highlightedIndex: index,
          inputValue: suggestions[index]
        },
        changeTypes.itemHover
      );
    }
  };

  public handleItemClick = (event: { target: { innerText: string } }) => {
    this.internalSetState(
      {
        open: false
      },
      changeTypes.itemSelected
    );
  };

  public handleItemMouseDown = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  public getInputProps = ({
    onKeyDown,
    onBlur,
    onChange,
    onFocus,
    onClick,
    ...rest
  }: {
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  } = {}) => {
    const { inputValue } = this.state;
    return {
      ref: this.inputRef,
      value: inputValue,
      onChange: this.inputHandleChange,
      //     onKeyDown: combineEventHandlers(onKeyDown, this.keyDownHandler),
      onBlur: combineEventHandlers(onBlur, this.inputHandleBlur),
      onClick: combineEventHandlers(onClick, this.inputHandleFocus),
      //    onFocus: combineEventHandlers(onFocus, this.inputHandleFocus),
      ...rest
    };
  };

  public getListItemProps = ({
    index,
    onClick,
    onMouseMove,
    onMouseDown,
    ...rest
  }: {
    index?: number;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  } = {}) => {
    return {
      onMouseMove: combineEventHandlers(
        onMouseMove,
        ((idx: number) => (event: React.MouseEvent<HTMLElement>) => {
          this.handleItemHover(idx);
        })(index!)
      ),
      onClick: combineEventHandlers(onClick, this.handleItemClick),
      onMouseDown: combineEventHandlers(onMouseDown, this.handleItemMouseDown),
      ...rest
    };
  };

  public getStateAndHelpers = () => {
    return {
      // prop getters
      getInputProps: this.getInputProps,
      getListItemProps: this.getListItemProps,

      // might be useful to expose to the children
      openMenu: this.openMenu,
      closeMenu: this.closeMenu,
      focusInput: this.focusInput,

      // refs
      menuRef: this.menuRef,
      itemRef: this.higlightedRef,
      inputRef: this.inputRef,

      // state
      ...this.state
    };
  };

  public render() {
    const { children } = this.props;

    return children(this.getStateAndHelpers());
  }
}
