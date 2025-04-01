import React from "react";
import Layout from "../components/Layout";
import UserOnboarding from "../components/UserOnboarding";
import RoomDashboard from "../components/RoomDashboard";
import RoomView from "../components/RoomView";
import { useUser } from "../contexts/UserContext";
import { useRoom } from "../contexts/RoomContext";

const Index = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const { currentRoom, loadingRoom: isLoadingRoom } = useRoom(); 

  if (isLoadingUser || isLoadingRoom) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Loading</p>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Made by TheRealSaiTama</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {!user ? (
        <UserOnboarding />
      ) : currentRoom ? (
        <RoomView />
      ) : (
        <RoomDashboard />
      )}
    </Layout>
  );
};

export default Index;
