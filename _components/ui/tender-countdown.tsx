"use client";

import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { formatDateTime } from "@/_lib/utils/date-formatter";

interface TenderCountdownProps {
  tenderDeadline?: string;
  small?: boolean;
  darkBackground?: boolean;
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
  darkBackground = false,
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
        className={classNames("flex", {
          "px-2 bg-white rounded-md border border-blue": small,
        })}
      >
        <p
          className={classNames(
            "font-bold uppercase",
            darkBackground ? "text-white" : "text-grey",
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
        "flex flex-wrap gap-x-2 items-center": !small,
      })}
    >
      {!small && (
        <p
          className={classNames(
            "uppercase text-[16px] font-semibold",
            darkBackground ? "text-yellow" : "text-blue",
          )}
        >
          Ends in
        </p>
      )}
      <div
        className={classNames(
          "flex items-center",
          {
            "gap-1 justify-center": small,
            "gap-1": !small,
          },
          timeLeft.days !== 0 && !small ? "w-[122px]" : "w-[90px]",
        )}
      >
        {timeLeft.days !== 0 && (
          <div
            className={classNames("flex", {
              "items-end": small,
              hidden: timeLeft.days === 0 && small,
            })}
          >
            <span
              className={classNames(
                small
                  ? darkBackground
                    ? "font-semibold text-white text-[13.5px]"
                    : "font-semibold text-blue text-[13.5px]"
                  : darkBackground
                    ? "text-[16px] text-white"
                    : "text-[16px] text-grey",
              )}
            >
              {timeLeft.days}
            </span>
            <span
              className={classNames(
                small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
                darkBackground ? "text-white" : "text-grey",
              )}
            >
              d
            </span>
          </div>
        )}
        <div className={classNames("flex", { "items-end": small })}>
          <span
            className={classNames(
              small
                ? darkBackground
                  ? "font-semibold text-white text-[13.5px]"
                  : "font-semibold text-blue text-[13.5px]"
                : darkBackground
                  ? "text-[16px] text-white"
                  : "text-[16px] text-grey",
            )}
          >
            {timeLeft.hours}
          </span>
          <span
            className={classNames(
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
              darkBackground ? "text-white" : "text-grey",
            )}
          >
            h
          </span>
        </div>
        <div className={classNames("flex", { "items-end": small })}>
          <span
            className={classNames(
              small
                ? darkBackground
                  ? "font-semibold text-white text-[13.5px]"
                  : "font-semibold text-blue text-[13.5px]"
                : darkBackground
                  ? "text-[16px] text-white"
                  : "text-[16px] text-grey",
            )}
          >
            {timeLeft.minutes}
          </span>
          <span
            className={classNames(
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
              darkBackground ? "text-white" : "text-grey",
            )}
          >
            m
          </span>
        </div>
        <div
          className={classNames("flex", {
            "items-end": small,
            hidden: timeLeft.days !== 0 && small,
          })}
        >
          <span
            className={classNames(
              small
                ? darkBackground
                  ? "font-semibold text-white text-[13.5px]"
                  : "font-semibold text-blue text-[13.5px]"
                : darkBackground
                  ? "text-[16px] text-white"
                  : "text-[16px] text-grey",
            )}
          >
            {timeLeft.seconds}
          </span>
          <span
            className={classNames(
              small ? "text-[12px] mb-[1.25px]" : "text-[16px]",
              darkBackground ? "text-white" : "text-grey",
            )}
          >
            s
          </span>
        </div>
      </div>
      {!small && (
        <p className="text-white/75 text-[16px] ml-1.5">
          ({formatDateTime(tenderDeadline)} AEST/AEDT)
        </p>
      )}
    </div>
  );
}
