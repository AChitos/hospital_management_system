import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth/authStore";
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon 
} from "@heroicons/react/24/outline";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 text-gray-600 rounded-md lg:hidden hover:bg-gray-100"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">
              Polyclinic Deauville
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5" />
              <span className="hidden sm:inline-block">
                {user?.firstName} {user?.lastName}
              </span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => logout()}
            className="flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:inline-block">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
