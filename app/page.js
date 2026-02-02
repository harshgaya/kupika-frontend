import AyurvedicAdvantage from "@/src/components/home/hero/advantage";
import BestSellers from "@/src/components/home/hero/best-sellers";
import CustomerStories from "@/src/components/home/hero/customer-stories";
import FAQSection from "@/src/components/home/hero/faq";
import Hero from "@/src/components/home/hero/hero";
import PurestIngredients from "@/src/components/home/hero/purest-ingredients";
import WhyChooseKupika from "@/src/components/home/hero/why-choose";
import { getProducts } from "@/src/lib/api";
import Image from "next/image";

export default async function Home() {
  const data = await getProducts();

  return (
    <>
      <Hero />
      <BestSellers products={data.data} />
      <AyurvedicAdvantage />
      <PurestIngredients />
      <WhyChooseKupika />
      <CustomerStories />
      <FAQSection />
    </>
  );
}
