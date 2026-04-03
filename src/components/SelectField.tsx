'use client';

type SelectOption = { value: string; label: string } | string;

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | { value: string; label: string }[];
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: SelectFieldProps) {
  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-900/60 border border-stone-700 rounded px-3 py-2 text-stone-200
                   focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600
                   transition-colors duration-200 appearance-none cursor-pointer"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {normalised.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
