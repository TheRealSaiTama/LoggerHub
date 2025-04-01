import React from "react";
import ActivityCard from "./ActivityCard";
import { Activity } from "../contexts/RoomContext";

type ActivityFeedProps = {
  activities: Activity[];
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-lg text-muted-foreground">No activities yet. Be the first to log something!</p>
      </div>
    );
  }

  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
  );

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityFeed;
