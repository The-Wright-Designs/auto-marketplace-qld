"use client";

import ButtonType from "@/_components/ui/buttons/button-type";
import { formatPrice } from "../vehicles/vehicle-detail-view";
import FormInputNumber from "@/_components/ui/form/form-input-number";
import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import FormInputCheckbox from "@/_components/ui/form/form-input-checkbox";
import Link from "next/link";
import { useAuth } from "@/_lib/auth/auth-context";
import {
  sendPurchaseEmails,
  sendOfferEmails,
} from "@/_actions/purchase-email-actions";
import { getDealerPurchaseForVehicle } from "@/_actions/purchase-actions";
import { Purchase } from "@/_types/purchase-types";
import { VehicleStatus } from "@/_types/vehicle-types";

interface BuyAndOfferComponentProps {
  vehicleStatus: VehicleStatus;
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
}

const BuyAndOfferComponent = ({
  vehicleStatus,
  vehiclePrice,
  vehicleId,
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
}: BuyAndOfferComponentProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"buy" | "offer">("buy");
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>("");
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);

  const isVehicleActive = vehicleStatus === "active";

  const fetchExistingPurchase = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoadingPurchase(true);
    const result = await getDealerPurchaseForVehicle(vehicleId, user.uid);
    if (result.success && result.data) {
      setCurrentPurchase(result.data);
      if (activeTab === "offer") {
        setActiveTab("buy");
      }
    }
    setIsLoadingPurchase(false);
  }, [user?.uid, vehicleId, activeTab]);

  useEffect(() => {
    fetchExistingPurchase();
  }, [fetchExistingPurchase]);

  const handleTabChange = (tab: "buy" | "offer") => {
    if (tab === "offer" && currentPurchase) {
      return;
    }
    setActiveTab(tab);
    setShowConfirm(false);
    setAgreedToTerms(false);
    setPurchaseSuccess(false);
    setOfferSuccess(false);
    setError(null);
    setOfferPrice("");
  };

  const handleConfirmPurchase = async () => {
    if (!user?.email || !user?.uid || !vehiclePrice) {
      setError("Missing required information");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendPurchaseEmails({
        userEmail: user.email,
        userUid: user.uid,
        vehicleId,
        registrationNumber,
        make,
        model,
        year,
        price: vehiclePrice,
        featuredImageUrl,
        bodyType,
        transmission,
        engineCapacity,
        fuelType,
        driveType,
        colour,
        vin,
      });

      if (result.success) {
        setPurchaseSuccess(true);
        setShowConfirm(false);
        setAgreedToTerms(false);
        await fetchExistingPurchase();
      } else {
        setError(result.error || "Failed to complete purchase");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Purchase error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!user?.email || !user?.uid || !vehiclePrice) {
      setError("Missing required information");
      return;
    }

    const offerAmount = parseFloat(offerPrice.replace(/,/g, ""));
    if (isNaN(offerAmount) || offerAmount <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendOfferEmails({
        userEmail: user.email,
        userUid: user.uid,
        registrationNumber,
        make,
        model,
        year,
        listPrice: vehiclePrice,
        offerPrice: offerAmount,
        featuredImageUrl,
        bodyType,
        transmission,
        engineCapacity,
        fuelType,
        driveType,
        colour,
        vin,
      });

      if (result.success) {
        setOfferSuccess(true);
        setOfferPrice("");
      } else {
        setError(result.error || "Failed to submit offer");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Offer error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/70 w-full rounded-md p-7">
      <div className="grid rounded-t-md overflow-hidden min-[500px]:grid-cols-2 min-[500px]:rounded-none">
        <button
          onClick={() => handleTabChange("buy")}
          className={classNames(
            "border-2 border-b-0 border-white grid place-items-center p-2 min-[500px]:rounded-tl-md min-[500px]:border-b-2 transition-colors duration-300",
            {
              "bg-yellow min-[500px]:bg-white": activeTab === "buy",
              "bg-yellow/30 min-[500px]:bg-transparent": activeTab !== "buy",
            },
          )}
        >
          <p
            className={classNames(
              "text-[16px] transition-colors duration-300",
              {
                "text-black": activeTab === "buy",
                "min-[500px]:text-white": activeTab !== "buy",
              },
            )}
          >
            Buy Now
          </p>
        </button>
        <button
          onClick={() => handleTabChange("offer")}
          disabled={!!currentPurchase && !isLoadingPurchase}
          className={classNames(
            "border-2  border-white grid place-items-center p-2 min-[500px]:rounded-tr-md min-[500px]:border-l-0 transition-colors duration-300",
            {
              "bg-yellow min-[500px]:bg-white": activeTab === "offer",
              "bg-yellow/30 min-[500px]:bg-transparent": activeTab !== "offer",
              "opacity-50 cursor-not-allowed": !!currentPurchase && !isLoadingPurchase,
            },
          )}
        >
          <p
            className={classNames(
              "text-[16px] transition-colors duration-300",
              {
                "text-black": activeTab === "offer",
                "min-[500px]:text-white": activeTab !== "offer",
              },
            )}
          >
            Make An Offer
          </p>
        </button>
      </div>
      {activeTab === "buy" && (
        <div className="grid gap-5 items-center px-5 py-5 border-2 border-t-0 rounded-b-md border-white animate-fadeIn min-[500px]:grid-cols-2 min-[500px]:gap-7 min-[500px]:justify-center">
          {purchaseSuccess ? (
            <div className="col-span-2 text-center py-5">
              <p className="text-white text-[20px] font-semibold mb-2">
                Purchase Confirmed!
              </p>
              <p className="text-white text-[16px]">
                Confirmation emails have been sent. Our team will be in touch
                soon.
              </p>
            </div>
          ) : (
            <>
              {!isVehicleActive ? (
                <div className="col-span-2 py-5">
                  <p className="text-white text-[18px]">
                    This vehicle is not available for purchase.
                  </p>
                </div>
              ) : currentPurchase && !isLoadingPurchase ? (
                <div className="col-span-2 py-5">
                  <p className="text-white text-[18px]">
                    You have already made an offer to purchase this vehicle.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-white text-center text-[24px] font-semibold">
                    {formatPrice(vehiclePrice)}
                  </p>
                  {!showConfirm ? (
                    <ButtonType
                      small
                      yellowStroke
                      onClick={() => setShowConfirm(true)}
                      disabled={isLoadingPurchase}
                      cssClasses="w-full min-[500px]:w-auto"
                    >
                      Buy Now
                    </ButtonType>
                  ) : (
                    <ButtonType
                      small
                      whiteButton
                      disabled={!agreedToTerms || isSubmitting}
                      onClick={handleConfirmPurchase}
                    >
                      {isSubmitting ? "Processing..." : "Confirm"}
                    </ButtonType>
                  )}

                  {showConfirm && (
                    <div className="mt-2 min-[500px]:col-span-2">
                      <FormInputCheckbox
                        id="terms-agreement"
                        name="terms-agreement"
                        checked={agreedToTerms}
                        onChange={(e) =>
                          setAgreedToTerms(
                            (e.target as HTMLInputElement).checked,
                          )
                        }
                      >
                        <span className="text-white">
                          By confirming this purchase, you are agreeing to our{" "}
                          <Link
                            href="/terms-and-conditions"
                            target="_blank"
                            className="underline hover:text-yellow transition-colors"
                          >
                            Terms &amp; Conditions
                          </Link>
                        </span>
                      </FormInputCheckbox>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="col-span-2 mt-2 bg-red/50 rounded-md p-3">
                  <p className="text-white text-[14px]">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {activeTab === "offer" && (
        <div className="grid gap-5 items-center px-5 py-5 border-2 border-t-0 rounded-b-md border-white animate-fadeIn min-[500px]:grid-cols-2 min-[500px]:gap-7 min-[500px]:justify-center">
          {offerSuccess ? (
            <div className="col-span-2 text-center py-5">
              <p className="text-white text-[20px] font-semibold mb-2">
                Offer Submitted!
              </p>
              <p className="text-white text-[16px]">
                Confirmation emails have been sent. Our team will review your
                offer and be in touch soon.
              </p>
            </div>
          ) : (
            <>
              {!isVehicleActive ? (
                <div className="col-span-2 py-5">
                  <p className="text-white text-[18px]">
                    This vehicle is not available for offers.
                  </p>
                </div>
              ) : (
                <>
                  <FormInputNumber
                    placeholder="Enter your offer"
                    id="offerPrice"
                    name="offerPrice"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="border-white bg-white"
                    prefix="$"
                  />
                  <ButtonType
                    small
                    yellowStroke
                    onClick={handleSubmitOffer}
                    disabled={isSubmitting || !offerPrice}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Offer"}
                  </ButtonType>

                  {error && (
                    <div className="col-span-2 mt-2 bg-red/50 rounded-md p-3">
                      <p className="text-white text-[14px]">{error}</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyAndOfferComponent;
