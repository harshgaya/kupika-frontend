import HappyBrohers from "@/src/components/home/hero/25-lakh-brothers";
import AyurvedicAdvantage from "@/src/components/home/hero/advantage";
import BestSellers from "@/src/components/home/hero/best-sellers";
import CustomerStories from "@/src/components/home/hero/customer-stories";
import FAQSection from "@/src/components/home/hero/faq";
import FAQ from "@/src/components/home/hero/faq-new";
import Hero from "@/src/components/home/hero/hero";
import HeroBanner from "@/src/components/home/hero/hero-banner";
import HeroCarousel from "@/src/components/home/hero/hero-carousal";
import PurestIngredients from "@/src/components/home/hero/purest-ingredients";
import PureIngredients from "@/src/components/home/hero/purest-ingredients-new";
import ShopByCategory from "@/src/components/home/hero/shop-by-category";
import ShopFromReels from "@/src/components/home/hero/shop-from-reel";
import Testimonials from "@/src/components/home/hero/testimonial";
import WhyChooseKupika from "@/src/components/home/hero/why-choose";
import NightRulesSection from "@/src/components/home/hero/your-nigh-your-rule";
import ProductReviewVideos from "@/src/components/home/youtube/youtube-review";
import { getProducts } from "@/src/lib/api";
import Image from "next/image";

export default async function Home() {
  const data = await getProducts();

  return (
    <>
      <HeroCarousel />
      {/* <Hero /> */}
      <ShopFromReels />
      <NightRulesSection />
      {/* <BestSellers products={data.data} /> */}
      <HappyBrohers />
      <ShopByCategory />
      {/* <AyurvedicAdvantage /> */}
      <PureIngredients />
      {/* <PurestIngredients /> */}
      {/* <WhyChooseKupika />
      <ProductReviewVideos />
      <CustomerStories />
      <FAQSection /> */}
      <HeroBanner />
      <Testimonials />
      <FAQ />
    </>
  );
}
