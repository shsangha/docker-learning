/* Heavily inspired by Kent Dodds via his frontend masters course where he descirbes 
   the patterns that make this component possible. Decided to take the patterns 
   implemented in Downshift and integrate them with Rxjs, and we-write the logic my own way just as a learning experience
   in the real world I would absolutely just use Downshift, but doing this allowed me 
   to gain a  way better understanding of how/when to use control props, state reducers and
   prop getters/setters, and made me realize a-lot of the setup to take advantage of these patters
   is pretty reusable boilerplate
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { fromEvent,Observable } from "rxjs";
import { pluck, map, distinctUntilChanged } from "rxjs/operators";
import { throttle } from "lodash";
import changeTypes from "./changeTypes";
import combineEventHandlers from "./utils/combineEventHandlers";
import checkScrollNeeded from "./utils/checkScrollNeeded";

/* Reusable component that can be used for any type of menu that is based on search suggestions.
   Exposes a render prop to allow for flexible ui logic while resusing common login for menu
   Allows for control props so each piece of state can be controled by the user if need be
*/

const propTypes = {
  children: PropTypes.func.isRequired, // component returns a render prop via children
  initialInputValue: PropTypes.string,
  highlightedOnStart: PropTypes.any,
  openByDefault: PropTypes.bool,
  streamTransform: PropTypes.func, // function that takes in the $input and and returns a new stream based on that the user wants to do
  stateReducer: PropTypes.func, // allows users to override default state changes based on the type of change occuring
  onSelect: PropTypes.func, // called when a user interacts with a list item
  onParentStateChange: PropTypes.func, // called on internalSetstate when parent state needs to be updated also takes the change type so all changes can be handled in one handler treated like a state reducer
  defaultSuggestions: PropTypes.array
};

interface Props  {
  children: ()=>React.ReactNode,
  initialInputValue: string,
  highlightedOnStart: number,
  openByDefault: boolean,
  streamTransForm: (input$: Observable<any>)=> Observable<any>,
  stateReducer: (changes: object, state: object, changeType: string)=> object,
  onselect: (currentSuggestion)=>

}

export default class SuggestionSearch extends Component {
  // Used for the search observable and to handle focus
  protected inputRef = React.createRef();
  // Needed to be able to detect if list items are in view for scroll control
  protected menuRef = React.createRef();
  // Allows for access of the list item based on its index
  protected highlightedRef = React.createRef();



  static defaultProps = {
    highlightedOnStart: -1,
    openByDefault: false,
    initialInputValue: "",
    streamTransform: $stream => $stream,
    stateReducer: (changes, state) => changes, // if no state reducer is passed in state changes based off internal defaults
    onSelect: () => {}, // nothing happens if the user doesnt specify an onSelect func
    onParentStateChange: () => {},
    defaultSuggestions: []
  };

  /* @constructor
   *
   * Implements the control prop pattern to aviod anti-pattern of syncing props and state
   * Determines if each piece of state is local state or comes from props and sets state acccordingly
   */
  constructor(props) {
    super(props);

    // get defaults from props and then alias as the values that are kept in state
    const {
      highlightedOnStart: highlightedIndex,
      openByDefault: open,
      initialInputValue: inputValue,
      defaultSuggestions: suggestions
    } = this.props;

    const errors = [];
    /* merged state is the combined state from local state and props
       the state gets differentiated on calls to internalsetState
    */

    this.state = this.getMergedState({
      highlightedIndex,
      open,
      inputValue,
      suggestions,
      errors: []
    });

    // handleItemHover is called on each mouseMove and that isnt great for performance
    this.handleItemHover = throttle(this.handleItemHover, 100);
  }

  /*Provides some defaults all search components would want and then passes into parent to be transfomed 
      - only provides the actual search term (pluck)
      - ignores spaces on the end of terms
      - only notifies if the term changes 
    */
  initializeStream(input) {
    return fromEvent(input, "input").pipe(
      pluck("target", "value"),
      map(searchTerm => {
        return searchTerm.trim();
      }),
      distinctUntilChanged()
    );
  }

