import React from 'react';
import Navbar from '../Header/Navbar';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-fullmx-auto">{children}</main>
    </>
  );
};

export default HomeLayout;