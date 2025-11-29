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
    <header className="sticky top-0 z-30 bg-white border-b" style={{ borderColor: '#f0f0f0' }}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-3 text-gray-600 rounded-md lg:hidden hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
