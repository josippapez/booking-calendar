import { clsx } from 'clsx';
import { ClassNameValue, extendTailwindMerge } from 'tailwind-merge';

const extendedTwMerge = extendTailwindMerge({});

// used for merging tailwind classes with clsx
export function cltm(...args: ClassNameValue[]) {
  return extendedTwMerge(clsx(args));
}

export type Modify<T, R> = Omit<T, keyof R> & R;
