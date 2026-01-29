import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Collapsible = ({ 
  children, 
  defaultOpen = false, 
  className = '',
  ...props 
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child: any) => {
        if (child?.type === CollapsibleTrigger) {
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        if (child?.type === CollapsibleContent) {
          return React.cloneElement(child, { isOpen });
        }
        return child;
      })}
    </div>
  );
};

interface CollapsibleTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const CollapsibleTrigger = ({ 
  children, 
  isOpen = false, 
  setIsOpen,
  className = '',
  ...props 
}: CollapsibleTriggerProps) => {
  return (
    <button
      onClick={() => setIsOpen?.(!isOpen)}
      className={`flex items-center justify-between w-full ${className}`}
      {...props}
    >
      {children}
      <ChevronDown 
        className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
      />
    </button>
  );
};

interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen?: boolean;
}

export const CollapsibleContent = ({ 
  children, 
  isOpen = false, 
  className = '',
  ...props 
}: CollapsibleContentProps) => {
  if (!isOpen) return null;
  
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};
