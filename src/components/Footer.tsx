export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} ConsultBridge. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-600">
            免責事項
          </a>
          <a href="#" className="hover:text-primary-600">
            プライバシーポリシー
          </a>
        </div>
      </div>
    </footer>
  );
}
