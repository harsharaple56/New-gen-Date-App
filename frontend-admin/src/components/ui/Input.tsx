import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className, id, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>}
    <input
      ref={ref}
      id={id}
      className={cn(
        'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20',
        className,
      )}
      {...props}
    />
  </label>
));
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, className, children, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>}
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  </label>
));
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, className, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>}
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/20',
        className,
      )}
      {...props}
    />
  </label>
));
Textarea.displayName = 'Textarea';
