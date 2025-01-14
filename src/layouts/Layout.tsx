// Layout.js
import React from 'react';
import Sidebar from '../components/Sidebar';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-5 overflow-auto">
        {children}
      </main>
    </div>
  );
};


export default Layout;

