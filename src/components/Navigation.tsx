import { Link, useLocation, useSearch } from "wouter";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Menu } from "./Menu";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const bulletRef = useRef<HTMLSpanElement>(null);

  const viewMode = search.includes("view=list") ? "list" : "spiral";
  const isHome = location === "/" || location.startsWith("/?");

  const toggleView = (mode: "spiral" | "list") => {
    setLocation(`/?view=${mode}`);
  };

  useEffect(() => {
    gsap.to(bulletRef.current, {
      opacity: 0.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <img
            src="/avatar.jpg"
            alt="Amit"
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform"
            style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.15)" }}
          />
        </Link>

        {isHome && (
          <div className="absolute left-1/2 top-6 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() => toggleView("spiral")}
              className="transition-all duration-300"
              style={{
                color: viewMode === "spiral" ? "white" : "rgba(255,255,255,0.35)",
                fontWeight: viewMode === "spiral" ? 500 : 300,
                background: "none",
                border: "none",
                padding: "4px 0",
                letterSpacing: "0.2em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Spiral
            </button>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.45rem" }}>•</span>
            <button
              onClick={() => toggleView("list")}
              className="transition-all duration-300"
              style={{
                color: viewMode === "list" ? "white" : "rgba(255,255,255,0.35)",
                fontWeight: viewMode === "list" ? 500 : 300,
                background: "none",
                border: "none",
                padding: "4px 0",
                letterSpacing: "0.2em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              List
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen(true)}
          className="pointer-events-auto flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-gray-100 transition-colors"
        >
          Menu <span ref={bulletRef}>•</span>
        </button>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="pointer-events-auto fixed bottom-6 right-6 w-10 h-10 rounded-full border border-white/30 text-white flex items-center justify-center transition-colors hover:bg-white hover:text-black"
        >
          {soundOn ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          )}
        </button>
      </nav>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
