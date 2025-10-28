import { useMemo, useState } from 'react';
import classNames from 'classnames';

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  required?: boolean;
  error?: string;
}

export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  suggestions = [],
  required,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const filteredSuggestions = useMemo(() => {
    const keyword = inputValue.trim().toLowerCase();
    if (!keyword) return suggestions.filter((suggestion) => !values.includes(suggestion));
    return suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(keyword) && !values.includes(suggestion)
    );
  }, [inputValue, suggestions, values]);

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized) return;
    if (values.includes(normalized)) return;
    onChange([...values, normalized]);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((value) => value !== tag));
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      <div className={classNames('rounded-md border bg-white p-2', error ? 'border-rose-400' : 'border-slate-200')}>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-700">
              {value}
              <button
                type="button"
                onClick={() => removeTag(value)}
                className="text-primary-500 hover:text-primary-700"
                aria-label={`${value}を削除`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value;
              if (value.endsWith(',')) {
                addTag(value.slice(0, -1));
                return;
              }
              setInputValue(value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                addTag(inputValue);
              }
              if (event.key === 'Backspace' && !inputValue) {
                removeTag(values[values.length - 1]);
              }
            }}
            onBlur={() => addTag(inputValue)}
            placeholder={placeholder}
            className="min-w-[8rem] flex-1 border-0 text-sm focus:ring-0"
            aria-describedby={error ? `${label}-error` : undefined}
          />
        </div>
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {filteredSuggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="rounded-full border border-primary-200 px-3 py-1 hover:bg-primary-50 hover:text-primary-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      {error ? (
        <p id={`${label}-error`} className="text-xs text-rose-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
