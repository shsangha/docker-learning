import { State } from "../types";

const calculateHighlightedIndex = (moveAmt: number, state: State) => {
  const { open, highlightedIndex, suggestions } = state;
  if (open) {
    const lastIndex = suggestions.length - 1;
    const updatedHighlightedIndex = highlightedIndex + moveAmt;
    if (updatedHighlightedIndex > lastIndex) {
      return 0;
    }
    if (updatedHighlightedIndex < 0) {
      return lastIndex;
    }

    return updatedHighlightedIndex;
  }
  return -1;
};

export default calculateHighlightedIndex;
