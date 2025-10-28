import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">{project.title}</h3>
          <p className="text-xs text-slate-500">{project.maskedCompany}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-primary-700">
          {project.requiredSkills.map((skill) => (
            <span key={skill} className="rounded-full bg-primary-100 px-2 py-1">
              {skill}
            </span>
          ))}
          {(project.niceToHaveSkills ?? []).map((skill) => (
            <span key={skill} className="rounded-full border border-primary-100 px-2 py-1 text-primary-500">
              {skill}
            </span>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <dt className="font-medium text-slate-500">単価レンジ</dt>
            <dd>
              {project.rateLower.toLocaleString()}〜{project.rateUpper.toLocaleString()} 円/月
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">稼働率</dt>
            <dd>{project.utilization}%</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">開始日</dt>
            <dd>{project.startDate}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">勤務形態</dt>
            <dd>{project.workStyle}</dd>
          </div>
        </dl>
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-md border border-primary-300 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-50"
      >
        詳細を見る
      </Link>
    </article>
  );
}
