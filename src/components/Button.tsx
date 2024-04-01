import { cltm } from '@modules/Shared/utils';
import { ReactNode, forwardRef } from 'react';

type Props = {
  text?: string;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  alternateFocus?: boolean;
} & (AsButtonProps | AsNavProps) &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

type AsButtonProps = {
  variation?: 'primary' | 'secondary' | 'accent' | 'tertiary';
  size?: 'large' | 'medium' | 'small';
};

type AsNavProps = {
  variation: 'nav';
  size: 'navLarge';
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      text,
      disabled,
      loading,
      variation = 'primary',
      size = 'large',
      type = 'button',
      leftIcon,
      rightIcon,
      className,
      alternateFocus,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        type={type}
        className={cltm(
          'font-text-medium grid h-fit w-full grid-flow-col items-center justify-center gap-1 text-base font-medium transition-all duration-150',
          'focus:outline focus:outline-1 focus:outline-slate-700',
          'disabled:pointer-events-none disabled:opacity-30',
          alternateFocus && 'focus:outline-slate-700',
          variation === 'primary' &&
            'border-btn-dark bg-btn-dark text-btn-light hover:border-btn-dark-hover hover:bg-btn-dark-hover border',
          variation === 'secondary' &&
            'border-separator-dark bg-btn-light text-btn-dark hover:border-btn-dark border focus:border-transparent',
          variation === 'accent' &&
            'border-btn-accent bg-btn-accent text-btn-light hover:border-btn-accent-hover hover:bg-btn-accent-hover border',
          variation === 'nav' &&
            'border-separator-light bg-btn-light text-btn-dark hover:text-btn-dark border',
          variation === 'tertiary' && 'w-fit p-0 underline',
          size === 'navLarge' && 'max-w-min',
          size === 'large' && 'rounded-full px-8 py-4',
          size === 'medium' && 'rounded-full px-6 py-2',
          size === 'small' && 'rounded-full px-[16px] py-[9px]',
          className
        )}
        {...rest}
      >
        {leftIcon}
        <span>{text}</span>
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
