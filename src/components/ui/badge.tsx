import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        secondary: 'border-transparent bg-zinc-800 text-zinc-300 border-zinc-700',
        destructive: 'border-transparent bg-rose-500/20 text-rose-300 border-rose-500/30',
        outline: 'text-zinc-300 border-zinc-700/80 bg-zinc-900/40',
        canon: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
        filler: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
        ova: 'border-purple-500/30 bg-purple-500/15 text-purple-300',
        movie: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300',
        what_if: 'border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  key?: React.Key;
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
