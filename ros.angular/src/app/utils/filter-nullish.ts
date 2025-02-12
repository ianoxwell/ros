import { UnaryFunction, Observable, pipe, filter, OperatorFunction } from 'rxjs';

/**
 * Where you have an observable in the pipe that is possibly undefined and want to filter these
 * results out and only continue a defined object in the pipe.
 * @example possiblyUndefined$.pipe(filterNullish(), tap((result: IDefined) => ...))
 * @returns observable of only type T.
 */
export function filterNullish<T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  return pipe(
    filter((arg: T | null | undefined) => {
      return arg !== null && arg !== undefined;
    }) as OperatorFunction<T | null | undefined, T>
  );
}
