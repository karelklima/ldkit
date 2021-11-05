import { useMemo } from "react";
import type { Observable } from "rxjs";
import { useObservable, useObservableState } from "observable-hooks";

export const useResource = <T extends any>(
  observableInit: () => Observable<T>,
  defaultState: T,
  deps: React.DependencyList = []
) => {
  const o$ = useMemo(() => {
    console.log("REMEMOIZING");
    return observableInit();
  }, deps);
  // const o$ = useObservable(memoizedObservableInit);
  return useObservableState(o$, defaultState);
};
