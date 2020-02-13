import { toPath } from "lodash";
import targetInnerVal from "./targetInnerVal";

/* @input - {Array} - a 2d array containing an array of field names and the corresponding error object
   @ouput - {Object} a combined error object from all the fields

   uses the fact that Objects are passed by refference in js so we can gain access to the nested
   value of the object we want to change, and changes in the nested object change the parent object 
   accordingly. Ususally this isn't something you want to do becasue it violates immutibility, but in this case
   it's fine becasue we contain the side-effect within the function so we aren't mutating any values
   that exist outide the scope of this function so it is still visibiy pure. 

*/

export default (validatorKeys: string[], errors: Array<object | null>): any =>
  errors.reduce((combinedErrors, currentError, idx): object => {
    if (currentError && combinedErrors) {
      const name = validatorKeys[idx];
      const pathArray = toPath(name);
      //    console.log(currentError, "CURRENT ERROR");
      const { target, index } = targetInnerVal(combinedErrors, pathArray);

      if (target[pathArray[index]]) {
        target[pathArray[index]] = {
          ...target[pathArray[index]],
          ...currentError
        };
      } else {
        target[pathArray[index]] = currentError;
      }
    }
    if (combinedErrors) {
      return combinedErrors;
    }
    return {};
  }, {});
