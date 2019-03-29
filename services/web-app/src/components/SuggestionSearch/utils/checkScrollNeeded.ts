/* @input {DOMnode} menu - the current ref attached to the menu
 *  @input {DOMNODE} item - the currently selected item in the menu
 *  @return {boolean} returns true if any part of the item is not in view
 */
export default function(menu: HTMLElement, item: HTMLElement) {
  const visibleMenuTop = menu.scrollTop;
  const visibleMenuBottom = menu.clientHeight + visibleMenuTop;

  const highlightedItemTop = item.offsetTop;
  const highlightedItemBottom = item.clientHeight + highlightedItemTop;

  // checks to see if any portion of the item isnt visible
  return (
    highlightedItemTop < visibleMenuTop ||
    highlightedItemBottom > visibleMenuBottom
  );
}
