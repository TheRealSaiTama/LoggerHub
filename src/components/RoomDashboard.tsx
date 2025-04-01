import React, { useState } from "react";
import { useRoom } from "../contexts/RoomContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus, LogIn, Activity, Loader2 } from "lucide-react";

const RoomDashboard: React.FC = () => {
  const { createRoom, joinRoom } = useRoom();
  const [roomName, setRoomName] = useState("");
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim().length < 3) {
      setError("Room name must be at least 3 characters");
      return;
    }
    setIsCreating(true);
    setError("");

    try {
      await createRoom(roomName.trim());
      
      toast({
        title: "Room Created!",
        description: "Your room has been created successfully.",
      });
      setRoomName("");
    } catch (e) {
      console.error("Failed to create room:", e);
      setError("Failed to create room. Please try again.");
      toast({
        title: "Error Creating Room",
        description: (e as Error)?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomIdToJoin.trim()) {
      setError("Please enter a room ID");
      return;
    }
    
    const trimmedRoomId = roomIdToJoin.trim();
    setIsJoining(true);
    setError("");

    console.log("Attempting to join room with ID:", trimmedRoomId);

    try {
      const room = await joinRoom(trimmedRoomId);
      if (room) {
        
        toast({
          title: "Room Joined!",
          description: `You've joined '${room.name}'.`,
        });
        setRoomIdToJoin("");
      } else {
        setError("Room not found. Please check the ID and try again.");
         toast({
          title: "Room Not Found",
          description: "Please check the ID and try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
       console.error("Failed to join room:", e);
       setError("Failed to join room. Please try again.");
       toast({
        title: "Error Joining Room",
        description: (e as Error)?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const copyRoomLink = (roomId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    navigator.clipboard.writeText(url.toString());
    toast({
      title: "Link Copied!",
      description: "Share this link with friends to invite them to your room.",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-8">
      <header className="text-center mb-8 animate-fade-in">
        <div className="inline-block p-2 mb-3 rounded-full gradient-bg">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Activity Hub</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create or join rooms to log activities with friends in real-time
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
        <Card className="glass-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create a Room
            </CardTitle>
            <CardDescription>Start a new activity logging room</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <Input
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setError("");
                }}
                className="bg-background/80"
                disabled={isCreating || isJoining}
              />
              <Button type="submit" className="w-full btn-glow" disabled={isCreating || isJoining}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Room
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-accent" />
              Join a Room
            </CardTitle>
            <CardDescription>Enter a room ID to join an existing room</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <Input
                placeholder="Enter room ID"
                value={roomIdToJoin}
                onChange={(e) => {
                  setRoomIdToJoin(e.target.value);
                  setError("");
                }}
                className="bg-background/80"
                disabled={isCreating || isJoining}
              />
              <Button 
                type="submit" 
                variant="outline" 
                className="w-full hover:bg-accent hover:text-accent-foreground btn-glow"
                disabled={isCreating || isJoining}
              >
                {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Join Room
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 shadow-sm animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="text-center mt-8 py-4 text-sm text-muted-foreground">
        <p>Made with ❤️ by <span className="font-medium gradient-text">TheRealSaiTama</span></p>
      </div>
    </div>
  );
};

export default RoomDashboard;