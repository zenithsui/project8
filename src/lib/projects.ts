export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  colors: [string, string];
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Project 1",
    description: "Creative project — click to explore",
    image: "/project1.jpg",
    url: "https://amitproject11.vercel.app/",
    colors: ["#1a1a1a", "#2a2a2a"],
  },
  {
    id: "project-2",
    title: "Project 2",
    description: "Creative project — click to explore",
    image: "/project2.webp",
    url: "https://amitproject12.vercel.app/",
    colors: ["#f5f5dc", "#e8e8c0"],
  },
  {
    id: "project-3",
    title: "Project 3",
    description: "Creative project — click to explore",
    image: "/project3.jpg",
    url: "https://amitproject13.vercel.app/",
    colors: ["#cc0000", "#1a1a1a"],
  },
  {
    id: "project-4",
    title: "Project 4",
    description: "Creative project — click to explore",
    image: "/project4.png",
    url: "https://amitproject14.vercel.app/",
    colors: ["#1a3a3a", "#2d5a5a"],
  },
  {
    id: "project-5",
    title: "Project 5",
    description: "Creative project — click to explore",
    image: "/project5.png",
    url: "https://amitproject15.vercel.app/",
    colors: ["#f5f5f5", "#e0e0e0"],
  },
  {
    id: "project-6",
    title: "Project 6",
    description: "Creative project — click to explore",
    image: "/project6.png",
    url: "https://amitproject6.vercel.app/",
    colors: ["#7b2d8b", "#c44dba"],
  },
  {
    id: "project-7",
    title: "Project 7",
    description: "Creative project — click to explore",
    image: "/project7.jpg",
    url: "https://storage7.vercel.app/projects",
    colors: ["#2a2d3e", "#3d4260"],
  },
  {
    id: "project-8",
    title: "Project 8",
    description: "Creative project — click to explore",
    image: "/project8.png",
    url: "https://amitproject8.vercel.app/",
    colors: ["#1a1a1a", "#3a3a3a"],
  },
  {
    id: "pending-1",
    title: "Pending",
    description: "Coming soon",
    image: "/pending.png",
    url: "",
    colors: ["#ffffff", "#f0f0f0"],
  },
];
