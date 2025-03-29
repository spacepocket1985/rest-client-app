import Link, { LinkProps } from 'next/link';
import React, { AnchorHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

type UILinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    text?: string;
    disabled?: boolean;
    children?: React.ReactNode;
  };

export const UILink: FC<UILinkProps> = ({ href, children, className, disabled, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();

      return;
    }

    onClick?.(e);
  };

  return (
    <Link
      href={href}
      className={classNames(
        'px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer',
        className,
        { 'bg-slate-300 select-none pointer-events-none': disabled },
      )}
      onClick={handleClick}
      aria-disabled={disabled}
      {...props}
    >
      {props.text}
      {children}
    </Link>
  );
};
