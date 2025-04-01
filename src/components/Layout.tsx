import React from "react";
import { useUser } from "../contexts/UserContext";
import { useRoom } from "../contexts/RoomContext";
import { Button } from "../components/ui/button";
import { LogOut, Moon } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useToast } from "@/hooks/use-toast";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, clearUser } = useUser();
  const { currentRoom, leaveRoom } = useRoom();
  const { toast } = useToast();

  const handleLogout = () => {
    if (currentRoom) {
      leaveRoom();
    }
    clearUser();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user && (
        <header className="border-b p-3 bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserAvatar name={user.name} color={user.color} size="sm" />
              <span className="font-medium">{user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1 btn-glow"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>
      )}
      
      <main className="flex-grow py-6">
        {children}
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>Logger Hub &copy; {new Date().getFullYear()}</div>
          <div className="flex items-center gap-2">
            <span>Made by</span>
            <span className="font-medium gradient-text">TheRealSaiTama</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
