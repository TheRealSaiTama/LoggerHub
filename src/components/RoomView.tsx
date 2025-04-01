import React, { useState } from "react";
import { useRoom } from "../contexts/RoomContext";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ActivityFeed from "./ActivityFeed";
import UserAvatar from "./UserAvatar";
import { Share2, ArrowLeft, Send, MessageSquare, Copy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "./ui/card";

const RoomView: React.FC = () => {
  const { currentRoom, leaveRoom, logActivity } = useRoom();
  const { user } = useUser();
  const { toast } = useToast();
  const [activityText, setActivityText] = useState("");

  if (!currentRoom || !user) return null;

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (activityText.trim()) {
      logActivity(activityText.trim());
      setActivityText("");
      toast({
        title: "Activity Logged",
        description: "Your activity has been added to the feed.",
      });
    }
  };

  const copyRoomLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    toast({
      title: "Link Copied!",
      description: "Share this link with friends to invite them to your room.",
    });
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  const uniqueParticipants = new Set();
  currentRoom.activities.forEach(activity => uniqueParticipants.add(activity.userId));

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <header className="flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeaveRoom}
            className="rounded-full h-9 w-9 bg-background/80 shadow-sm"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentRoom.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={14} />
              <span>{uniqueParticipants.size} participant{uniqueParticipants.size !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyRoomLink}
          className="flex items-center gap-1 btn-glow shadow-sm"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share Room</span>
        </Button>
      </header>
      
      <Card className="glass-card shadow-lg border-primary/10 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar name={user.name} color={user.color} />
            <div>
              <h2 className="font-medium">{user.name}</h2>
              <p className="text-xs text-muted-foreground">Logging as you</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmitActivity} className="space-y-3">
            <Textarea
              placeholder="What are you working on?"
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
              className="min-h-[100px] bg-background/80"
            />
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-1 btn-glow">
                <span>Log Activity</span>
                <Send size={16} />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          <h2 className="text-xl font-semibold">Activity Feed</h2>
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          Recent activities from all participants
        </p>
      </div>
      
      <ActivityFeed activities={currentRoom.activities} />
      
      <div className="text-center mt-8 py-4 text-sm text-muted-foreground">
        <p>Made with ❤️ by <span className="font-medium gradient-text">TheRealSaiTama</span></p>
      </div>
    </div>
  );
};

export default RoomView;
