import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-midnight-900 text-ivory-50 shadow hover:bg-midnight-800',
        secondary:
          'border-transparent bg-midnight-100 text-midnight-900 hover:bg-midnight-200',
        destructive:
          'border-transparent bg-conflicting text-ivory-50 shadow hover:bg-conflicting-dark',
        outline: 'text-midnight-900 border-midnight-200',
        verified:
          'border-verified/20 bg-verified-bg text-verified-dark font-medium',
        pending:
          'border-pending/20 bg-pending-bg text-pending-dark font-medium',
        conflicting:
          'border-conflicting/20 bg-conflicting-bg text-conflicting-dark font-medium',
        notproven:
          'border-notproven/20 bg-notproven-bg text-notproven-dark font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
