import { HeroShowcase } from "@/components/hero-showcase";
import { FeaturedMenu } from "@/components/featured-menu";
import { Signatures } from "@/components/signatures";
import { Story } from "@/components/story";
import { Experience } from "@/components/experience";
import { Gallery } from "@/components/gallery";
import { Reviews } from "@/components/reviews";
import { Visit } from "@/components/visit";
import { Reservation } from "@/components/reservation";
import { Follow } from "@/components/follow";
import { Newsletter } from "@/components/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroShowcase />
      <FeaturedMenu />
      <Signatures />
      <Story />
      <Experience />
      <Gallery />
      <Reviews />
      <Visit />
      <Reservation />
      <Follow />
      <Newsletter />
    </>
  );
}
