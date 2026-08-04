"use client";

import { useEffect } from "react";
import { websiteTrack } from "@/src/lib/api";

export default function ClientTracker() {
  useEffect(() => {
    // if (sessionStorage.getItem("visited")) return;

    // sessionStorage.setItem("visited", "true");

    websiteTrack({ type: "website_visit" });
  }, []);

  return null;
}
