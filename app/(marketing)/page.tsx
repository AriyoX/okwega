import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Features } from "@/components/sections/features";
import { Testimonials } from "@/components/sections/testimonials";
import { AnimationWrapper } from "@/components/sections/animation-wrapper";

export default function Home() {
  return (
    <main>
      <AnimationWrapper>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        </AnimationWrapper>
    </main>
  );
}