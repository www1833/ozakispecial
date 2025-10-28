interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="ページナビゲーション">
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`min-w-[2.25rem] rounded-full border px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
            p === page
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          {p}
        </button>
      ))}
    </nav>
  );
}
