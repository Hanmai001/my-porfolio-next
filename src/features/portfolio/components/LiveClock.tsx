"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

function formatNow() {
  return DateTime.now().toFormat("EEE, d MMM yyyy - h:mm:ss a");
}

export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const init = setTimeout(() => setTime(formatNow()), 0);
    const interval = setInterval(() => setTime(formatNow()), 1_000);
    return () => {
      clearTimeout(init);
      clearInterval(interval);
    };
  }, []);

  if (!time) return null;

  return <span className={className}>{time}</span>;
}
