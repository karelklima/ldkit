import { useState } from "https://esm.sh/react@18.2.0";
import {
  useObservable,
  useSubscription,
} from "https://esm.sh/observable-hooks@4.2.0";

import { Observable, switchMap } from "./rxjs.ts";

type UseResourceReturnType<T extends any> =
  | {
      isLoading: true;
      isError: false;
      data: undefined;
    }
  | {
      isLoading: false;
      isError: false;
      data: T;
    }
  | {
      isLoading: false;
      isError: true;
      data: undefined;
    };

export const useResource = <T extends any, P extends React.DependencyList>(
  observableInit: (...params: P) => Observable<T>,
  dependencyList?: P
) => {
  const [state, setState] = useState<UseResourceReturnType<T>>({
    isLoading: true,
    isError: false,
    data: undefined,
  });

  const resource = dependencyList
    ? useObservable<T, P>((inputs$) => {
        return inputs$.pipe(switchMap((params) => observableInit(...params)));
      }, dependencyList as [...P])
    : useObservable<T>(observableInit);

  useSubscription(
    resource,
    (value) => {
      setState({
        isLoading: false,
        isError: false,
        data: value,
      });
    },
    (_error) => {
      setState({
        isLoading: false,
        isError: true,
        data: undefined,
      });
    }
  );

  return state;
};
