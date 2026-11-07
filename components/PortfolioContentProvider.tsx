"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultPortfolioContent, type PortfolioContent } from "@/lib/data";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type PortfolioContextValue = { content: PortfolioContent };
const PortfolioContext = createContext<PortfolioContextValue>({ content: defaultPortfolioContent });

function mergeContent(saved: Partial<PortfolioContent> | null | undefined): PortfolioContent {
  if (!saved) return defaultPortfolioContent;
  return {
    ...defaultPortfolioContent,
    ...saved,
    profile: { ...defaultPortfolioContent.profile, ...saved.profile },
  };
}

export default function PortfolioContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultPortfolioContent);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;

    async function loadPublishedContent() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("portfolio_content")
          .select("data")
          .eq("id", "site")
          .maybeSingle();
        if (error) throw error;
        if (!cancelled && data?.data) setContent(mergeContent(data.data as Partial<PortfolioContent>));
      } catch {
        // Keep the built-in portfolio copy available if the CMS is not set up yet.
      }
    }

    void loadPublishedContent();
    return () => { cancelled = true; };
  }, []);

  return <PortfolioContext.Provider value={{ content }}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContent() {
  return useContext(PortfolioContext);
}
