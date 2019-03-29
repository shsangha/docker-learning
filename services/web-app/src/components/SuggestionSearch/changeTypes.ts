// simulating an enum for the types of changes that can happen

const enum CHANGE_TYEPES {
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

export default CHANGE_TYEPES;
