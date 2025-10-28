import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addInquiry, getConsultants } from '../lib/storage';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

export function ConsultantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  const consultant = useMemo(() => getConsultants().find((item) => item.id === id), [id]);

  if (!consultant) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-slate-600">人材情報が見つかりませんでした。</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          戻る
        </button>
      </main>
    );
  }

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const message = (formData.get('message') as string) || '';

    if (!name || !email || !message) {
      showToast('必要事項を入力してください。', 'error');
      return;
    }

    addInquiry({
      id: crypto.randomUUID(),
      targetId: consultant.id,
      targetType: 'consultant',
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });

    showToast('お問い合わせを送信しました。', 'success');
    setOpen(false);
    event.currentTarget.reset();
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/consultants/search" className="text-sm text-primary-600">
        ← 検索結果に戻る
      </Link>
      <article className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">{consultant.skills.join(' / ')}</p>
          <h1 className="text-2xl font-semibold text-primary-700">{consultant.name}</h1>
          <p className="text-sm text-slate-600">
            経験 {consultant.experienceYears} 年 / {consultant.baseLocation} / リモート {consultant.remote ? '可' : '不可'}
          </p>
        </header>
        <dl className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">希望単価</dt>
            <dd>
              {consultant.preferredRate.type} {consultant.preferredRate.amount.toLocaleString()} 円
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">希望稼働率</dt>
            <dd>{consultant.preferredUtilization}%</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">稼働開始可能日</dt>
            <dd>{consultant.availableFrom}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">稼働期間目安</dt>
            <dd>{consultant.engagementLength}</dd>
          </div>
        </dl>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-700">自己PR</h2>
          <p className="text-sm leading-relaxed text-slate-700">{consultant.bio}</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-700">得意業界</h2>
          <div className="flex flex-wrap gap-2 text-xs text-primary-700">
            {consultant.industries.map((industry) => (
              <span key={industry} className="rounded-full bg-primary-100 px-3 py-1">
                {industry}
              </span>
            ))}
          </div>
        </section>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700"
        >
          このコンサルタントに問い合わせる
        </button>
      </article>
      <Modal title="お問い合わせ" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleInquirySubmit} className="space-y-3">
          <label className="flex flex-col text-sm text-slate-600">
            貴社名 / お名前
            <input
              name="name"
              type="text"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              required
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600">
            メールアドレス
            <input
              name="email"
              type="email"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              required
            />
          </label>
          <label className="flex flex-col text-sm text-slate-600">
            お問い合わせ内容
            <textarea
              name="message"
              rows={4}
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              required
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              送信する
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
