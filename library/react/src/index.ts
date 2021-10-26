import type { Observable } from "rxjs";
import { useObservable, useObservableState } from "observable-hooks";

export const useResource = <T extends any>(
  observableInit: () => Observable<T>,
  defaultState: T
) => {
  const o$ = useObservable(observableInit);
  return useObservableState(o$, defaultState);
};
