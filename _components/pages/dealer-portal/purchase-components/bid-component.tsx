"use client";

import ButtonType from "@/_components/ui/buttons/button-type";
import FormInputNumber from "@/_components/ui/form/form-input-number";
import { useState, useEffect } from "react";
import FormInputCheckbox from "@/_components/ui/form/form-input-checkbox";
import Link from "next/link";
import { useAuth } from "@/_lib/auth/auth-context";
import { sendBidEmails } from "@/_actions/bid-email-actions";
import { placeBid, getDealerBidForVehicle } from "@/_actions/bid-actions";
import TenderCountdown from "@/_components/ui/tender-countdown";
import classNames from "classnames";
import { Bid } from "@/_types/bid-types";

interface BidComponentProps {
  status: string;
  vehiclePrice: number | undefined;
  vehicleId: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
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

const BidComponent = ({
  status,
  vehiclePrice,
  registrationNumber,
  make,
  model,
  year,
  featuredImageUrl,
  bodyType,
  transmission,
  engineCapacity,
  fuelType,
  driveType,
  colour,
  vin,
  tenderDeadline,
  vehicleId,
}: BidComponentProps) => {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState<string>("");
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);
  const [isLoadingBid, setIsLoadingBid] = useState(true);

  useEffect(() => {
    const fetchExistingBid = async () => {
      if (!user?.uid) return;

      setIsLoadingBid(true);
      const result = await getDealerBidForVehicle(vehicleId, user.uid);
      if (result.success && result.data) {
        setCurrentBid(result.data);
        setBidPrice(result.data.bidPrice.toString());
      }
      setIsLoadingBid(false);
    };

    fetchExistingBid();
  }, [vehicleId, user?.uid]);

  const isTenderClosed = tenderDeadline
    ? new Date(tenderDeadline) <= new Date()
    : false;

  const handlePlaceBid = () => {
    setShowConfirm(true);
    setError(null);
  };

  const handleConfirmBid = async () => {
    if (!user?.email || !user?.uid || !vehiclePrice) {
      setError("Missing required information");
      return;
    }

    const bidAmount = parseFloat(bidPrice.replace(/,/g, ""));
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const placeBidResult = await placeBid({
        vehicleUid: vehicleId,
        dealerUid: user.uid,
        bidPrice: bidAmount,
        vehicle: {
          make,
          model,
          year,
          registrationNumber,
          featuredImageUrl,
          tenderDeadline: tenderDeadline || "",
        },
      });

      if (!placeBidResult.success) {
        setError(placeBidResult.error);
        return;
      }

      const emailResult = await sendBidEmails({
        userEmail: user.email,
        userUid: user.uid,
        registrationNumber,
        make,
        model,
        year,
        bidPrice: bidAmount,
        listPrice: vehiclePrice,
        featuredImageUrl,
        bodyType,
        transmission,
        engineCapacity,
        fuelType,
        driveType,
        colour,
        vin,
        tenderDeadline,
      });

      if (emailResult.success) {
        setBidSuccess(true);
        setShowConfirm(false);
        setAgreedToTerms(false);
        setCurrentBid(placeBidResult.data || null);
      } else {
        setError(emailResult.error || "Failed to submit bid");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Bid error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/70 w-full rounded-md p-7">
      <p className="text-white mb-2 text-[24px] font-semibold">Make A Bid</p>
      <div
        className={classNames(
          "grid gap-5 items-center px-5 border-2 rounded-md border-white min-[500px]:grid-cols-2 min-[500px]:gap-x-7 min-[500px]:justify-center",
          {
            "pt-5 pb-2": !isTenderClosed,
            "py-5": isTenderClosed,
          },
        )}
      >
        {bidSuccess ? (
          <div className="col-span-2 text-center py-5">
            <p className="text-white text-[20px] font-semibold mb-2">
              Bid Submitted!
            </p>
            <p className="text-white text-[16px]">
              Confirmation emails have been sent. Our team will review your bid
              and be in touch soon.
            </p>
          </div>
        ) : (
          <>
            {!isTenderClosed && (
              <>
                {currentBid && !isLoadingBid && (
                  <div className="col-span-2 bg-white/10 rounded-md p-3 mb-2">
                    <p className="text-white text-[16px] uppercase flex items-center justify-between gap-2">
                      Your current bid:{" "}
                      <span className="text-white font-semiboldt text-paragraph">
                        ${currentBid.bidPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
                <FormInputNumber
                  placeholder="Enter your bid"
                  id="bidPrice"
                  name="bidPrice"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  disabled={status === "draft" || isLoadingBid}
                  className="border-white bg-white"
                />
                {!showConfirm ? (
                  <ButtonType
                    small
                    yellowStroke
                    onClick={handlePlaceBid}
                    disabled={!bidPrice || isLoadingBid}
                  >
                    {currentBid && !isLoadingBid ? "Update Bid" : "Place Bid"}
                  </ButtonType>
                ) : (
                  <ButtonType
                    small
                    whiteButton
                    disabled={!agreedToTerms || isSubmitting}
                    onClick={handleConfirmBid}
                  >
                    {isSubmitting ? "Processing..." : "Confirm"}
                  </ButtonType>
                )}

                {showConfirm && (
                  <div className="mt-2 min-[500px]:col-span-2">
                    <FormInputCheckbox
                      id="bid-terms-agreement"
                      name="bid-terms-agreement"
                      checked={agreedToTerms}
                      onChange={(e) =>
                        setAgreedToTerms((e.target as HTMLInputElement).checked)
                      }
                    >
                      <span className="text-white">
                        By confirming this bid, you are agreeing to our{" "}
                        <Link
                          href="/terms-and-conditions"
                          target="_blank"
                          className="underline text-white desktop:hover:text-yellow transition-colors"
                        >
                          Terms &amp; Conditions
                        </Link>
                      </span>
                    </FormInputCheckbox>
                  </div>
                )}

                {error && (
                  <div className="col-span-2 mt-2 bg-red/50 rounded-md p-3">
                    <p className="text-white text-[14px]">{error}</p>
                  </div>
                )}
              </>
            )}

            <div
              className={classNames("phone:col-span-2", {
                "border-t border-white pt-2": !isTenderClosed,
              })}
            >
              <TenderCountdown
                tenderDeadline={tenderDeadline}
                darkBackground={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BidComponent;
