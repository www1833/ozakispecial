import { Link } from 'react-router-dom';
import { Consultant } from '../types';

interface ConsultantCardProps {
  consultant: Consultant;
}

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">{consultant.name.slice(0, 1)}. さん</h3>
          <p className="text-xs text-slate-500">経験 {consultant.experienceYears} 年 / {consultant.baseLocation}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-primary-700">
          {consultant.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-primary-100 px-2 py-1">
              {skill}
            </span>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <dt className="font-medium text-slate-500">希望単価</dt>
            <dd>
              {consultant.preferredRate.type} {consultant.preferredRate.amount.toLocaleString()} 円
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">稼働率</dt>
            <dd>{consultant.preferredUtilization}%</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">開始可能</dt>
            <dd>{consultant.availableFrom}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">リモート</dt>
            <dd>{consultant.remote ? '可' : '不可'}</dd>
          </div>
        </dl>
      </div>
      <Link
        to={`/consultants/${consultant.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-50"
      >
        詳細を見る
      </Link>
    </article>
  );
}
