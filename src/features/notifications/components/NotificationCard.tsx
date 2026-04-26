"use client";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { Notification } from "../types";

interface NotificationCardProps {
  notification: Notification;
  onMarkedRead?: () => void;
}

function NotificationCard({
  notification,
  onMarkedRead,
}: NotificationCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        !notification.read && "border-primary/30 bg-primary/5"
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground">
            {notification.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
          <time className="text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleDateString()}
          </time>
        </div>
        {!notification.read && (
          <Button variant="ghost" size="sm" onClick={() => onMarkedRead?.()}>
            Mark read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { NotificationCard };
