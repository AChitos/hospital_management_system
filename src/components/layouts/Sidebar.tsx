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
        "fixed left-0 top-0 z-20 h-full w-64 bg-white border-r shadow-sm transition-transform duration-300 transform lg:translate-x-0 lg:relative pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
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
