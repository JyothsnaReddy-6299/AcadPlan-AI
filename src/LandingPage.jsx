import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import FeatureCards from "./components/FeatureCards";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";

// Smooth page-in animation wrapper
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <SplashScreen onFinish={() => setShowSplash(false)} />

      <AnimatePresence>
        {!showSplash && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="relative min-h-screen bg-ivory dark:bg-gray-950 text-ink dark:text-gray-100 overflow-x-hidden"
          >
            <Navbar />
            <main>
              <Hero />
              <UploadSection />
              <FeatureCards />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}