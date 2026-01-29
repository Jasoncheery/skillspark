import { HTMLAttributes, ReactNode } from 'react';

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ScrollArea = ({ className = '', children, ...props }: ScrollAreaProps) => {
  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{ scrollbarWidth: 'thin' }}
      {...props}
    >
      {children}
    </div>
  );
};
