import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import Footer from "./components/Footer";

const pageVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <motion.div
      key="landing"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
      </main>
      <Footer />
    </motion.div>
  );
}