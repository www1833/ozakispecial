import { FormEvent, useMemo, useState } from 'react';
import {
  deleteConsultant,
  deleteInquiry,
  deleteProject,
  getConsultants,
  getInquiries,
  getProjects,
  updateConsultant,
  updateProject,
} from '../lib/storage';
import { Consultant, Project } from '../types';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

const ADMIN_SESSION_KEY = 'consultbridge:admin-session';
const PASSCODE = '4321';

type Tab = 'consultants' | 'projects' | 'inquiries';

interface EditConsultantState extends Pick<Consultant, 'id' | 'name' | 'preferredRate' | 'preferredUtilization' | 'contact'> {}
interface EditProjectState
  extends Pick<Project, 'id' | 'title' | 'rateLower' | 'rateUpper' | 'utilization' | 'contact'> {}

export function Admin() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('consultants');
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [passcode, setPasscode] = useState('');
  const [consultants, setConsultants] = useState(() => getConsultants());
  const [projects, setProjects] = useState(() => getProjects());
  const [inquiries, setInquiries] = useState(() => getInquiries());
  const [editingConsultant, setEditingConsultant] = useState<EditConsultantState | null>(null);
  const [editingProject, setEditingProject] = useState<EditProjectState | null>(null);

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passcode === PASSCODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setAuthenticated(true);
      showToast('管理画面にログインしました。', 'success');
    } else {
      showToast('パスコードが正しくありません。', 'error');
    }
  };

  const refreshData = () => {
    setConsultants(getConsultants());
    setProjects(getProjects());
    setInquiries(getInquiries());
  };

  const monthlyStats = useMemo(() => {
    const months = ['2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
    return months.map((month) => ({
      month,
      consultants: consultants.filter((item) => item.createdAt.startsWith(month)).length,
      projects: projects.filter((item) => item.createdAt.startsWith(month)).length,
      inquiries: inquiries.filter((item) => item.createdAt.startsWith(month)).length,
    }));
  }, [consultants, projects, inquiries]);

  const maxBarValue = useMemo(() => {
    return Math.max(
      1,
      ...monthlyStats.map((stat) => Math.max(stat.consultants, stat.projects, stat.inquiries))
    );
  }, [monthlyStats]);

  if (!authenticated) {
    return (
      <main className="mx-auto max-w-md px-4 py-20">
        <form onSubmit={handleAuth} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-primary-700">管理者ログイン</h1>
          <p className="text-sm text-slate-600">パスコードを入力してください。</p>
          <input
            type="password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            aria-label="パスコード"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            ログイン
          </button>
        </form>
      </main>
    );
  }

  const handleConsultantUpdate = () => {
    if (!editingConsultant) return;
    updateConsultant({
      ...consultants.find((item) => item.id === editingConsultant.id)!,
      name: editingConsultant.name,
      preferredRate: editingConsultant.preferredRate,
      preferredUtilization: editingConsultant.preferredUtilization,
      contact: editingConsultant.contact,
    });
    showToast('コンサルタント情報を更新しました。', 'success');
    setEditingConsultant(null);
    refreshData();
  };

  const handleProjectUpdate = () => {
    if (!editingProject) return;
    updateProject({
      ...projects.find((item) => item.id === editingProject.id)!,
      title: editingProject.title,
      rateLower: editingProject.rateLower,
      rateUpper: editingProject.rateUpper,
      utilization: editingProject.utilization,
      contact: editingProject.contact,
    });
    showToast('案件情報を更新しました。', 'success');
    setEditingProject(null);
    refreshData();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-700">管理ダッシュボード</h1>
          <p className="text-sm text-slate-600">登録データの確認・更新を行えます。</p>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            setAuthenticated(false);
          }}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          ログアウト
        </button>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {monthlyStats.map((stat) => {
          const barHeight = (value: number) => (value / maxBarValue) * 80;
          return (
            <article key={stat.month} className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
              <h2 className="text-sm font-semibold text-primary-700">{stat.month}</h2>
              <div className="mt-3 flex items-end gap-2">
                <div className="flex-1 text-center">
                  <div className="mx-auto h-20 w-6 rounded bg-primary-400" style={{ height: `${barHeight(stat.consultants)}px` }} />
                  <p className="mt-1 text-xs text-primary-700">コンサル {stat.consultants}</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="mx-auto h-20 w-6 rounded bg-primary-500" style={{ height: `${barHeight(stat.projects)}px` }} />
                  <p className="mt-1 text-xs text-primary-700">案件 {stat.projects}</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="mx-auto h-20 w-6 rounded bg-accent" style={{ height: `${barHeight(stat.inquiries)}px` }} />
                  <p className="mt-1 text-xs text-primary-700">問合せ {stat.inquiries}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <section className="mt-8">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTab('consultants')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === 'consultants' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            コンサル一覧
          </button>
          <button
            type="button"
            onClick={() => setTab('projects')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === 'projects' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            案件一覧
          </button>
          <button
            type="button"
            onClick={() => setTab('inquiries')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === 'inquiries' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            問い合わせ
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {tab === 'consultants' && (
            <div className="space-y-4">
              {consultants.map((consultant) => (
                <article key={consultant.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-700">{consultant.name}</h3>
                      <p className="text-xs text-slate-500">
                        {consultant.preferredRate.type}{' '}
                        {consultant.preferredRate.amount.toLocaleString()} 円 / 稼働率 {consultant.preferredUtilization}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingConsultant({
                            id: consultant.id,
                            name: consultant.name,
                            preferredRate: consultant.preferredRate,
                            preferredUtilization: consultant.preferredUtilization,
                            contact: consultant.contact,
                          })
                        }
                        className="rounded-md border border-primary-300 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteConsultant(consultant.id);
                          showToast('削除しました。', 'success');
                          refreshData();
                        }}
                        className="rounded-md border border-rose-300 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {tab === 'projects' && (
            <div className="space-y-4">
              {projects.map((project) => (
                <article key={project.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-700">{project.title}</h3>
                      <p className="text-xs text-slate-500">
                        {project.rateLower.toLocaleString()}〜{project.rateUpper.toLocaleString()} 円 / 稼働率 {project.utilization}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            id: project.id,
                            title: project.title,
                            rateLower: project.rateLower,
                            rateUpper: project.rateUpper,
                            utilization: project.utilization,
                            contact: project.contact,
                          })
                        }
                        className="rounded-md border border-primary-300 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteProject(project.id);
                          showToast('削除しました。', 'success');
                          refreshData();
                        }}
                        className="rounded-md border border-rose-300 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {tab === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <p className="text-sm text-slate-600">問い合わせはまだありません。</p>
              ) : (
                inquiries.map((inquiry) => (
                  <article key={inquiry.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-700">{inquiry.name}</h3>
                        <p className="text-xs text-slate-500">{inquiry.email}</p>
                        <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{inquiry.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteInquiry(inquiry.id);
                          showToast('問い合わせを削除しました。', 'success');
                          refreshData();
                        }}
                        className="self-start rounded-md border border-rose-300 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        削除
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </section>
      <Modal title="コンサルタント編集" open={Boolean(editingConsultant)} onClose={() => setEditingConsultant(null)}>
        {editingConsultant && (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleConsultantUpdate();
            }}
          >
            <label className="flex flex-col text-sm text-slate-600">
              氏名
              <input
                value={editingConsultant.name}
                onChange={(event) =>
                  setEditingConsultant({ ...editingConsultant, name: event.target.value })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              希望単価
              <input
                type="number"
                inputMode="numeric"
                value={editingConsultant.preferredRate.amount}
                onChange={(event) =>
                  setEditingConsultant({
                    ...editingConsultant,
                    preferredRate: {
                      ...editingConsultant.preferredRate,
                      amount: Number(event.target.value),
                    },
                  })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              希望稼働率
              <input
                type="number"
                inputMode="numeric"
                value={editingConsultant.preferredUtilization}
                onChange={(event) =>
                  setEditingConsultant({
                    ...editingConsultant,
                    preferredUtilization: Number(event.target.value),
                  })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              連絡先
              <input
                type="email"
                value={editingConsultant.contact}
                onChange={(event) =>
                  setEditingConsultant({ ...editingConsultant, contact: event.target.value })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingConsultant(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                保存
              </button>
            </div>
          </form>
        )}
      </Modal>
      <Modal title="案件編集" open={Boolean(editingProject)} onClose={() => setEditingProject(null)}>
        {editingProject && (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleProjectUpdate();
            }}
          >
            <label className="flex flex-col text-sm text-slate-600">
              案件名
              <input
                value={editingProject.title}
                onChange={(event) => setEditingProject({ ...editingProject, title: event.target.value })}
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              単価下限
              <input
                type="number"
                inputMode="numeric"
                value={editingProject.rateLower}
                onChange={(event) =>
                  setEditingProject({ ...editingProject, rateLower: Number(event.target.value) })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              単価上限
              <input
                type="number"
                inputMode="numeric"
                value={editingProject.rateUpper}
                onChange={(event) =>
                  setEditingProject({ ...editingProject, rateUpper: Number(event.target.value) })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              稼働率
              <input
                type="number"
                inputMode="numeric"
                value={editingProject.utilization}
                onChange={(event) =>
                  setEditingProject({ ...editingProject, utilization: Number(event.target.value) })
                }
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <label className="flex flex-col text-sm text-slate-600">
              連絡先
              <input
                type="email"
                value={editingProject.contact}
                onChange={(event) => setEditingProject({ ...editingProject, contact: event.target.value })}
                className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                保存
              </button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
