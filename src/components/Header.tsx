import { Home, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../features/admin/hooks/useAdminAuth';

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAdminAuth();

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/leaderboard', label: 'Classement', icon: Trophy },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fun Facts 🎭
            </h1>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Beta</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavClick(path)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}

              <Button
                variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavClick('/admin')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { logout(); handleNavClick('/'); }}
                >
                  Déconnexion
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-lg font-semibold mb-4">Navigation</div>
                  
                  {navItems.map(({ path, label, icon: Icon }) => (
                    <Button
                      key={path}
                      variant={location.pathname === path ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => handleNavClick(path)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  ))}

                  <Button
                    variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleNavClick('/admin')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => { logout(); handleNavClick('/'); }}
                    >
                      Déconnexion
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}