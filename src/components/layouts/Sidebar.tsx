import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";
import { 
  HomeIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  CalendarIcon,
  DocumentTextIcon
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
      name: "Appointments",
      href: "/appointments",
      icon: CalendarIcon,
    },
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "Medical Records",
      href: "/medical-records",
      icon: DocumentTextIcon,
    },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 h-full w-72 bg-white border-r shadow-lg transition-transform duration-300 transform lg:translate-x-0 lg:relative pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-3 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-5 py-3.5 rounded-lg group transition-all duration-200 relative",
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "mr-4 h-6 w-6",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 mt-6 border-t">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} AnesthCare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
