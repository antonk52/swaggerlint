import {LintError} from '../types';

export type WalkerResult<T> =
    | {
          visitors: T;
      }
    | {
          errors: LintError[];
      };
