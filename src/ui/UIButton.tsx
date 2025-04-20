import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const UIButton: React.FC<UIButtonProps> = ({ children, className, disabled, ...props }) => {
  return (
    <button
      className={classNames(
        'px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer',
        className,
        { 'bg-slate-300 select-none pointer-events-none': disabled },
      )}
      {...props}
    >
      {props.text}
      {children}
    </button>
  );
};
