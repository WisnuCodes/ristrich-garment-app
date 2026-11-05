import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

export function MainLayout({ children, activePage = '', fullWidth = false }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar activePage={activePage} />
      <main className="flex-1 w-full">
        {fullWidth ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

