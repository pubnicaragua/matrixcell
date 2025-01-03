// Layout.js
import React from 'react';
import Sidebar from '../components/Sidebar';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto' as 'auto',
  },
};

export default Layout;
