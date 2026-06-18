import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "../lib/projects";

const RAINBOW = [
  "#ff4d4d", // red
  "#ff9933", // orange
  "#ffe033", // yellow
  "#44dd44", // green
  "#33ccff", // cyan
  "#4466ff", // blue
  "#aa44ff", // violet
  "#ff44cc", // pink
  "#ff6644", // coral
  "#22ffaa", // mint
];

function getNextPalette(currentOffset: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    RAINBOW[(i + currentOffset) % RAINBOW.length]
  );
}

export function ListView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const paletteOffset = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".list-item",
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" }
      );
    }, containerRef);

    // Set initial rainbow colors immediately
    itemRefs.current.forEach((el, i) => {
      if (el) el.style.color = RAINBOW[i % RAINBOW.length];
    });
    paletteOffset.current = 1;

    // Every 30s slowly transition all items to the next color set
    const interval = setInterval(() => {
      const nextColors = getNextPalette(paletteOffset.current, projects.length);
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          color: nextColors[i],
          duration: 4,
          ease: "power1.inOut",
        });
      });
      paletteOffset.current = (paletteOffset.current + 1) % RAINBOW.length;
    }, 30000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    hoveredRef.current = hoveredProject;
  }, [hoveredProject]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      gsap.to(previewRef.current, {
        x: e.clientX + 32,
        y: e.clientY - 80,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const handleScroll = () => {
      if (hoveredRef.current !== null) {
        setHoveredProject(null);
        hoveredRef.current = null;
        gsap.to(previewRef.current, {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.25,
          ease: "power2.in",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    const container = containerRef.current;
    if (container) container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEnter = (id: string, e: React.MouseEvent) => {
    gsap.set(previewRef.current, {
      x: e.clientX + 32,
      y: e.clientY - 80,
    });
    setHoveredProject(id);
    hoveredRef.current = id;
    gsap.to(previewRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    setHoveredProject(null);
    hoveredRef.current = null;
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power3.in",
    });
  };

  const activeProject = projects.find(p => p.id === hoveredProject);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-y-auto pt-32 pb-32"
      style={{ background: "#0a0a0a" }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.35, zIndex: 0 }}
      >
        <source src="/list-bg.mp4" type="video/mp4" />
      </video>

      <div className="relative flex flex-col items-center justify-center min-h-full" style={{ zIndex: 1 }}>
        {projects.map((project, i) => (
          <button
            key={project.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="list-item text-center max-w-4xl px-4 py-2 w-full cursor-none"
            style={{
              fontSize: "5vw",
              lineHeight: 1.2,
              fontWeight: 500,
              background: "none",
              border: "none",
              fontFamily: "inherit",
              display: "block",
              color: RAINBOW[i % RAINBOW.length],
            }}
            onMouseEnter={(e) => {
              handleEnter(project.id, e);
              gsap.to(e.currentTarget, { opacity: 0.5, fontStyle: "italic", duration: 0.25 });
            }}
            onMouseLeave={(e) => {
              handleLeave();
              gsap.to(e.currentTarget, { opacity: 1, fontStyle: "normal", duration: 0.25 });
            }}
            onClick={() => { if (project.url) window.open(project.url, "_blank"); }}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div
        ref={previewRef}
        className="fixed pointer-events-none z-50"
        style={{
          width: "280px",
          height: "180px",
          top: 0,
          left: 0,
          opacity: 0,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          willChange: "transform, opacity",
        }}
      >
        {activeProject && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${activeProject.colors[0]}, ${activeProject.colors[1]})`,
              }}
            />
            {activeProject.image && (
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.9 }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
