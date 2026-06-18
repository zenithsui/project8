import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "works",   href: "https://amitproject15.vercel.app/", num: "01" },
  { label: "about",   href: "https://amitproject6.vercel.app/",  num: "02" },
  { label: "contact", href: "https://www.instagram.com/amit.luvly", num: "03" },
];

function MenuLink({
  link,
  index,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  link: typeof NAV_LINKS[number];
  index: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLSpanElement>(null);
  const bottomTextRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    onMouseEnter();
    gsap.to(topTextRef.current, { yPercent: -105, duration: 0.45, ease: "power3.out" });
    gsap.to(bottomTextRef.current, { yPercent: -100, duration: 0.45, ease: "power3.out" });
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.45, ease: "power3.out" });
    gsap.to(numRef.current, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" });
  };

  const handleLeave = () => {
    onMouseLeave();
    gsap.to(topTextRef.current, { yPercent: 0, duration: 0.45, ease: "power3.out" });
    gsap.to(bottomTextRef.current, { yPercent: 0, duration: 0.45, ease: "power3.out" });
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.35, ease: "power3.in" });
    gsap.to(numRef.current, { autoAlpha: 0, x: -6, duration: 0.25, ease: "power2.in" });
  };

  useEffect(() => {
    gsap.set(bottomTextRef.current, { yPercent: 0 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(numRef.current, { autoAlpha: 0, x: -6 });
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="block cursor-pointer select-none"
        style={{ textDecoration: "none" }}
      >
        <div className="relative overflow-hidden" style={{ lineHeight: 1.05 }}>
          <span
            ref={topTextRef}
            className="block text-[#0a0a0a] font-medium tracking-tight"
            style={{ fontSize: "clamp(52px, 7.5vw, 84px)" }}
          >
            {link.label}
          </span>
          <span
            ref={bottomTextRef}
            aria-hidden
            className="block text-[#0a0a0a]/25 font-medium tracking-tight absolute top-full left-0 pointer-events-none"
            style={{ fontSize: "clamp(52px, 7.5vw, 84px)" }}
          >
            {link.label}
          </span>
        </div>

        <div
          ref={lineRef}
          className="h-px bg-[#0a0a0a]"
          style={{ transformOrigin: "left center" }}
        />
      </a>

      <span
        ref={numRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0a0a0a]/30 text-xs tracking-widest font-light pointer-events-none"
      >
        {link.num}
      </span>
    </div>
  );
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    if (!panelRef.current) return;

    if (isOpen) {
      gsap.set(panelRef.current, { pointerEvents: "auto", x: "100%" });
      gsap.set(backdropRef.current, { pointerEvents: "auto", autoAlpha: 0 });

      gsap.to(backdropRef.current, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(panelRef.current, { x: "0%", duration: 0.6, ease: "power4.out" });

      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { x: 60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.55, stagger: 0.09, ease: "power3.out", delay: 0.3 }
        );
      }
      if (bottomRef.current) {
        gsap.fromTo(bottomRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.55 });
      }
    } else {
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power4.in",
        onComplete: () => gsap.set(panelRef.current, { pointerEvents: "none" }),
      });
      gsap.to(backdropRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => gsap.set(backdropRef.current, { pointerEvents: "none" }),
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const moveCursor = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) return;

      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "none",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [isOpen]);

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[99] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.3)", opacity: 0 }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-[100] flex flex-col select-none"
        style={{
          width: "min(520px, 92vw)",
          background: "#fafafa",
          transform: "translateX(100%)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.25)",
          cursor: isOpen ? "none" : "auto",
        }}
      >
        <div className="absolute top-7 right-7 flex items-center gap-3 z-10">
          <span
            className="text-[#0a0a0a] text-sm tracking-wider hover:opacity-50 transition-opacity duration-200"
            style={{ cursor: "none" }}
            onClick={onClose}
          >
            close
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center hover:bg-[#333] transition-colors duration-200"
            style={{ cursor: "none" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <line x1="1" y1="1" x2="12" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="12" y1="1" x2="1" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div
          ref={linksRef}
          className="flex flex-col justify-center flex-1 px-14 gap-1 mt-8"
        >
          {NAV_LINKS.map((link, i) => (
            <MenuLink
              key={link.href}
              link={link}
              index={i}
              onClick={onClose}
              onMouseEnter={() => {
                setCursorActive(true);
                gsap.to(cursorRef.current, { scale: 3.5, duration: 0.4, ease: "power2.out" });
                gsap.to(cursorDotRef.current, { scale: 0, duration: 0.2 });
              }}
              onMouseLeave={() => {
                setCursorActive(false);
                gsap.to(cursorRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
                gsap.to(cursorDotRef.current, { scale: 1, duration: 0.2 });
              }}
            />
          ))}
        </div>

        <div ref={bottomRef} className="px-14 pb-10 flex-shrink-0">
          <a
            href="mailto:xyz@gmail.com"
            className="text-[#0a0a0a]/40 text-xs tracking-wide hover:text-[#0a0a0a] transition-colors duration-200"
          >
            xyz@gmail.com
          </a>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[200] pointer-events-none" style={{ cursor: "none" }}>
          <div
            ref={cursorRef}
            className="fixed pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1.5px solid rgba(10,10,10,0.35)",
              transform: "translate(-50%, -50%)",
              top: 0,
              left: 0,
              mixBlendMode: "multiply",
            }}
          />
          <div
            ref={cursorDotRef}
            className="fixed pointer-events-none"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#0a0a0a",
              transform: "translate(-50%, -50%)",
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </>
  );
}