  /*sets up subscription to our input observable*/
  componentDidMount() {
    const input = this.inputRef.current;
    const $input = this.initializeStream(input);
    const $search = this.props.streamTransform($input);

    this.subscription = $search.subscribe(
      ({ suggestions, errors }) => {
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions;
          console.log("CHANGING");
          this.internalSetState(
            {
              suggestions,
              errors
            },
            changeTypes.suggestionsChanged
          );
        }
      },
      error => {
        //    console.log(error);
        //the default error handling stategy if the user for some reason doesnt catch errors
        this.internalSetState(
          {
            errors: [],
            suggestions: []
          },
          changeTypes.suggestionError
        );
      }
    );
  }

  componentWillUnmount() {
    //disposes of the subscription to avoid memory leaks
    this.subscription.unsubscribe();
  }

  /*  @input {object} state 
      @return {object} mergedState
      returns the combined state coming from interal state and props based on if a control props exists for any key of the state object
  */
  getMergedState(state = this.state) {
    return Object.keys(state).reduce((mergedState, key) => {
      mergedState[key] = this.checkControlProp(key)
        ? this.props[key]
        : state[key];
      return mergedState;
    }, {});
  }

  /* @input key - the key of the state we want to check
    @ return {boolean} returns true if the piece of state is coming from props
  */
  checkControlProp(key) {
    return this.props[key] !== undefined;
  }

  /* @input {object} changes - the changes to be made to state
   *  @input {object} state - the current merged state
   *  @return {object} actualChanges - the changes object with state that hasn't change filtered out
   */
  filterChanges = (changes, state) => {
    return Object.keys(changes)
      .filter(key => changes[key] !== state[key])
      .reduce((actualChanges, key) => {
        actualChanges[key] = changes[key];
        return actualChanges;
      }, {});
  };

  /* @input {object} changes - the reduced changes
     @return [{object},{object}] - the changes split into controlled/uncontrolled 
  */
  partitionChanges = changes => {
    return Object.keys(changes).reduce(
      (result, key) => {
        this.checkControlProp(key)
          ? (result[0][key] = changes[key])
          : (result[1][key] = changes[key]);
        return result;
      },
      [{}, {}]
    );
  };

  /* @input {object || function } stateChanges - the changes that are to be made the the merged state
  *  @input {string} changeType - the type of change to be passed into the state reducer if the user wants to override behavior
     @return {null}
  */
  internalSetState = (stateChanges, changeType) => {
    const { state: internalState } = this.state;
    const stateUpdaterFunc = typeof stateChanges === "function";
    let state = this.getMergedState(internalState);
    // get the changes object in the case stateChanges was a state updater function
    let changes = stateUpdaterFunc ? stateChanges(state) : stateChanges;
    changes = this.props.stateReducer(changes, state, changeType);
    changes = this.filterChanges(changes, state);
    const [controlledChanges, unControlledChanges] = this.partitionChanges(
      changes
    );
    //updates the parent that its state needs to be updated
    if (Object.keys(controlledChanges).length > 0) {
      this.props.onParentStateChange(controlledChanges, changeType);
    }
    if (Object.keys(unControlledChanges).length > 0) {
      //sets the internal state for the uncontrolled changes
      return this.setState(unControlledChanges, () => {
        // checks if the menu needs to be scrolled and scrolls if need be
        if (
          this.highlightedRef.current &&
          this.menuRef.current &&
          changeType === changeTypes.keyArrow &&
          // only need to handle scroll logic internally if highlighted index isnt a control prop
          unControlledChanges.hasOwnProperty("highlightedIndex")
        ) {
          if (
            checkScrollNeeded(this.menuRef.current, this.highlightedRef.current)
          ) {
            window.requestAnimationFrame(
              this.highlightedRef.current.scrollIntoView({
                behavior: "smooth",
                alignToTop: true
              })
            );
          }
        }
      });
    }
  };

  // KEY DOWN EVENT HANDLERS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* @input {int} moveAmt
   *  @return {int} - what the new highlighted index should be
   */
  calculateHighlightedIndex = moveAmt => {
    const { open, highlightedIndex, suggestions } = this.getMergedState();
    if (open) {
      const lastIndex = suggestions.length - 1;
      let updatedHighlightedIndex = highlightedIndex + moveAmt;
      console.log(lastIndex, "OPEN");
      if (updatedHighlightedIndex > lastIndex) return 0;
      if (updatedHighlightedIndex < 0) return lastIndex;

      console.log(lastIndex, updatedHighlightedIndex);
      return updatedHighlightedIndex;
    }
    console.log("PASSES THROUGH");
    return -1;
  };

  /* @input {int} moveAmt - how much to move (negative for up)
     @input {string} changeType - type of change that will go into the state reducer
     @input {object} event - the event object
     @return {null}
    
     sets the internal state with a new highlightedIndex
  */
  moveHighlightedIndex = (moveAmt, changeType, event) => {
    const { inputValue, suggestions } = this.getMergedState();
    event.preventDefault();
    const updatedIndex = this.calculateHighlightedIndex(moveAmt);
    this.internalSetState(
      {
        highlightedIndex: updatedIndex,
        inputValue: suggestions[updatedIndex] || inputValue,
        open: true
      },
      changeType
    );
  };

  /* @input {object} event
   *  @return {null}
   *
   * calls props.onSelect if the menu is open and an index is highlighted and not disabled
   */
  handleEnterKey = event => {
    const { open, highlightedIndex, suggestions } = this.getMergedState();
    const currentSuggestion = suggestions[highlightedIndex];
    event.preventDefault();

    if (open && currentSuggestion !== undefined) {
      const disabled = this.highlightedRef.current.hasAttribute("disabled");
      if (!disabled) {
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

  handleEscapeKey = () => {
    this.inputRef.current.blur();
  };

  //calls the handlers defined above based on the event.keycode
  KeyDownHandler = event => {
    switch (event.keyCode) {
      // arrow keyup
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

      //escape
      case 27:
        this.handleEscapeKey();
        break;
    }
  };

  //\\ KEY DOWN EVENT HANDLERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // MENU HANDLERS /////////////////////////////////////////////////////////////////////////////////////////////

  // not used internally just here to allow more control
  openMenu = e => {
    this.internalSetState(
      {
        open: true
      },
      changeTypes.menuOpen
    );
    this.inputRef.current.focus();
  };

  /*default behavior is to reset the input when the menu is closed */
  closeMenu = e => {
    this.internalSetState(
      {
        open: false,
        inputValue: "",
        highlightedIndex: this.props.highlightedOnStart
      },
      changeTypes.menuClose
    );
  };

  //\\ MENU HANDLERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //INPUT SPECFIC EVENT HANDLERS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* @input {object} e - the event 
     default behavior (cab be overridden in state reducer)
      - keep menu open
      - remove highlighted index
      - change the input value
  */
  input_handleChange = e => {
    this.internalSetState(
      {
        inputValue: e.target.value,
        highlightedIndex: -1,
        open: true
      },
      changeTypes.inputChange
    );
  };

  input_handleBlur = () => {
    this.closeMenu();
  };

  /* dediced to open menu when clicked on instead of focus bc dont want it to open automatically when tabbed to */
  input_handleFocus = e => {
    this.internalSetState(
      {
        open: true
      },
      changeTypes.inputFocus
    );
  };

  // not used internally just here as a convinience to the children
  clearInput = () => {
    this.internalSetState(
      {
        input: ""
      },
      changeTypes.inputClear
    );
  };

  //\\ INPUT SPECIFIC EVENT HANDLERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // ITEM HANDLERS /////////////////////////////////////////////////////////////////////////////////////////////

  /* @input {int} index - the index of the current item
     @return {null}
     changes the higlighted index to the index of the current item if it isnt already 
  */
  handleItemHover = index => {
    const { highlightedIndex, suggestions } = this.getMergedState();

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

  /* @input {object} e - the event
     calls onSelect
     default behavior:
      - closes the menu 
  */
  handleItemClick = e => {
    this.internalSetState({ open: false }, changeTypes.itemSelected);

    this.props.onSelect(e.target.innerText);
  };

  // this just prevents input focus from being lost when an item is clicked on
  handleItemMouseDown = e => {
    e.preventDefault();
  };

  //\\ ITEM HANDLERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //PROP GETTERS///////////////////////////////////////////////////////////////////////////////////////

  getInputProps = ({
    onKeyDown,
    onBlur,
    onChange,
    onFocus,
    onClick,
    ...rest
  } = {}) => {
    const { inputValue } = this.getMergedState();

    return {
      ref: this.inputRef,
      value: inputValue,
      onChange: combineEventHandlers(onChange, this.input_handleChange),
      onKeyDown: combineEventHandlers(onKeyDown, this.KeyDownHandler),
      onBlur: combineEventHandlers(onBlur, this.input_handleBlur),
      onClick: combineEventHandlers(onClick, this.input_handleFocus),
      onFocus: combineEventHandlers(onFocus, this.input_handleFocus),
      ...rest
    };
  };

  getListItemProps = ({
    index,
    onClick,
    onMouseMove,
    onMouseDown,
    ...rest
  } = {}) => {
    return {
      onMouseMove: (index => event => {
        this.handleItemHover(index);
      })(index),
      onClick: combineEventHandlers(onClick, this.handleItemClick),
      onMouseDown: combineEventHandlers(onMouseDown, this.handleItemMouseDown),
      ...rest
    };
  };

  getStateAndHelpers = () => {
    return {
      //prop getters
      getInputProps: this.getInputProps,
      getListItemProps: this.getListItemProps,

      //might be useful to expose to the children
      openMenu: this.openMenu,
      closeMenu: this.closeMenu,
      clearInput: this.clearInput,

      //refs
      menuRef: this.menuRef,
      itemRef: this.highlightedRef,
      inputRef: this.inputRef,

      //state
      ...this.getMergedState()
      //suggestions
    };
  };

  //\\\\\\\\\\\\\\PROP GETTERS \\\\\\\\\\\\\\\\

  render() {
    const { children } = this.props;

    return children(this.getStateAndHelpers());
  }
}
