import { resend, EMAIL_CONFIG } from "./resend";
import { render } from "@react-email/components";
import {
  VendorNewEnquiryEmailData,
  CustomerVendorReplyEmailData,
  VendorTestBookingEmailData,
  CustomerTestStatusEmailData,
  VendorTestRescheduleEmailData,
  NewMessageNotificationEmailData,
  PriceAlertMatchEmailData,
  CustomerAccountCreatedEmailData,
  EmailResponse,
} from "@/types/email";

// Import email templates
import { VendorNewEnquiryEmail } from "@/emails/VendorNewEnquiryEmail";
import { CustomerVendorReplyEmail } from "@/emails/CustomerVendorReplyEmail";
import { VendorTestBookingEmail } from "@/emails/VendorTestBookingEmail";
import { CustomerTestStatusEmail } from "@/emails/CustomerTestStatusEmail";
import { VendorTestRescheduleEmail } from "@/emails/VendorTestRescheduleEmail";
import { NewMessageNotificationEmail } from "@/emails/NewMessageNotificationEmail";
import { PriceAlertMatchEmail } from "@/emails/PriceAlertMatchEmail";
import { CustomerAccountCreatedEmail } from "@/emails/CustomerAccountCreatedEmail";

/**
 * Send email notification to vendor when customer sends inquiry
 */
export async function sendVendorNewEnquiryEmail(
  data: VendorNewEnquiryEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(VendorNewEnquiryEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `Nueva consulta sobre ${data.vehicleBrand} ${data.vehicleName}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending vendor enquiry email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendVendorNewEnquiryEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification to guest customer when vendor replies
 */
export async function sendCustomerVendorReplyEmail(
  data: CustomerVendorReplyEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(CustomerVendorReplyEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `${data.vendorName} respondió a tu consulta`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending customer reply email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendCustomerVendorReplyEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification to vendor when customer books test drive
 */
export async function sendVendorTestBookingEmail(
  data: VendorTestBookingEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(VendorTestBookingEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `Nueva solicitud de prueba de manejo - ${data.vehicleBrand} ${data.vehicleName}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending vendor test booking email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendVendorTestBookingEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification to customer when vendor accepts/declines test drive
 */
export async function sendCustomerTestStatusEmail(
  data: CustomerTestStatusEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(CustomerTestStatusEmail(data));

    const statusText = data.status === "accepted" ? "confirmada" : "declinada";

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `Prueba de manejo ${statusText} - ${data.vehicleBrand} ${data.vehicleName}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending customer test status email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendCustomerTestStatusEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification to vendor when customer reschedules test drive
 */
export async function sendVendorTestRescheduleEmail(
  data: VendorTestRescheduleEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(VendorTestRescheduleEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `Prueba de manejo reprogramada - ${data.vehicleBrand} ${data.vehicleName}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error(
        "Error sending vendor test reschedule email:",
        result.error
      );
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendVendorTestRescheduleEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification when new message is received in conversation
 */
export async function sendNewMessageNotificationEmail(
  data: NewMessageNotificationEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(NewMessageNotificationEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `Nuevo mensaje de ${data.senderName}`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending message notification email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendNewMessageNotificationEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification when price matches customer's alert
 */
export async function sendPriceAlertMatchEmail(
  data: PriceAlertMatchEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(PriceAlertMatchEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `¡Alerta de precio! ${data.vehicleBrand} ${data.vehicleName} ahora a tu precio deseado`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error("Error sending price alert email:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendPriceAlertMatchEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email notification to vendor when guest customer registers account
 */
export async function sendCustomerAccountCreatedEmail(
  data: CustomerAccountCreatedEmailData
): Promise<EmailResponse> {
  try {
    const emailHtml = await render(CustomerAccountCreatedEmail(data));

    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.recipientEmail,
      subject: `¡Cliente registrado! ${data.customerName} ahora tiene cuenta en Green`,
      html: emailHtml,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (result.error) {
      console.error(
        "Error sending customer account created email:",
        result.error
      );
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("Error in sendCustomerAccountCreatedEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
