'use client';

type SelectOption = { value: string; label: string } | string;

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
        {label}
      </label>
      <select
        className={
          'w-full bg-stone-900/60 border border-stone-700 rounded px-3 py-2 text-stone-200 ' +
          'focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ' +
          'transition-colors duration-200 appearance-none cursor-pointer'
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}
