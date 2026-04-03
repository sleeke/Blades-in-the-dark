'use client';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function CheckboxField({
  label,
  checked,
  onChange,
  description,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={
            'w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ' +
            (checked
              ? 'bg-amber-600 border-amber-500'
              : 'bg-stone-900 border-stone-600 group-hover:border-amber-700')
          }
        >
          {checked && (
            <svg
              className="w-3 h-3 text-stone-950"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className={
            'text-sm font-medium transition-colors duration-200 ' +
            (checked ? 'text-amber-400' : 'text-stone-300 group-hover:text-stone-100')
          }
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-stone-500 mt-0.5">{description}</span>
        )}
      </div>
    </label>
  );
}
