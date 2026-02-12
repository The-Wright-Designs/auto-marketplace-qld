"use client";

import { useAuth } from "@/_lib/auth/auth-context";
import { getDealerBids } from "@/_actions/bid-actions";
import { getBidImageUrls } from "@/_actions/get-bid-image-urls";
import { getDealerPurchases } from "@/_actions/purchase-actions";
import { getPurchaseImageUrls } from "@/_actions/get-purchase-image-urls";
import { getDealerOffers } from "@/_actions/offer-actions";
import { getOfferImageUrls } from "@/_actions/get-offer-image-urls";
import DealerBidsComponent from "@/_components/pages/dealer-portal/my-bids/dealer-bids-component";
import DealerBuyOfferComponent from "@/_components/pages/dealer-portal/my-bids/dealer-buy-offer-component";
import { Bid } from "@/_types/bid-types";
import { Purchase } from "@/_types/purchase-types";
import { Offer } from "@/_types/offer-types";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function MyBidsPage() {
  const { user, isLoading } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(true);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      if (!user?.uid) {
        setIsLoadingBids(false);
        return;
      }

      setIsLoadingBids(true);

      const result = await getDealerBids(user.uid);
      if (result.success && result.data) {
        const imageUrlsResult = await getBidImageUrls(result.data);
        const imageUrls = imageUrlsResult.success && imageUrlsResult.data ? imageUrlsResult.data : {};

        const bidsWithUrls = result.data.map(bid => ({
          ...bid,
          vehicle: {
            ...bid.vehicle,
            featuredImageUrl: imageUrls[bid.vehicleUid] || ''
          }
        }));

        setBids(bidsWithUrls);
      }
      setIsLoadingBids(false);
    };

    fetchBids();
  }, [user?.uid]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.uid) {
        setIsLoadingPurchases(false);
        return;
      }

      setIsLoadingPurchases(true);

      const result = await getDealerPurchases(user.uid);
      if (result.success && result.data) {
        const imageUrlsResult = await getPurchaseImageUrls(result.data);
        const imageUrls = imageUrlsResult.success && imageUrlsResult.data ? imageUrlsResult.data : {};

        const purchasesWithUrls = result.data.map(purchase => ({
          ...purchase,
          vehicle: {
            ...purchase.vehicle,
            featuredImageUrl: imageUrls[purchase.vehicleUid] || ''
          }
        }));

        setPurchases(purchasesWithUrls);
      }
      setIsLoadingPurchases(false);
    };

    fetchPurchases();
  }, [user?.uid]);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user?.uid) {
        setIsLoadingOffers(false);
        return;
      }

      setIsLoadingOffers(true);

      const result = await getDealerOffers(user.uid);
      if (result.success && result.data) {
        const imageUrlsResult = await getOfferImageUrls(result.data);
        const imageUrls = imageUrlsResult.success && imageUrlsResult.data ? imageUrlsResult.data : {};

        const offersWithUrls = result.data.map(offer => ({
          ...offer,
          vehicle: {
            ...offer.vehicle,
            featuredImageUrl: imageUrls[offer.vehicleUid] || ''
          }
        }));

        setOffers(offersWithUrls);
      }
      setIsLoadingOffers(false);
    };

    fetchOffers();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="grid gap-10">
        <h1 className="text-subheading full-hd:text-subheading-desktop">
          My Bids
        </h1>
        <p className="text-paragraph text-grey">Loading your bids...</p>
      </div>
    );
  }

  if (!user) {
    redirect("/for-dealers/login");
  }

  return (
    <div className="grid gap-10">
      <h1 className="text-subheading full-hd:text-subheading-desktop">
        My Bids
      </h1>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">Current Tenders</h2>
        <DealerBidsComponent
          bids={bids}
          filterType="current"
          loading={isLoadingBids}
        />
      </div>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">Past Tenders</h2>
        <DealerBidsComponent
          bids={bids}
          filterType="past"
          loading={isLoadingBids}
        />
      </div>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">My Vehicles</h2>
        <DealerBuyOfferComponent
          items={purchases}
          type="purchase"
          loading={isLoadingPurchases}
        />
      </div>
      <div className="grid gap-5">
        <h2 className="text-paragraph-desktop">My Offers</h2>
        <DealerBuyOfferComponent
          items={offers}
          type="offer"
          loading={isLoadingOffers}
        />
      </div>
    </div>
  );
}
