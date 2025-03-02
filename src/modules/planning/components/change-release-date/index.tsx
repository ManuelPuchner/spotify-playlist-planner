"use client";

import { changePlannedReleaseDate } from "@/lib/data/planned-releases";
import { PlannedRelease } from "@prisma/client";
import { Session } from "next-auth";
import { ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";

export default function ChangeReleaseDate({
  plannedRelease,
  session,
}: {
  plannedRelease: PlannedRelease;
  session: Session;
}) {
  const [date, setDate] = useState(plannedRelease.scheduledAt);
  const [lastDate, setLastDate] = useState(plannedRelease.scheduledAt);
  const [loading, setLoading] = useState(false);

  interface HandleChangeEvent extends ChangeEventHandler<HTMLInputElement> {
    (e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
  }

  const handleChange: HandleChangeEvent = async (e) => {
    const date = new Date(e.target.value);
    setDate(date);
  };

  const handleSetDate = async () => {
    if (!date) {
      return;
    }
    try {
      setLoading(true);
      await changePlannedReleaseDate(plannedRelease.id, date, session);
      setLoading(false);
      toast.success("Release date set");
      setLastDate(date);
    } catch (error) {
      if (error instanceof Error) {
        setDate(lastDate);
        toast.error(`Error setting release date: ${error.message}`);
      } else {
        toast.error("Error setting release date");
      }
    }
  };
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-neutral-100 font-semibold text-xl">
          Change Release Date
        </label>
        <span className="text-neutral-400 block text-sm">
          (releases always at 00:00)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={date ? date.toISOString().split("T")[0] : ""}
          className="rounded-md text-neutral-2000 bg-neutral-800 py-2 px-4"
          type="date"
          onChange={handleChange}
        />
        {date != lastDate && !loading && (
          <button
            onClick={handleSetDate}
            className="bg-green-400 text-neutral-900 rounded-md px-4 py-2 hover:bg-green-300  disabled:cursor-not-allowed"
            disabled={loading}
          >
            Set Date
          </button>
        )}
        {loading && (
          <div className="px-8 py-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 animate-spin text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
