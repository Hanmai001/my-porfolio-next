"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

function formatNow() {
  return DateTime.now().toFormat("EEE, d MMM yyyy - h:mm a");
}

export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(formatNow());

    const now = DateTime.now();
    const msUntilNextMinute =
      (60 - now.second) * 1000 - now.millisecond;

    const timeout = setTimeout(() => {
      setTime(formatNow());
      const interval = setInterval(() => setTime(formatNow()), 60_000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  if (!time) return null;

  return <span className={className}>{time}</span>;
}
