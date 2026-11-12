import { forwardRef, type AnchorHTMLAttributes } from 'react';

export const ButtonLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  function ButtonLink({ className = '', children, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={`inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  },
);
