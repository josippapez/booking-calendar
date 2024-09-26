'use client';

import { cn } from '@/lib/utils';
import { Locale, Link as NextTranslationLink } from '@modules/translations';
import { cva, VariantProps } from 'class-variance-authority';
import { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
} & LinkProps &
  (AsLinkProps | AsButtonProps | AsNavProps) &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    locale?: Locale | undefined;
  } & VariantProps<typeof buttonClass>;

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

const buttonClass = cva(
  [
    'grid w-full grid-flow-col items-center justify-center gap-1 text-center transition-colors duration-300',
    'focus:shadow-btn-focused focus:shadow-focused focus:outline-none',
    'disabled:pointer-events-none disabled:opacity-30',
  ],
  {
    variants: {
      variation: {
        primary:
          'border border-btn-dark bg-btn-dark text-btn-light hover:border-btn-dark-hover hover:bg-btn-dark-hover',
        secondary:
          'border border-separator-light bg-btn-light text-btn-dark hover:border-btn-dark',
        tertiary:
          'max-w-fit self-center rounded text-dark hover:text-btn-dark-hover',
        nav: 'border-b-2 border-transparent text-dark-placeholder hover:text-btn-dark',
      },
      size: {
        navLarge: 'max-w-min',
        large: 'rounded-4xl px-5 py-[15px]',
        medium: 'rounded-3xl px-4 py-[11px]',
        small: 'rounded-3xl px-[15px] py-[7px]',
        tertiaryLarge: 'font-text-medium p-0 text-base underline',
        tertiarySmall: 'font-text-roman p-0 text-sm leading-6 underline',
      },
    },
  }
);

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
      className={cn(buttonClass({ size, variation }), className)}
      {...rest}
      prefetch={rest.prefetch ?? undefined}
    >
      {leftIcon}
      {children}
    </NextTranslationLink>
  );
};
