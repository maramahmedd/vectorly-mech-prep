import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './ui/navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component that provides consistent navigation across pages
 *
 * Usage:
 * <Layout>
 *   <YourPage />
 * </Layout>
 *
 * The landing page ("/") has its own custom navigation, so this Layout
 * is used for all other pages (practice, dashboard, etc.)
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Landing page has its own custom nav, don't show default navbar
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
