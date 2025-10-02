"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

export function useTypingIndicator(conversationId: string | null) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        const { userId, userName, isTyping } = payload;

        if (userId === user.id) return; // Don't show own typing

        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.id !== userId);
          if (isTyping) {
            return [...filtered, { id: userId, name: userName, isTyping }];
          }
          return filtered;
        });
      })
      .subscribe();

    // Clean up typing status when component unmounts
    return () => {
      if (user) {
        channel.send({
          type: "broadcast",
          event: "typing",
          payload: {
            userId: user.id,
            userName: user.user_metadata?.full_name || "User",
            isTyping: false,
          },
        });
      }
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const startTyping = () => {
    if (!conversationId || !user) return;

    supabase.channel(`typing:${conversationId}`).send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId: user.id,
        userName: user.user_metadata?.full_name || "User",
        isTyping: true,
      },
    });
  };

  const stopTyping = () => {
    if (!conversationId || !user) return;

    supabase.channel(`typing:${conversationId}`).send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId: user.id,
        userName: user.user_metadata?.full_name || "User",
        isTyping: false,
      },
    });
  };

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
}
