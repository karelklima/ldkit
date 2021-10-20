import { concat, lastValueFrom, Observable, take } from "rxjs";

export const run = <T>(...args: [...Observable<any>[], Observable<T>]) =>
  lastValueFrom<T>(
    concat(...args.map((obs: Observable<any>) => obs.pipe(take(1))))
  );
