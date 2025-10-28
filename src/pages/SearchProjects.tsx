import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProjects } from '../lib/storage';
import { filterProjects, paginate, sortProjects } from '../lib/filters';
import { Pagination } from '../components/Pagination';
import { ProjectCard } from '../components/ProjectCard';
import { Range } from '../components/Range';

const sortLabels: Record<string, string> = {
  new: '新着順',
  'rate-high': '単価が高い順',
  'start-soon': '開始日が近い順',
};

export function SearchProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const keyword = searchParams.get('keyword') ?? '';
  const role = searchParams.get('role') ?? '';
  const skillsParam = searchParams.get('skills') ?? '';
  const rateMin = searchParams.get('rateMin') ?? '';
  const rateMax = searchParams.get('rateMax') ?? '';
  const utilization = searchParams.get('utilization') ?? '';
  const workStyle = searchParams.get('workStyle') ?? '';
  const industry = searchParams.get('industry') ?? '';
  const sort = (searchParams.get('sort') ?? 'new') as 'new' | 'rate-high' | 'start-soon';

  const projects = useMemo(() => getProjects(), []);
  const [skillsInput, setSkillsInput] = useState(skillsParam);

  useEffect(() => {
    setSkillsInput(skillsParam);
  }, [skillsParam]);

  const filtered = useMemo(() => {
    const filters = {
      keyword: keyword || undefined,
      role: role || undefined,
      skills: skillsParam
        ? skillsParam
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined,
      rateMin: rateMin ? Number(rateMin) : undefined,
      rateMax: rateMax ? Number(rateMax) : undefined,
      utilization: utilization ? Number(utilization) : undefined,
      workStyle: workStyle || undefined,
      industry: industry || undefined,
      sort,
    };

    const filteredProjects = filterProjects(projects, filters);
    const sortedProjects = sortProjects(filteredProjects, sort);
    return sortedProjects;
  }, [industry, keyword, projects, rateMax, rateMin, role, skillsParam, sort, utilization, workStyle]);

  const { items: pagedProjects, totalPages } = useMemo(
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
          <h1 className="text-2xl font-semibold text-primary-700">案件を探す</h1>
          <p className="text-sm text-slate-600">条件を絞り込んで、最適な案件を見つけましょう。</p>
        </div>
        <Link
          to="/companies/new"
          className="inline-flex items-center justify-center rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          企業案件を登録する
        </Link>
      </header>
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
        <div className="space-y-1 md:col-span-2">
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
            placeholder="案件名や概要で検索"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="role">
            役割
          </label>
          <input
            id="role"
            name="role"
            type="text"
            value={role}
            onChange={(event) => updateParam('role', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: PMO"
          />
        </div>
        <form className="space-y-1" onSubmit={handleSkillsSubmit}>
          <label className="text-sm font-medium text-slate-700" htmlFor="skills">
            必須スキル (カンマ区切り)
          </label>
          <div className="flex gap-2">
            <input
              id="skills"
              name="skills"
              type="text"
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              placeholder="例: データ分析,PMO"
            />
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              設定
            </button>
          </div>
        </form>
        <div className="md:col-span-2">
          <Range
            label="単価レンジ"
            minLabel="下限"
            maxLabel="上限"
            minValue={rateMin ? Number(rateMin) : ''}
            maxValue={rateMax ? Number(rateMax) : ''}
            onMinChange={(value) => updateParam('rateMin', value === '' ? '' : String(value))}
            onMaxChange={(value) => updateParam('rateMax', value === '' ? '' : String(value))}
            minPlaceholder="例: 700000"
            maxPlaceholder="例: 1200000"
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
          <label className="text-sm font-medium text-slate-700" htmlFor="workStyle">
            勤務形態
          </label>
          <select
            id="workStyle"
            name="workStyle"
            value={workStyle}
            onChange={(event) => updateParam('workStyle', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          >
            <option value="">指定なし</option>
            <option value="リモート">リモート</option>
            <option value="出社">出社</option>
            <option value="ハイブリッド">ハイブリッド</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="industry">
            業界
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            value={industry}
            onChange={(event) => updateParam('industry', event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="例: 金融"
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
        <p className="text-sm text-slate-600">{filtered.length} 件の案件が見つかりました。</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pagedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
