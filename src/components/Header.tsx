
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { List, X, User, Mail, Lock, ChevronDown, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    // Check authentication status
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const name = localStorage.getItem('userName') || 'User';
      const method = localStorage.getItem('loginMethod') || '';
      setIsLoggedIn(loggedIn);
      setUserName(name);
      setLoginMethod(method);
    };

    window.addEventListener("scroll", handleScroll);
    checkAuth();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationLinks = [{
    name: "Home",
    path: "/"
  }, {
    name: "Properties",
    path: "/properties"
  }, {
    name: "About",
    path: "/about"
  }, {
    name: "Contact",
    path: "/contact"
  }];

  const handleListPropertyClick = () => {
    if (isLoggedIn) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'staff') {
        navigate('/staff');
      } else {
        navigate('/owner-dashboard');
      }
    } else {
      setShowAuthModal(true);
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsLoggedIn(true);
    setUserName(localStorage.getItem('userName') || 'User');
    setLoginMethod(localStorage.getItem('loginMethod') || '');
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'staff') {
      navigate('/staff');
    } else {
      navigate('/owner-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginMethod');
    setIsLoggedIn(false);
    setUserName('');
    setLoginMethod('');
    navigate('/');
  };

  const handleProfileClick = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'staff') {
      navigate('/staff');
    } else {
      navigate('/owner-dashboard');
    }
  };

  const getLoginMethodIcon = () => {
    switch (loginMethod) {
      case 'google':
        return;
      case 'email':
        return <Mail className="h-3 w-3 text-green-500" />;
      case 'credentials':
        return <Lock className="h-3 w-3 text-orange-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const getLoginMethodText = () => {
    switch (loginMethod) {
      case 'google':
        return 'Google';
      case 'email':
        return 'Email';
      case 'credentials':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <>
      <header className={`${isScrolled ? "bg-white shadow-sm" : "bg-transparent"} sticky top-0 z-50 transition-all duration-300`}>
        <div className="container-custom mx-auto px-4 bg-slate-200">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-moroccan-blue flex items-center justify-center rounded-md shadow-md">
                  <span className="text-white font-serif text-xl font-bold">M</span>
                </div>
                <div className="ml-2 font-serif flex items-center">
                  <span className="text-moroccan-blue text-xl font-medium">Martil</span>
                  <span className="text-moroccan-gold text-xl font-medium">Haven</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationLinks.map(link => (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors hover:text-moroccan-blue ${
                      isActive ? "text-moroccan-blue" : "text-gray-700"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={handleListPropertyClick} 
                    className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                  >
                    Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getLoginMethodIcon()}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-moroccan-blue text-white text-sm">
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <ChevronDown className="h-3 w-3 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                        <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{userName}</div>
                            <div className="text-xs text-gray-500">{getLoginMethodText()}</div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleProfileClick}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleLogout} 
                          className="text-red-600 cursor-pointer hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleListPropertyClick} 
                  className="bg-moroccan-gold hover:bg-moroccan-gold/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Become a host
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden flex items-center p-2" 
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <List className="h-6 w-6 text-gray-700" />
              )}
              <span className="sr-only">
                {isMobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t">
              <ul className="flex flex-col space-y-4">
                {navigationLinks.map(link => (
                  <li key={link.path}>
                    <NavLink 
                      to={link.path} 
                      className={({ isActive }) => 
                        `block text-base transition-colors hover:text-moroccan-blue ${
                          isActive ? "text-moroccan-blue" : "text-gray-700"
                        }`
                      } 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                <li>
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <Button 
                        onClick={handleListPropertyClick} 
                        className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-white"
                      >
                        Dashboard
                      </Button>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-moroccan-blue text-white text-sm">
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{userName}</div>
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              {getLoginMethodIcon()}
                              <span>{getLoginMethodText()}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handleLogout}
                          variant="outline" 
                          size="sm" 
                          className="flex items-center space-x-1 lg:space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 lg:px-3"
                        >
                          <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="hidden sm:inline text-xs lg:text-sm">Logout</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleListPropertyClick} 
                      className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 text-white"
                    >
                      Become a host
                    </Button>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </>
  );
};

export default Header;
