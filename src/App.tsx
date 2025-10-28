import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastProvider, useToast } from './components/Toast';
import { Home } from './pages/Home';
import { ConsultantNew } from './pages/ConsultantNew';
import { CompanyNew } from './pages/CompanyNew';
import { SearchProjects } from './pages/SearchProjects';
import { SearchConsultants } from './pages/SearchConsultants';
import { ProjectDetail } from './pages/ProjectDetail';
import { ConsultantDetail } from './pages/ConsultantDetail';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { seedData } from './lib/storage';

function AppContent() {
  const { showToast } = useToast();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedData()
      .catch((error) => {
        console.error(error);
        showToast('データの初期化に失敗しました。ページを再読み込みしてください。', 'error');
      })
      .finally(() => setReady(true));
  }, [showToast]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-600">データを読み込み中です…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultants/new" element={<ConsultantNew />} />
          <Route path="/companies/new" element={<CompanyNew />} />
          <Route path="/projects/search" element={<SearchProjects />} />
          <Route path="/consultants/search" element={<SearchConsultants />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/consultants/:id" element={<ConsultantDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
