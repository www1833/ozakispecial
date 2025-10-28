interface RangeProps {
  label: string;
  minLabel?: string;
  maxLabel?: string;
  minValue: number | '';
  maxValue: number | '';
  onMinChange: (value: number | '') => void;
  onMaxChange: (value: number | '') => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export function Range({
  label,
  minLabel = '最小',
  maxLabel = '最大',
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
}: RangeProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-700">{label}</legend>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col text-xs text-slate-500">
          {minLabel}
          <input
            type="number"
            inputMode="numeric"
            value={minValue}
            onChange={(event) => onMinChange(event.target.value ? Number(event.target.value) : '')}
            placeholder={minPlaceholder}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
        </label>
        <label className="flex flex-1 flex-col text-xs text-slate-500">
          {maxLabel}
          <input
            type="number"
            inputMode="numeric"
            value={maxValue}
            onChange={(event) => onMaxChange(event.target.value ? Number(event.target.value) : '')}
            placeholder={maxPlaceholder}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
        </label>
      </div>
    </fieldset>
  );
}
