import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import FeatureCards from "./components/FeatureCards";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-ink overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <UploadSection />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}