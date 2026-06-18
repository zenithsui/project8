import { useEffect, useRef } from "react";
import gsap from "gsap";
import { projects } from "../lib/projects";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.remove("light-theme");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out" }
      );

      if (trackRef.current) {
        gsap.to(trackRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollProjects = [...projects, ...projects];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 md:px-24">
        <div ref={textRef} className="max-w-5xl text-3xl md:text-5xl lg:text-6xl leading-tight font-light text-center">
          I'm Amit, 🌍 creative designer and developer. 🎬 I build immersive digital experiences 🌊 that create emotional impact. 🌸 Always playing with design, motion and visual 🔵 narrative. Clean at times, ⬛ experimental at others.
        </div>
      </div>

      <div className="w-full h-64 overflow-hidden mb-12 opacity-80">
        <div ref={trackRef} className="flex gap-4 w-max h-full">
          {scrollProjects.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="h-full w-96 rounded-xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
            >
              {p.image && <img src={p.image} className="w-full h-full object-cover mix-blend-overlay opacity-50 rounded-xl" alt="" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
