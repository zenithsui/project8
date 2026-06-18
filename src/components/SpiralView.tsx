import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { projects } from "../lib/projects";

const N = projects.length;
const RADIUS = 380;
const BASE_SPEED = 0.0015;
const CARD_W = 245;
const CARD_H = 155;

// Tilted ring angles — rotate the orbit circle around X then Z
// TILT_X: how much the ring tips (top goes back, bottom comes forward)
//   Lower value = ring stands more upright = more vertical top-to-bottom span
// TILT_Z: diagonal slant so the axis runs upper-right → lower-left
const TILT_X = (42 * Math.PI) / 180;
const TILT_Z = (28 * Math.PI) / 180;
const cosTX = Math.cos(TILT_X);
const sinTX = Math.sin(TILT_X);
const cosTZ = Math.cos(TILT_Z);
const sinTZ = Math.sin(TILT_Z);

export function SpiralView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const globalAngle = useRef(0);
  const scrollVel = useRef(0);

  const mx = useRef(0);
  const my = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafId = useRef(0);

  const tick = useCallback(() => {
    scrollVel.current *= 0.93;
    globalAngle.current += BASE_SPEED + scrollVel.current;

    mouseX.current += (mx.current * 22 - mouseX.current) * 0.055;
    mouseY.current += (my.current * 14 - mouseY.current) * 0.055;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const a = (i / N) * 2 * Math.PI + globalAngle.current;

      // --- Tilted elliptical ring (tilted Ferris wheel) ---
      // Start with a flat circle in the XY plane, then rotate:
      //   1. Around X by TILT_X  → top tips away, bottom comes forward
      //   2. Around Z by TILT_Z  → diagonal slant (top-right back, bottom-left front)

      const cx = Math.cos(a);    // raw ring X
      const cy = Math.sin(a);    // raw ring Y

      // After rotation around X
      const rx = RADIUS * cx;
      const ry = RADIUS * cy * cosTX;
      const rz = RADIUS * cy * sinTX;

      // After rotation around Z (diagonal tilt)
      const x = rx * cosTZ - ry * sinTZ + mouseX.current;
      const y = rx * sinTZ + ry * cosTZ + mouseY.current;
      const z = rz;  // depth: positive = toward viewer (bottom of ring)

      // Card surface orientation:
      // rotX — tilt card face based on z depth (back cards tilt away from viewer)
      const rotX = -z * 0.03;
      // rotY — keep cards facing the screen (0 = fully flat toward viewer)
      const rotY = 0;
      // rotZ — very subtle sway per card
      const rotZ = Math.sin(a * 0.7 + i * 1.2) * 2.5;

      el.style.transform = `
        translateX(calc(-50% + ${x}px))
        translateY(calc(-50% + ${y}px))
        translateZ(${z}px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
      `;
      // z-index: cards closer to viewer (larger z) render on top
      el.style.zIndex = Math.round(z + RADIUS + 1).toString();
    });

    rafId.current = requestAnimationFrame(tick);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mx.current = (e.clientX / window.innerWidth - 0.5) * 2;
    my.current = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    scrollVel.current += e.deltaY * 0.0003;
  }, []);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.9, ease: "power2.out" }
    );

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, scale: 0.72 },
        { opacity: 1, scale: 1, duration: 1.1, delay: 0.1 + i * 0.07, ease: "power3.out" }
      );
    });

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, [tick, onMouseMove, onWheel]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ background: "#0a0a0a" }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35, zIndex: 0 }}
      >
        <source src="/spiral-bg.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 48%" }}
      >
        {projects.map((project, i) => {
          const isHov = hoveredId === project.id;
          return (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute"
              style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                top: "48%",
                left: "50%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: isHov
                  ? `0 30px 75px rgba(0,0,0,0.85), 0 0 55px ${project.colors[0]}55`
                  : `0 18px 55px rgba(0,0,0,0.65)`,
                transition: "box-shadow 0.4s ease",
                willChange: "transform",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => { if (project.url) window.open(project.url, "_blank"); }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})`,
                }}
              />
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.92 }}
                />
              )}
              {/* Glass sheen — simulates slight surface curvature */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(130deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)",
                }}
              />
              {/* Hover title reveal */}
              <div
                className="absolute inset-0 flex items-end p-4 pointer-events-none"
                style={{
                  background: isHov
                    ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 65%)"
                    : "transparent",
                  transition: "background 0.35s ease",
                }}
              >
                <span
                  className="text-white text-[11px] font-medium tracking-widest uppercase"
                  style={{
                    opacity: isHov ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    textShadow: "0 1px 5px rgba(0,0,0,0.8)",
                  }}
                >
                  {project.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
