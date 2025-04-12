
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  Users, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon, label, active = false }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 pl-3 font-normal",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface MainSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const MainSidebar = ({ collapsed, setCollapsed }: MainSidebarProps) => {
  const currentPath = window.location.pathname;
  
  return (
    <div className={cn(
      "h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-xl font-bold">SocialFlow</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {!collapsed ? (
            <>
              <SidebarLink 
                to="/dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={currentPath === '/dashboard'} 
              />
              <SidebarLink 
                to="/content" 
                icon={<FileText size={20} />} 
                label="Content" 
                active={currentPath === '/content'} 
              />
              <SidebarLink 
                to="/schedule" 
                icon={<Calendar size={20} />} 
                label="Schedule" 
                active={currentPath === '/schedule'} 
              />
              <SidebarLink 
                to="/engagement" 
                icon={<MessageSquare size={20} />} 
                label="Engagement" 
                active={currentPath === '/engagement'} 
              />
              <SidebarLink 
                to="/analytics" 
                icon={<BarChart3 size={20} />} 
                label="Analytics" 
                active={currentPath === '/analytics'} 
              />
              <SidebarLink 
                to="/team" 
                icon={<Users size={20} />} 
                label="Team" 
                active={currentPath === '/team'} 
              />
              <SidebarLink 
                to="/settings" 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={currentPath === '/settings'} 
              />
            </>
          ) : (
            // Collapsed version
            <>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/dashboard' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/content' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/content">
                    <FileText size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/schedule' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/schedule">
                    <Calendar size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/engagement' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/engagement">
                    <MessageSquare size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/analytics' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/analytics">
                    <BarChart3 size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/team' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/team">
                    <Users size={20} />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    currentPath === '/settings' && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild
                >
                  <Link to="/settings">
                    <Settings size={20} />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <Button className="w-full gap-2 bg-brand-blue hover:bg-brand-blue-dark">
            <PlusCircle size={18} />
            <span>Create Post</span>
          </Button>
        ) : (
          <Button size="icon" className="w-full flex justify-center bg-brand-blue hover:bg-brand-blue-dark">
            <PlusCircle size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainSidebar;
