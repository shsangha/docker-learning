export default function<T>(...fns: any[]) {
  return (event: T): void => {
    fns.map(fn => {
      if (fn && typeof fn === "function") {
        fn(event);
      }
    });
  };
}
