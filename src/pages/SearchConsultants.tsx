import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getConsultants } from '../lib/storage';
import { filterConsultants, paginate, sortConsultants } from '../lib/filters';
import { ConsultantCard } from '../components/ConsultantCard';
import { Pagination } from '../components/Pagination';

const sortLabels: Record<string, string> = {
  new: '新着順',
  'rate-low': '単価が低い順',
  experience: '経験年数が長い順',
};

export function SearchConsultants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const keyword = searchParams.get('keyword') ?? '';
  const skillsParam = searchParams.get('skills') ?? '';
  const experience = searchParams.get('experience') ?? '';
  const rateMax = searchParams.get('rateMax') ?? '';
  const utilization = searchParams.get('utilization') ?? '';
  const location = searchParams.get('location') ?? '';
  const remote = searchParams.get('remote') ?? '';
  const industry = searchParams.get('industry') ?? '';
  const sort = (searchParams.get('sort') ?? 'new') as 'new' | 'rate-low' | 'experience';

  const consultants = useMemo(() => getConsultants(), []);
  const [skillsInput, setSkillsInput] = useState(skillsParam);

  useEffect(() => {
    setSkillsInput(skillsParam);
  }, [skillsParam]);

  const filtered = useMemo(() => {
    const filters = {
      keyword: keyword || undefined,
      skills: skillsParam
        ? skillsParam
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined,
      experience: experience ? Number(experience) : undefined,
      rateMax: rateMax ? Number(rateMax) : undefined,
      utilization: utilization ? Number(utilization) : undefined,
      location: location || undefined,
      remote: remote || undefined,
      industry: industry || undefined,
      sort,
    };

    const filteredConsultants = filterConsultants(consultants, filters);
    const sortedConsultants = sortConsultants(filteredConsultants, sort);
    return sortedConsultants;
  }, [consultants, experience, industry, keyword, location, rateMax, remote, skillsParam, sort, utilization]);

  const { items: pagedConsultants, totalPages } = useMemo(
    () => paginate(filtered, page, 6),
    [filtered, page]
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handleSkillsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParam('skills', skillsInput);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-700">人材を探す</h1>
          <p className="text-sm text-slate-600">スキル・単価・稼働率でフィルタリングできます。</p>
        </div>
        <Link
          to="/consultants/new"
          className="inline-flex items-center justify-center rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          コンサル登録を依頼する
        </Link>
      </header>
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="keyword">
            キーワード
          </label>
          <input
            id="keyword"
            name="keyword"
            type="search"
            value={keyword}
            onChange={(event) => updateParam('keyword', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="経歴や自己PR"
          />
        </div>
        <form className="space-y-1" onSubmit={handleSkillsSubmit}>
          <label className="text-sm font-medium text-slate-700" htmlFor="skills">
            スキル (カンマ区切り)
          </label>
          <div className="flex gap-2">
            <input
              id="skills"
              name="skills"
              type="text"
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              placeholder="例: PMO,戦略"
            />
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              設定
            </button>
          </div>
        </form>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="experience">
            経験年数 (以上)
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            inputMode="numeric"
            value={experience}
            onChange={(event) => updateParam('experience', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 5"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="rateMax">
            希望単価 (上限)
          </label>
          <input
            id="rateMax"
            name="rateMax"
            type="number"
            inputMode="numeric"
            value={rateMax}
            onChange={(event) => updateParam('rateMax', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 1000000"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="utilization">
            稼働率 (以上)
          </label>
          <input
            id="utilization"
            name="utilization"
            type="number"
            inputMode="numeric"
            value={utilization}
            onChange={(event) => updateParam('utilization', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="location">
            拠点
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(event) => updateParam('location', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 東京都"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="remote">
            リモート可否
          </label>
          <select
            id="remote"
            name="remote"
            value={remote}
            onChange={(event) => updateParam('remote', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          >
            <option value="">指定なし</option>
            <option value="true">リモート可</option>
            <option value="false">リモート不可</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="industry">
            得意業界
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            value={industry}
            onChange={(event) => updateParam('industry', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 製造"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="sort">
            並び替え
          </label>
          <select
            id="sort"
            name="sort"
            value={sort}
            onChange={(event) => updateParam('sort', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="mt-10 space-y-6">
        <p className="text-sm text-slate-600">{filtered.length} 名のコンサルタントが見つかりました。</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pagedConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => updateParam('page', String(nextPage))}
        />
      </section>
    </main>
  );
}
