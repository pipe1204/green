import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { TrackViewRequest } from "@/types";

interface UseVehicleViewTrackingOptions {
  vehicleId: string;
  enabled?: boolean;
}

export function useVehicleViewTracking({
  vehicleId,
  enabled = true,
}: UseVehicleViewTrackingOptions) {
  const { session } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string>(generateSessionId());
  const hasTrackedRef = useRef<boolean>(false);

  // Generate a unique session ID for anonymous users
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track the view
  const trackView = useCallback(
    async (viewDuration?: number) => {
      if (!enabled || !vehicleId || hasTrackedRef.current) {
        return;
      }

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const trackData: TrackViewRequest = {
          vehicle_id: vehicleId,
          session_id: session?.access_token ? undefined : sessionIdRef.current,
          user_agent: navigator.userAgent,
          referrer: document.referrer || undefined,
          view_duration: viewDuration,
        };

        const response = await fetch("/api/analytics/track-view", {
          method: "POST",
          headers,
          body: JSON.stringify(trackData),
        });

        if (response.ok) {
          hasTrackedRef.current = true;
        } else {
          console.error("Failed to track vehicle view:", response.statusText);
        }
      } catch (error) {
        console.error("Error tracking vehicle view:", error);
      }
    },
    [enabled, vehicleId, session?.access_token]
  );

  // Track view on component mount
  useEffect(() => {
    if (enabled && vehicleId) {
      startTimeRef.current = Date.now();
      trackView();
    }
  }, [vehicleId, enabled, trackView]);

  // Track view duration on component unmount or page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTrackedRef.current) {
        const viewDuration = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        trackView(viewDuration);
      }
    };

    const handleBeforeUnload = () => {
      if (!hasTrackedRef.current) {
        const viewDuration = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        // Use sendBeacon for more reliable tracking on page unload
        if (navigator.sendBeacon) {
          const trackData: TrackViewRequest = {
            vehicle_id: vehicleId,
            session_id: session?.access_token
              ? undefined
              : sessionIdRef.current,
            user_agent: navigator.userAgent,
            referrer: document.referrer || undefined,
            view_duration: viewDuration,
          };

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }

          navigator.sendBeacon(
            "/api/analytics/track-view",
            JSON.stringify(trackData)
          );
        } else {
          trackView(viewDuration);
        }
      }
    };

    if (enabled && vehicleId) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("beforeunload", handleBeforeUnload);

        // Final track on cleanup
        if (!hasTrackedRef.current) {
          const viewDuration = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          trackView(viewDuration);
        }
      };
    }
  }, [vehicleId, enabled, session?.access_token, trackView]);

  return {
    trackView,
    sessionId: sessionIdRef.current,
  };
}
