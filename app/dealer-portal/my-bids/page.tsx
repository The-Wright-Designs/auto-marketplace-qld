"use client";

import { useAuth } from "@/_lib/auth/auth-context";
import { getDealerBids } from "@/_actions/bid-actions";
import DealerBidsComponent from "@/_components/pages/dealer-portal/my-bids/dealer-bids-component";
import { Bid } from "@/_types/bid-types";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function MyBidsPage() {
  const { user, isLoading } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      if (!user?.uid) {
        setIsLoadingBids(false);
        return;
      }

      setIsLoadingBids(true);

      const result = await getDealerBids(user.uid);
      if (result.success && result.data) {
        setBids(result.data);
      }
      setIsLoadingBids(false);
    };

    fetchBids();
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
    </div>
  );
}
