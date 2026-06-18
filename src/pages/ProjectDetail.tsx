import { useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import gsap from "gsap";
import { projects } from "../lib/projects";

export function ProjectDetail() {
  const params = useParams();
  const project = projects.find(p => p.id === params.id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("light-theme");

    const ctx = gsap.context(() => {
      gsap.fromTo(".title-anim", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" });
      gsap.fromTo(".desc-anim", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".img-anim", { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.4 });
    }, containerRef);

    return () => {
      document.body.classList.remove("light-theme");
      ctx.revert();
    };
  }, [project]);

  if (!project) return <div>Project not found</div>;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] text-[#0a0a0a] pt-32 pb-24 px-8 md:px-24">
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_0_12px_#0a0a0a] z-40" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          <div className="flex-1 title-anim">
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8">{project.title}</h1>
            <button className="bg-black text-white px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-gray-800 transition-colors">
              See the case ▸
            </button>
          </div>

          <div className="flex-1 max-w-md desc-anim text-lg md:text-xl leading-relaxed text-gray-700">
            {project.description}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div
            className="img-anim w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})` }}
          >
            {project.image && <img src={project.image} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-80" />}
          </div>

          <div
            className="img-anim w-full aspect-square rounded-xl overflow-hidden shadow-2xl mt-16 md:mt-48"
            style={{ background: `linear-gradient(45deg, ${project.colors[1]}, ${project.colors[0]})` }}
          >
            {project.image && <img src={project.image} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-80" />}
          </div>
        </div>
      </div>
    </div>
  );
}
