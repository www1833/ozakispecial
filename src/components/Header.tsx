import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'ホーム' },
  { to: '/consultants/new', label: 'コンサル登録' },
  { to: '/companies/new', label: '企業登録' },
  { to: '/projects/search', label: '案件を探す' },
  { to: '/consultants/search', label: '人材を探す' },
  { to: '/admin', label: '管理' },
];

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-xl font-semibold text-primary-700">
          ConsultBridge
        </NavLink>
        <nav>
          <ul className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1 transition hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
                      isActive ? 'bg-primary-100 text-primary-800' : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
