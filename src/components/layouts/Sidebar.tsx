import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";
import { 
  HomeIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  RectangleStackIcon,
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Patients",
      href: "/patients",
      icon: UserGroupIcon,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: ChatBubbleLeftIcon,
    },
    {
      name: "Programs",
      href: "/programs",
      icon: RectangleStackIcon,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircleIcon,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: BellIcon,
      badge: 60,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 h-full w-[200px] transition-transform duration-300 transform lg:translate-x-0 lg:relative",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ backgroundColor: '#001529' }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-700/30">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">i</span>
              </div>
              <span className="text-white font-semibold text-lg">MedSuite</span>
              <span className="text-blue-400 text-xs">.</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg group transition-all duration-200 relative",
                  isActive
                    ? "bg-blue-500/10 text-white"
                    : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )}
                />
                <span className="text-sm font-medium flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
