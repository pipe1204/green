// Message and conversation types for the messaging system

export interface DatabaseConversation {
  id: string;
  subject: string;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  vendor_id: string;
  vehicle_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  vendors?: {
    business_name: string;
  };
  vehicles?: {
    name: string;
    brand: string;
    images: { url: string; alt: string }[];
  };
  messages: {
    id: string;
    content: string;
    created_at: string;
    sender_type: string;
    sender_id: string;
    is_read: boolean;
  }[];
}

export interface DatabaseMessage {
  id: string;
  content: string;
  created_at: string;
  sender_type: string;
  sender_id: string;
  is_read: boolean;
}

export interface DatabaseConversationDetails {
  id: string;
  subject: string;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  vendor_id: string;
  vehicle_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  vendors?: {
    business_name: string;
    user_id: string;
  }[];
  vehicles?: {
    name: string;
    brand: string;
    images: { url: string; alt: string }[];
    price: number;
  };
}

export interface DatabaseMessageDetails {
  id: string;
  content: string;
  sender_id: string;
  sender_type: string;
  message_type: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  message_attachments?: {
    id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
  }[];
}

export interface DatabaseConversationAccess {
  id: string;
  customer_id: string;
  vendor_id: string;
  status: string;
  vendors?: {
    user_id: string;
  };
}

export interface DatabaseAttachment {
  id: string;
  message_id: string;
}

export interface DatabaseMessageAccess {
  id: string;
  sender_id: string;
  conversation_id: string;
  conversations: {
    customer_id: string;
    vendors: {
      user_id: string;
    };
  };
}

export interface Conversation {
  id: string;
  subject: string;
  status: "open" | "closed" | "archived";
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    senderType: "customer" | "vendor";
  };
  vehicle: {
    id: string;
    name: string;
    brand: string;
    images: { url: string; alt: string }[];
    price?: number;
  };
  participant: {
    name: string;
    email?: string;
  };
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: "customer" | "vendor";
  messageType: "text" | "image" | "file" | "mixed";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  attachments: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface ConversationDetails extends Conversation {
  customer: {
    id: string;
    name: string;
    email: string;
  };
  vendor: {
    id: string;
    name: string;
  };
}

export interface CreateConversationRequest {
  vehicleId: string;
  vendorId: string;
  subject: string;
  initialMessage: string;
}

export interface SendMessageRequest {
  content: string;
  messageType?: "text" | "image" | "file" | "mixed";
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
}

export interface UpdateConversationRequest {
  status?: "open" | "closed" | "archived";
  subject?: string;
}

export interface UpdateMessageRequest {
  isRead?: boolean;
  content?: string;
}

export interface MessageUploadResult {
  success: boolean;
  file?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
  error?: string;
}

// API Response types
export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface ConversationResponse {
  conversation: ConversationDetails;
  messages: Message[];
}

export interface MessageResponse {
  message: Message;
}

export interface CreateConversationResponse {
  conversation: {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
  };
  message: {
    id: string;
    content: string;
    createdAt: string;
  };
}

// Real-time event types
export interface MessageEvent {
  type: "message_sent" | "message_read" | "typing_start" | "typing_stop";
  conversationId: string;
  messageId?: string;
  senderId: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface TypingUser {
  id: string;
  name: string;
  isTyping: boolean;
}
