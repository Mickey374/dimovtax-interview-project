"use client";

import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const PROJECT_NOTIFICATION_REFRESH_EVENT = "project-notification-refresh";
const NOTIFICATION_POLL_INTERVAL_MS = 30_000;

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  project: { id: string; title: string } | null;
};

type NotificationResponse = {
  notifications: Notification[];
  unreadCount: number;
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NotificationResponse>({ notifications: [], unreadCount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const notificationRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const loadNotifications = useCallback(async () => {
    if (notificationRequestRef.current) {
      return notificationRequestRef.current;
    }

    const request = (async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/notifications", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load notifications");
        }
        setData((await response.json()) as NotificationResponse);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setIsLoading(false);
      }
    })();

    notificationRequestRef.current = request;
    await request;
    notificationRequestRef.current = null;
  }, []);

  useEffect(() => {
    const refreshWhenActive = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    };

    void loadNotifications();
    const intervalId = window.setInterval(refreshWhenActive, NOTIFICATION_POLL_INTERVAL_MS);
    window.addEventListener("focus", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const handleProjectMutation = () => {
      void loadNotifications();
    };

    window.addEventListener(PROJECT_NOTIFICATION_REFRESH_EVENT, handleProjectMutation);

    return () => {
      window.removeEventListener(PROJECT_NOTIFICATION_REFRESH_EVENT, handleProjectMutation);
    };
  }, [loadNotifications]);

  const markRead = async (id: string) => {
    const response = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    if (!response.ok) {
      throw new Error("Unable to mark notification as read");
    }
    await loadNotifications();
  };

  const markAllRead = async () => {
    const response = await fetch("/api/notifications/read-all", { method: "PATCH" });
    if (!response.ok) {
      throw new Error("Unable to mark notifications as read");
    }
    await loadNotifications();
  };

  return (
    <div ref={notificationPanelRef} className="relative">
      <Button
        variant="outline"
        size="icon"
        className="border-border bg-background relative h-11 w-11 rounded-full"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open);
          if (!isOpen) void loadNotifications();
        }}
      >
        <Bell className="h-5 w-5" />
        {data.unreadCount > 0 && (
          <span className="bg-primary-500 absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
            {data.unreadCount > 99 ? "99+" : data.unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="background-light900_dark200 absolute top-14 right-0 z-50 w-80 rounded-lg border p-2 shadow-lg">
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="font-semibold">Notifications</h2>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading || data.unreadCount === 0}
              onClick={() => void markAllRead().catch((error) => console.error(error))}
            >
              Mark all read
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {data.notifications.length === 0 ? (
              <p className="text-muted-foreground px-2 py-6 text-center text-sm">You have no notifications.</p>
            ) : (
              data.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-md p-2 text-sm ${notification.isRead ? "" : "bg-primary-500/10"}`}
                >
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {notification.project && (
                      <Link
                        href={`/projects/${notification.project.id}`}
                        prefetch={false}
                        className="text-primary-500 text-xs hover:underline"
                        onClick={() => {
                          if (!notification.isRead) void markRead(notification.id);
                        }}
                      >
                        View project
                      </Link>
                    )}
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-auto"
                        aria-label={`Mark ${notification.title} as read`}
                        onClick={() => void markRead(notification.id).catch((error) => console.error(error))}
                      >
                        <Check />
                        Read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
