"use server";

import nodemailer from "nodemailer";
import { adminDb } from "@/_lib/firebase/firestore-admin";
import { getVehicleBids } from "@/_actions/bid-actions";
import { tenderCloseEmailTemplate } from "@/_lib/utils/email-templates/tender-close-email-template";
import {
  TenderCloseBidEntry,
  TenderCloseEmailTemplateProps,
} from "@/_types/email-types";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function processExpiredTenders(): Promise<{
  success: boolean;
  processed: number;
  error?: string;
}> {
  try {
    const now = new Date();
    let processedCount = 0;

    const vehiclesSnapshot = await adminDb
      .collection("vehicles")
      .where("listingType", "==", "tender")
      .where("status", "==", "active")
      .get();

    const expiredVehicles = vehiclesSnapshot.docs.filter((doc) => {
      const data = doc.data();
      const hasExpired =
        data.tenderDeadline && new Date(data.tenderDeadline) < now;
      const notEmailedYet = data.tenderEmailSent !== true;
      return hasExpired && notEmailedYet;
    });

    for (const vehicleDoc of expiredVehicles) {
      const vehicleId = vehicleDoc.id;
      const vehicleData = vehicleDoc.data();

      try {
        await adminDb
          .collection("vehicles")
          .doc(vehicleId)
          .update({ tenderEmailSent: true });

        const bidsResult = await getVehicleBids(vehicleId);

        if (!bidsResult.success) {
          console.error(`Failed to fetch bids for vehicle ${vehicleId}`);
          await adminDb
            .collection("vehicles")
            .doc(vehicleId)
            .update({ tenderEmailSent: false });
          continue;
        }

        const allBids = bidsResult.data || [];
        const reservePrice = vehicleData.reservePrice || 0;
        const sortedBids = allBids.sort((a, b) => b.bidPrice - a.bidPrice);

        const qualifyingBids = sortedBids.filter(
          (bid) => bid.bidPrice >= reservePrice,
        );
        const topQualifyingBids = qualifyingBids.slice(0, 5);

        for (let i = 0; i < sortedBids.length; i++) {
          const bid = sortedBids[i];
          const bidDocId = `${bid.vehicleUid}_${bid.dealerUid}`;

          const meetsReserve = bid.bidPrice >= reservePrice;
          const isHighestBid = i === 0;
          const tenderResult = isHighestBid && meetsReserve ? "won" : "lost";

          try {
            await adminDb
              .collection("bids")
              .doc(bidDocId)
              .update({ tenderResult });
          } catch (error) {
            console.error(
              `Failed to update tenderResult for bid ${bidDocId}:`,
              error,
            );
          }
        }

        const formattedBids: TenderCloseBidEntry[] = topQualifyingBids.map(
          (bid, index) => ({
            rank: index + 1,
            dealerName: `${bid.dealer.firstName} ${bid.dealer.surname}`,
            dealerEmail: bid.dealer.email,
            dealerPhone: bid.dealer.phone,
            bidPrice: `$${bid.bidPrice.toLocaleString("en-AU")}`,
          }),
        );

        const formattedListPrice = `$${vehicleData.price.toLocaleString("en-AU")}`;
        const formattedDeadline = new Date(
          vehicleData.tenderDeadline,
        ).toLocaleString("en-AU", {
          timeZone: "Australia/Brisbane",
        });

        let featuredImageUrl = "";
        if (
          topQualifyingBids.length > 0 &&
          topQualifyingBids[0].vehicle.featuredImageUrl
        ) {
          featuredImageUrl = topQualifyingBids[0].vehicle.featuredImageUrl;
        } else if (vehicleData.media?.primaryImage) {
          featuredImageUrl = vehicleData.media.primaryImage;
        }

        const formattedReservePrice = vehicleData.reservePrice
          ? `$${vehicleData.reservePrice.toLocaleString("en-AU")}`
          : undefined;

        const emailTemplateData: TenderCloseEmailTemplateProps = {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          registrationNumber: vehicleData.registrationNumber || "",
          featuredImageUrl,
          listPrice: formattedListPrice,
          reservePrice: formattedReservePrice,
          tenderDeadline: formattedDeadline,
          bids: formattedBids,
        };

        const emailHtml = tenderCloseEmailTemplate(emailTemplateData);

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

        const mailOptions: MailOptions = {
          from: `Auto Marketplace QLD <${process.env.SMTP_USER}>`,
          to: process.env.SMTP_SEND_TO as string,
          subject: `Tender Closed - ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        processedCount++;
      } catch (error) {
        console.error(`Error processing vehicle ${vehicleId}:`, error);
        await adminDb
          .collection("vehicles")
          .doc(vehicleId)
          .update({ tenderEmailSent: false });
      }
    }

    return { success: true, processed: processedCount };
  } catch (error) {
    console.error("Process expired tenders error:", error);
    return {
      success: false,
      processed: 0,
      error: "Failed to process expired tenders.",
    };
  }
}
