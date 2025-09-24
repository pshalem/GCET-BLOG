// components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
// Remove the old Sidebar import

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
