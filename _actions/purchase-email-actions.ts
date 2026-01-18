"use server";

import nodemailer from "nodemailer";
import { adminDb } from "@/_lib/firebase/firestore-admin";
import {
  purchaseOwnerNotificationTemplate,
  purchaseUserConfirmationTemplate,
  offerOwnerNotificationTemplate,
  offerUserConfirmationTemplate,
} from "@/_lib/utils/email-templates/purchase-email-templates";
import {
  PurchaseEmailTemplateProps,
  OfferEmailTemplateProps,
} from "@/_types/email-types";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo?: string;
  html: string;
}

interface PurchaseEmailData {
  userEmail: string;
  userUid: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
}

interface DealerData {
  firstName: string;
  surname: string;
  phone: string;
}

async function getDealerData(uid: string): Promise<DealerData | null> {
  try {
    const querySnapshot = await adminDb
      .collection("dealers")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return {
        firstName: data?.firstName || "",
        surname: data?.surname || "",
        phone: data?.phone || "",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching dealer data:", error);
    return null;
  }
}

export async function sendPurchaseEmails(
  purchaseData: PurchaseEmailData
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      requireTLS: true,
    });

    const formattedPrice = `$${purchaseData.price.toLocaleString("en-AU")}`;

    const dealerData = await getDealerData(purchaseData.userUid);

    const emailTemplateData: PurchaseEmailTemplateProps = {
      userEmail: purchaseData.userEmail,
      registrationNumber: purchaseData.registrationNumber,
      make: purchaseData.make,
      model: purchaseData.model,
      year: purchaseData.year,
      price: formattedPrice,
      featuredImageUrl: purchaseData.featuredImageUrl,
      bodyType: purchaseData.bodyType,
      transmission: purchaseData.transmission,
      engineCapacity: purchaseData.engineCapacity,
      fuelType: purchaseData.fuelType,
      driveType: purchaseData.driveType,
      colour: purchaseData.colour,
      vin: purchaseData.vin,
      dealerFirstName: dealerData?.firstName,
      dealerFullName: dealerData
        ? `${dealerData.firstName} ${dealerData.surname}`
        : undefined,
      dealerPhone: dealerData?.phone,
    };

    const ownerEmailHtml =
      purchaseOwnerNotificationTemplate(emailTemplateData);
    const userEmailHtml = purchaseUserConfirmationTemplate(emailTemplateData);

    const ownerMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_SEND_TO as string,
      subject: "Vehicle Purchase Notification - AMQ",
      replyTo: purchaseData.userEmail,
      html: ownerEmailHtml,
    };

    const userMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: purchaseData.userEmail,
      subject: "Purchase Confirmation - Auto Marketplace QLD",
      html: userEmailHtml,
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Purchase email error:", error);
    return {
      success: false,
      error: "Failed to send purchase emails. Please try again.",
    };
  }
}

interface OfferEmailData {
  userEmail: string;
  userUid: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  listPrice: number;
  offerPrice: number;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
}

export async function sendOfferEmails(
  offerData: OfferEmailData
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      requireTLS: true,
    });

    const formattedListPrice = `$${offerData.listPrice.toLocaleString("en-AU")}`;
    const formattedOfferPrice = `$${offerData.offerPrice.toLocaleString("en-AU")}`;

    const dealerData = await getDealerData(offerData.userUid);

    const emailTemplateData: OfferEmailTemplateProps = {
      userEmail: offerData.userEmail,
      registrationNumber: offerData.registrationNumber,
      make: offerData.make,
      model: offerData.model,
      year: offerData.year,
      listPrice: formattedListPrice,
      offerPrice: formattedOfferPrice,
      featuredImageUrl: offerData.featuredImageUrl,
      bodyType: offerData.bodyType,
      transmission: offerData.transmission,
      engineCapacity: offerData.engineCapacity,
      fuelType: offerData.fuelType,
      driveType: offerData.driveType,
      colour: offerData.colour,
      vin: offerData.vin,
      dealerFirstName: dealerData?.firstName,
      dealerFullName: dealerData
        ? `${dealerData.firstName} ${dealerData.surname}`
        : undefined,
      dealerPhone: dealerData?.phone,
    };

    const ownerEmailHtml = offerOwnerNotificationTemplate(emailTemplateData);
    const userEmailHtml = offerUserConfirmationTemplate(emailTemplateData);

    const ownerMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_SEND_TO as string,
      subject: "Vehicle Offer Received - AMQ",
      replyTo: offerData.userEmail,
      html: ownerEmailHtml,
    };

    const userMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: offerData.userEmail,
      subject: "Offer Confirmation - Auto Marketplace QLD",
      html: userEmailHtml,
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Offer email error:", error);
    return {
      success: false,
      error: "Failed to send offer emails. Please try again.",
    };
  }
}
