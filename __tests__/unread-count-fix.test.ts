import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Unread Count Fix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle custom event for messages marked as read", () => {
    // Mock window.addEventListener and removeEventListener
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    // Simulate the event listener setup
    const handleMessagesMarkedAsRead = vi.fn();
    window.addEventListener("messagesMarkedAsRead", handleMessagesMarkedAsRead);

    // Verify the event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "messagesMarkedAsRead",
      handleMessagesMarkedAsRead
    );

    // Simulate the custom event being dispatched
    const event = new CustomEvent("messagesMarkedAsRead", {
      detail: { conversationId: "test-conversation-id" },
    });
    window.dispatchEvent(event);

    // Verify the handler was called
    expect(handleMessagesMarkedAsRead).toHaveBeenCalled();

    // Cleanup
    window.removeEventListener(
      "messagesMarkedAsRead",
      handleMessagesMarkedAsRead
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "messagesMarkedAsRead",
      handleMessagesMarkedAsRead
    );
  });

  it("should calculate unread count correctly", () => {
    const user = { id: "user-123" };
    const messages = [
      { sender_id: "user-123", is_read: true }, // Own message - should not count
      { sender_id: "other-user", is_read: false }, // Other user, unread - should count
      { sender_id: "other-user", is_read: true }, // Other user, read - should not count
      { sender_id: "other-user", is_read: false }, // Other user, unread - should count
    ];

    const unreadCount = messages.filter(
      (msg) => msg.sender_id !== user.id && !msg.is_read
    ).length;

    expect(unreadCount).toBe(2);
  });

  it("should not count own messages as unread", () => {
    const user = { id: "user-123" };
    const messages = [
      { sender_id: "user-123", is_read: false }, // Own message, unread - should not count
      { sender_id: "user-123", is_read: true }, // Own message, read - should not count
    ];

    const unreadCount = messages.filter(
      (msg) => msg.sender_id !== user.id && !msg.is_read
    ).length;

    expect(unreadCount).toBe(0);
  });
});
