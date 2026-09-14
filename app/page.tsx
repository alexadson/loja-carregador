import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import Guarantee from "@/components/Guarantee";
import BuyBox from "@/components/BuyBox";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Benefits />
        <HowItWorks />
        <Guarantee />
        <BuyBox />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
