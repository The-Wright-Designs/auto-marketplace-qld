"use server";

import nodemailer from "nodemailer";
import { adminDb } from "@/_lib/firebase/firestore-admin";
import {
  bidOwnerNotificationTemplate,
  bidUserConfirmationTemplate,
} from "@/_lib/utils/email-templates/bid-email-templates";
import { BidEmailTemplateProps } from "@/_types/email-types";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo?: string;
  html: string;
}

interface BidEmailData {
  userEmail: string;
  userUid: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  bidPrice: number;
  listPrice: number;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
  tenderDeadline?: string;
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

export async function sendBidEmails(
  bidData: BidEmailData
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

    const formattedListPrice = `$${bidData.listPrice.toLocaleString("en-AU")}`;
    const formattedBidPrice = `$${bidData.bidPrice.toLocaleString("en-AU")}`;

    const dealerData = await getDealerData(bidData.userUid);

    const emailTemplateData: BidEmailTemplateProps = {
      userEmail: bidData.userEmail,
      registrationNumber: bidData.registrationNumber,
      make: bidData.make,
      model: bidData.model,
      year: bidData.year,
      listPrice: formattedListPrice,
      bidPrice: formattedBidPrice,
      featuredImageUrl: bidData.featuredImageUrl,
      bodyType: bidData.bodyType,
      transmission: bidData.transmission,
      engineCapacity: bidData.engineCapacity,
      fuelType: bidData.fuelType,
      driveType: bidData.driveType,
      colour: bidData.colour,
      vin: bidData.vin,
      tenderDeadline: bidData.tenderDeadline,
      dealerFirstName: dealerData?.firstName,
      dealerFullName: dealerData
        ? `${dealerData.firstName} ${dealerData.surname}`
        : undefined,
      dealerPhone: dealerData?.phone,
    };

    const ownerEmailHtml = bidOwnerNotificationTemplate(emailTemplateData);
    const userEmailHtml = bidUserConfirmationTemplate(emailTemplateData);

    const ownerMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_SEND_TO as string,
      subject: "Vehicle Bid Received - AMQ",
      replyTo: bidData.userEmail,
      html: ownerEmailHtml,
    };

    const userMailOptions: MailOptions = {
      from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
      to: bidData.userEmail,
      subject: "Bid Confirmation - Auto Marketplace QLD",
      html: userEmailHtml,
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Bid email error:", error);
    return {
      success: false,
      error: "Failed to send bid emails. Please try again.",
    };
  }
}
