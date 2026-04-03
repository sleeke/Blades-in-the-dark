'use client';

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  dotStyle?: boolean;
}

export default function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  dotStyle = false,
}: CounterProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  if (dotStyle) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
          {label}
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              onClick={() => onChange(value === i + 1 ? i : i + 1)}
              className={
                'w-5 h-5 rounded-full border-2 transition-all duration-150 ' +
                (i < value
                  ? 'bg-amber-500 border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                  : 'bg-stone-900 border-stone-600 hover:border-amber-700')
              }
              aria-label={`Set ${label} to ${i + 1}`}
            />
          ))}
          {value > 0 && (
            <button
              onClick={() => onChange(0)}
              className="text-xs text-stone-500 hover:text-red-400 transition-colors ml-1"
              aria-label={`Reset ${label}`}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-7 h-7 flex items-center justify-center rounded border border-stone-600 
                     text-stone-300 hover:border-amber-600 hover:text-amber-400 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150
                     bg-stone-900/60"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-8 text-center text-lg font-bold text-amber-400 tabular-nums">
          {value}
        </span>
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-7 h-7 flex items-center justify-center rounded border border-stone-600 
                     text-stone-300 hover:border-amber-600 hover:text-amber-400 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150
                     bg-stone-900/60"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
