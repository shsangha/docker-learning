/* Function that takes in a list of event handlers and runs them in order unless
*  preventInternalEventHandlers is set in which case it prevents all remaining event handlers frim running
* 
*  @param {[function]} fns - a list of functions that we want to run one after another
*  @return - a function that accepts an event and args and runs each function with the event/args
*/
export default function(...fns) {
  return (e, ...args) => {
    fns.some(fn => {
      if (fn && typeof fn === 'function') {
        fn(e, ...args);
      }
      //console.log(e.preventInternalEventHandlers);
      return e.preventInternalEventHandlers;
    });
  };
}
