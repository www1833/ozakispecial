import { FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (params: { role: string; skill: string; rate: string; utilization: string }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [rate, setRate] = useState('');
  const [utilization, setUtilization] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({ role, skill, rate, utilization });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-lg md:grid-cols-5">
      <label className="flex flex-col text-sm text-slate-600">
        職種
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="mt-1 rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          placeholder="PMO / データ"
        />
      </label>
      <label className="flex flex-col text-sm text-slate-600">
        スキル
        <input
          value={skill}
          onChange={(event) => setSkill(event.target.value)}
          className="mt-1 rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          placeholder="例: データ分析"
        />
      </label>
      <label className="flex flex-col text-sm text-slate-600">
        単価 (上限)
        <input
          type="number"
          inputMode="numeric"
          value={rate}
          onChange={(event) => setRate(event.target.value)}
          className="mt-1 rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          placeholder="1000000"
        />
      </label>
      <label className="flex flex-col text-sm text-slate-600">
        稼働率 (以上)
        <input
          type="number"
          inputMode="numeric"
          value={utilization}
          onChange={(event) => setUtilization(event.target.value)}
          className="mt-1 rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          placeholder="60"
        />
      </label>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          さがす
        </button>
      </div>
    </form>
  );
}
