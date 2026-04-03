'use client';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder = '',
  multiline = false,
  rows = 3,
}: TextFieldProps) {
  const baseClasses =
    'w-full bg-stone-900/60 border border-stone-700 rounded px-3 py-2 text-stone-200 ' +
    'placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-1 ' +
    'focus:ring-amber-600 transition-colors duration-200';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={baseClasses + ' resize-none'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className={baseClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
