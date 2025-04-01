
import React from "react";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "./UserAvatar";
import { Activity } from "../contexts/RoomContext";

type ActivityCardProps = {
  activity: Activity;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm animate-fade-in card-hover">
      <div className="flex items-start gap-3">
        <UserAvatar name={activity.userName} color={activity.userColor} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold">{activity.userName}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(activity.timestamp.toDate(), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-card-foreground">{activity.text}</p>
          {activity.category && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {activity.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
