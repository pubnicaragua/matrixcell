// Layout.js
import React from 'react';
import Sidebar from '../components/Sidebar';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 p-5 overflow-scroll">
        {children}
      </main>
    </div>
  );
};


export default Layout;

