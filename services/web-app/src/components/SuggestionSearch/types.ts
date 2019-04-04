import { Observable } from "rxjs";

export interface Props {
  children: (stateAndHelpers: object) => React.ReactNode;
  defaultSuggestions: string[];
  highlightOnStart: number;
  initialInputValue: string;
  openOnStart: boolean;
  onSelect: (item: string | number) => void;
  streamTransform: (input$: Observable<string>) => Observable<any>;
  stateReducer: (
    changes: Partial<State>,
    state: State,
    changeType: changeTypes
  ) => object;
}
export interface State {
  error: string | null;
  highlightedIndex: number;
  inputValue: string;
  open: boolean;
  suggestions: string[];
}

export const enum changeTypes {
  itemSelected = "ITEM_SELECTED",
  itemHover = "ITEM_HOVER",
  itemClicked = "ITEM_CLICKED",
  keyArrow = "KEY_ARROW",
  menuOpen = "MENU_OPEN",
  menuClose = "MENU_CLOSE",
  inputChange = "INPUT_CHANGE",
  inputClear = "INPUT_CLEAR",
  inputFocus = "INPUT_FOCUS"
}

type StateUpdater = (state: State) => Partial<State>;
type StateObj = Partial<State>;

export type StateChange = StateUpdater | StateObj;
