import { createFileRoute } from "@tanstack/react-router";
import { Assistant } from "@/components/Assistant";
import { CustomCursor } from "@/components/CustomCursor";
import { SceneStage } from "@/components/SceneStage";
import { SiteNav } from "@/components/SiteNav";
import { Contact } from "@/sections/Contact";
import { Domains } from "@/sections/Domains";
import { Hero } from "@/sections/Hero";
import { Studio } from "@/sections/Studio";
import { SystemMap } from "@/sections/SystemMap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WYRD Designs — Design & Technology Studio, Bangalore" },
      {
        name: "description",
        content:
          "WYRD Designs is a design and technology studio in Bangalore, working at the intersection of design, technology and digital experiences.",
      },
      { property: "og:title", content: "WYRD Designs — Design & Technology Studio" },
      {
        property: "og:description",
        content:
          "A studio in Bangalore working where design and technology meet. Technology should disappear into the experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="grain relative min-h-screen">
      <CustomCursor />
      <SceneStage />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <Domains />
        <SystemMap />
        <Studio />
        <Contact />
      </main>
      <Assistant />
    </div>
  );
}
