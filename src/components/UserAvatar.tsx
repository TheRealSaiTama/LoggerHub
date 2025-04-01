import React from "react";

type UserAvatarProps = {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
};

const UserAvatar: React.FC<UserAvatarProps> = ({ name, color, size = "md" }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium text-white shadow-md ${sizeClasses[size]} transition-transform hover:scale-105 ring-2 ring-white/30 ring-offset-2 ring-offset-background/5`}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
