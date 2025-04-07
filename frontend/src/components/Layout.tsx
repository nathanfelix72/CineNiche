import React from 'react';
import Footer from './Footer'; // adjust the path if needed

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-grow">{children}</main>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
