'use client';

import { cltm } from '@modules/Shared/utils';
import {
  CountryCodes,
  Link as NextTranslationLink,
} from '@modules/translations';
import type { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
} & LinkProps &
  (AsLinkProps | AsButtonProps | AsNavProps) &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    locale?: CountryCodes | undefined;
  };

type AsLinkProps = {
  variation?: 'tertiary';
  size?: 'tertiarySmall' | 'tertiaryLarge';
};

type AsNavProps = {
  variation: 'nav';
  size: 'navLarge';
};

type AsButtonProps = {
  variation?: 'primary' | 'secondary';
  size?: 'large' | 'medium' | 'small';
};

export const Link = ({
  size = 'tertiaryLarge',
  variation = 'tertiary',
  disabled = false,
  children,
  leftIcon,
  className,
  ...rest
}: Props) => {
  return (
    <NextTranslationLink
      className={cltm(
        'grid w-full grid-flow-col items-center justify-center gap-1 text-center transition-colors duration-300',
        'focus:shadow-btn-focused focus:shadow-focused focus:outline-none',
        'disabled:pointer-events-none disabled:opacity-30',
        variation === 'primary' &&
          'border-btn-dark bg-btn-dark text-btn-light hover:border-btn-dark-hover hover:bg-btn-dark-hover border',
        variation === 'secondary' &&
          'border-separator-light bg-btn-light text-btn-dark hover:border-btn-dark border',
        variation === 'tertiary' &&
          'text-dark hover:text-btn-dark-hover max-w-fit self-center rounded',
        variation === 'nav' &&
          'text-dark-placeholder hover:text-btn-dark border-b-2 border-transparent',
        size === 'navLarge' && 'max-w-min',
        size === 'large' && 'rounded-4xl px-5 py-[15px]',
        size === 'medium' && 'rounded-3xl px-4 py-[11px]',
        size === 'small' && 'rounded-3xl px-[15px] py-[7px]',
        size === 'tertiaryLarge' && 'font-text-medium p-0 text-base underline',
        size === 'tertiarySmall' &&
          'font-text-roman p-0 text-sm leading-6 underline',
        size === 'navLarge' && 'max-w-fit',
        className
      )}
      {...rest}
    >
      {leftIcon}
      {children}
    </NextTranslationLink>
  );
};
