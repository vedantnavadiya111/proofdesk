import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-midnight-900 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-midnight-900 text-ivory-50 shadow-sm hover:bg-midnight-800 active:bg-midnight-950',
        destructive:
          'bg-conflicting text-ivory-50 shadow-sm hover:bg-conflicting-dark',
        outline:
          'border border-midnight-200 bg-transparent text-midnight-900 shadow-sm hover:bg-midnight-100 hover:text-midnight-900',
        secondary:
          'bg-midnight-100 text-midnight-900 shadow-sm hover:bg-midnight-200',
        ghost:
          'text-midnight-700 hover:bg-midnight-100 hover:text-midnight-900',
        link: 'text-midnight-900 underline-offset-4 hover:underline p-0 h-auto font-normal',
        teal: 'bg-verified text-ivory-50 shadow-sm hover:bg-verified-dark',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
