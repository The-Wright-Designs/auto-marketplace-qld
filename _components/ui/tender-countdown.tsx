"use client";

import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

interface TenderCountdownProps {
  tenderDeadline?: string;
  small?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TenderCountdown({
  tenderDeadline,
  small = false,
}: TenderCountdownProps) {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    if (!tenderDeadline) {
      return null;
    }

    const difference = +new Date(tenderDeadline) - +new Date();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [tenderDeadline]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    calculateTimeLeft(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) {
    return (
      <div
        className={classNames("flex items-center justify-center", {
          "px-2 bg-white rounded-md border border-blue": small,
        })}
      >
        <p
          className={classNames(
            "text-grey font-bold uppercase",
            small ? "text-[12px]" : "text-paragraph",
          )}
        >
          {!tenderDeadline
            ? small
              ? "TBA"
              : "Deadline TBA"
            : small
              ? "Closed"
              : "Tender Closed"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={classNames({
        "px-1.5 py-[3px] bg-white rounded-md border border-blue": small,
      })}
    >
      {!small && (
        <p className="text-blue uppercase text-[16px] font-semibold -mb-1">
          Ends in
        </p>
      )}
      <div
        className={classNames(
          "flex items-center",
          small ? "gap-1 justify-center" : "gap-1",
        )}
      >
        <div className={classNames("flex", { "items-end": small })}>
          <span
            className={classNames(
              small
                ? "font-semibold text-blue text-[13.5px]"
                : "text-[16px] text-grey",
            )}
          >
            {timeLeft.days}
          </span>
          <span
            className={classNames(
              "text-grey",
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
            )}
          >
            d
          </span>
        </div>
        <div className={classNames("flex", { "items-end": small })}>
          <span
            className={classNames(
              "text-blue font-semibold",
              small ? "text-[13.5px]" : "text-[16px] text-grey",
            )}
          >
            {timeLeft.hours}
          </span>
          <span
            className={classNames(
              "text-grey",
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
            )}
          >
            h
          </span>
        </div>
        <div className={classNames("flex", { "items-end": small })}>
          <span
            className={classNames(
              "text-blue font-semibold",
              small ? "text-[13.5px]" : "text-[16px] text-grey",
            )}
          >
            {timeLeft.minutes}
          </span>
          <span
            className={classNames(
              "text-grey",
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
            )}
          >
            m
          </span>
        </div>
        {!small && (
          <div className="flex">
            <span className="text-grey text-[16px]">{timeLeft.seconds}</span>
            <span className="text-grey text-[16px]">s</span>
          </div>
        )}
      </div>
    </div>
  );
}
