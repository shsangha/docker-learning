import { IndexSignatureObject } from "../types";

export default (
  rootRefference: object,
  pathArray: string[],
  createFieldFunc: (nextPath: string | number | undefined) => {} = () => ({})
) =>
  pathArray.reduce(
    (resVal: IndexSignatureObject, currentPath, currentIndex) => {
      if (currentIndex < pathArray.length - 1) {
        if (resVal.target[currentPath]) {
          resVal.target = resVal.target[currentPath];
        } else {
          const nextPath = pathArray[currentIndex + 1];
          resVal.target = resVal.target[currentPath] = createFieldFunc(
            nextPath
          );
        }
      }
      resVal.index = currentIndex;
      return resVal;
    },
    { target: rootRefference, index: null }
  );
