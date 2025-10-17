import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import "../App.css"
import "../index.css"

import { 
  Home, 
  User, 
  Search, 
  BookOpen, 
  Briefcase, 
  Building, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  MessageCircle
} from "lucide-react";

interface NavigationWireframeProps {
  userType: 'jobSeeker' | 'employer' | 'admin';
  currentView: string;
  onViewChange: (view: string) => void;
}

export function NavigationWireframe({ userType, currentView, onViewChange }: NavigationWireframeProps) {
  const getNavigationItems = () => {
    switch (userType) {
      case 'jobSeeker':
        return [
          { id: 'matches', label: 'Job Matches', icon: Search },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'training', label: 'Training', icon: BookOpen },
          { id: 'freelance', label: 'Freelance', icon: Briefcase },
        ];
      case 'employer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'posting', label: 'Post Job', icon: Building },
          { id: 'applications', label: 'Applications', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'programs', label: 'Programs', icon: BookOpen },
          { id: 'reports', label: 'Reports', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="border-b-2 border-dashed border-gray-300 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <Badge variant="outline" className="capitalize">{userType}</Badge>
        </div>

        {/* Main Navigation */}
        <nav className="flex space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.id === 'applications' && userType === 'employer' && (
                  <Badge variant="destructive" className="text-xs">12</Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}