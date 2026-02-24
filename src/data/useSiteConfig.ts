// hooks/useSiteConfig.ts
import { useEffect, useState } from "react";
import type { SiteConfig } from "../types";

const CLOUDINARY_JSON_URL = import.meta.env.VITE_CLOUDINARY_JSON_URL;

export function useSiteConfig() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJson = async () => {
      try {
        const res = await fetch(CLOUDINARY_JSON_URL);
        if (!res.ok) throw new Error("Failed to load JSON");
        const data: SiteConfig = await res.json();
        setSiteConfig(data);
      } catch (err) {
        console.error("Error fetching JSON:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJson();
  }, []);

  return { siteConfig, loading };
}