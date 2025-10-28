import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">404</p>
        <h1 className="text-3xl font-bold text-slate-900">お探しのページが見つかりませんでした</h1>
        <p className="text-sm text-slate-600">
          URLが正しいかご確認いただくか、ホームに戻って操作を続けてください。
        </p>
      </div>
      <Link
        to="/"
        className="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700"
      >
        ホームに戻る
      </Link>
    </main>
  );
}
