import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

const trustPoints = [
  {
    title: '厳選されたコンサルタント',
    description: '実績豊富なプロフェッショナルのみをデータベース化。',
  },
  {
    title: '案件との高精度マッチング',
    description: 'スキル・稼働率・単価など多角的な条件でフィット度を算出。',
  },
  {
    title: '迅速なコミュニケーション',
    description: '問い合わせから24時間以内にコーディネーターがサポート。',
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              コンサルタントと企業をつなぐ架け橋
            </p>
            <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              ハイレベルなコンサルタントと、成長を加速させたい企業の出会いを最速で実現
            </h1>
            <p className="text-lg text-slate-600">
              ConsultBridgeは、DXや戦略立案に強いコンサルタントと課題解決を求める企業を高精度にマッチングするプラットフォームです。
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/consultants/new')}
                className="rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700"
              >
                コンサル登録はこちら
              </button>
              <button
                type="button"
                onClick={() => navigate('/companies/new')}
                className="rounded-md border border-primary-300 px-5 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                企業登録はこちら
              </button>
              <button
                type="button"
                onClick={() => navigate('/projects/search')}
                className="rounded-md border border-transparent px-5 py-3 text-sm font-semibold text-primary-700 hover:underline"
              >
                案件をさがす
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-primary-100 bg-white/80 p-8 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-primary-700">条件からクイック検索</h2>
            <SearchBar
              onSearch={({ role, skill, rate, utilization }) => {
                const params = new URLSearchParams();
                if (role) params.set('role', role);
                if (skill) params.set('skills', skill);
                if (rate) params.set('rateMax', rate);
                if (utilization) params.set('utilization', utilization);
                navigate({ pathname: '/projects/search', search: params.toString() });
              }}
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold text-primary-700">選ばれる理由</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {trustPoints.map((point) => (
              <article key={point.title} className="rounded-2xl border border-primary-100 bg-primary-50/70 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-primary-800">{point.title}</h3>
                <p className="mt-3 text-sm text-primary-700">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
