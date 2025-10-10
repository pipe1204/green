// Email type definitions for Resend integration

/**
 * Base email data that all emails need
 */
export interface BaseEmailData {
  recipientEmail: string;
  recipientName: string;
}

/**
 * Email data for vendor new enquiry notification
 * Sent when a customer contacts a vendor through the contact form
 */
export interface VendorNewEnquiryEmailData extends BaseEmailData {
  customerName: string;
  vehicleName: string;
  vehicleBrand: string;
  message: string;
  dashboardUrl: string;
  isGuest: boolean;
}

/**
 * Email data for customer vendor reply notification
 * Sent when vendor replies to a guest customer (no account)
 */
export interface CustomerVendorReplyEmailData extends BaseEmailData {
  vendorName: string;
  vehicleName: string;
  vehicleBrand: string;
  vendorMessage: string;
  platformUrl: string;
  loginUrl: string;
}

/**
 * Email data for vendor test booking notification
 * Sent when a customer books a test drive
 */
export interface VendorTestBookingEmailData extends BaseEmailData {
  customerName: string;
  vehicleName: string;
  vehicleBrand: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  dashboardUrl: string;
}

/**
 * Email data for customer test status update
 * Sent when vendor accepts or declines a test drive
 */
export interface CustomerTestStatusEmailData extends BaseEmailData {
  vendorName: string;
  vehicleName: string;
  vehicleBrand: string;
  status: "accepted" | "declined";
  vendorMessage?: string;
  preferredDate: string;
  preferredTime: string;
  dashboardUrl: string;
}

/**
 * Email data for vendor test reschedule notification
 * Sent when customer reschedules a test drive
 */
export interface VendorTestRescheduleEmailData extends BaseEmailData {
  customerName: string;
  vehicleName: string;
  vehicleBrand: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  reason: string;
  dashboardUrl: string;
}

/**
 * Email data for new message notification
 * Sent when a new message is received in a conversation
 */
export interface NewMessageNotificationEmailData extends BaseEmailData {
  senderName: string;
  messagePreview: string;
  conversationId: string;
  dashboardUrl: string;
  recipientType: "customer" | "vendor";
}

/**
 * Email data for price alert match notification
 * Sent when a vehicle price matches a customer's alert
 */
export interface PriceAlertMatchEmailData extends BaseEmailData {
  vehicleName: string;
  vehicleBrand: string;
  vehicleType: string;
  oldPrice: number;
  newPrice: number;
  targetPrice: number;
  savings: number;
  vehicleUrl: string;
  vehicleImageUrl?: string;
}

/**
 * Email data for customer account creation notification
 * Sent to vendor when a guest customer who previously sent inquiries registers an account
 */
export interface CustomerAccountCreatedEmailData extends BaseEmailData {
  customerName: string;
  inquiryCount: number;
  dashboardUrl: string;
}

/**
 * Generic email response
 */
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
