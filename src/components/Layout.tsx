import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, School, FlaskConical, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound, SOUNDS } from '../lib/audio';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Learn', path: '/', icon: School },
    { name: 'Sandbox', path: '/sandbox', icon: FlaskConical },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const handleNavClick = () => {
    playSound(SOUNDS.CLICK);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="h-[60px] md:h-[70px] bg-white border-b border-border sticky top-0 z-50 flex items-center">
        <nav className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-12">
            <Link 
              to="/" 
              onClick={handleNavClick}
              className="text-xl md:text-2xl font-extrabold tracking-tighter text-primary"
            >
              SORTIFY
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={cn(
                    "font-bold text-sm transition-all duration-300",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex gap-2 md:gap-4">
              <div className="bg-surface px-2 md:px-4 py-1 rounded-lg text-center">
                <span className="block text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase">Points</span>
                <span className="block text-xs md:text-sm font-extrabold">1,250</span>
              </div>
              <div className="bg-surface px-2 md:px-4 py-1 rounded-lg text-center">
                <span className="block text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase">Level</span>
                <span className="block text-xs md:text-sm font-extrabold">04</span>
              </div>
            </div>
            <button 
              onClick={handleNavClick}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <UserCircle size={24} className="md:w-7 md:h-7" />
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-grow pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1 transition-all duration-200",
              location.pathname === item.path
                ? "text-primary"
                : "text-on-surface-variant"
            )}
          >
            <item.icon size={20} className={cn(location.pathname === item.path && "fill-primary/10")} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
