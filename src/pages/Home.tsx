import { useSearch } from "wouter";
import { SpiralView } from "../components/SpiralView";
import { ListView } from "../components/ListView";
import { useEffect } from "react";

export function Home() {
  const search = useSearch();
  const isList = search.includes("view=list");

  useEffect(() => {
    document.body.classList.remove("light-theme");
  }, []);

  return (
    <main className="w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      {isList ? <ListView /> : <SpiralView />}
    </main>
  );
}
