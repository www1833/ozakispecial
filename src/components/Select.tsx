import { ChangeEvent } from 'react';

interface SelectProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  required?: boolean;
  name?: string;
  error?: string;
}

export function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  name,
  error,
}: SelectProps<T>) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as T);
  };

  return (
    <div className="space-y-1">
      {label ? (
        <label className="block text-sm font-medium text-slate-700" htmlFor={name}>
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
          error ? 'border-rose-400' : 'border-slate-200'
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${name}-error`} className="text-xs text-rose-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
