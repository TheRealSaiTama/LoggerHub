import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Sparkles } from "lucide-react";

const UserOnboarding: React.FC = () => {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter a name with at least 2 characters");
      return;
    }
    
    setUser({
      id: Math.random().toString(36).substring(2, 10),
      name: name.trim(),
      color: "",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 animate-fade-in">
      <Card className="w-full glass-card">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
              <Sparkles className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center gradient-text">
            Welcome to Activity Hub
          </CardTitle>
          <CardDescription className="text-center">
            Enter your name to get started logging activities with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full bg-background/80"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full gradient-bg btn-glow">
              Continue
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <span className="block">Made with ❤️ by</span>
            <span className="font-semibold gradient-text">Keshav</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;
