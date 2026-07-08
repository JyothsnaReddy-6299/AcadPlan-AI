import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function RootLayout() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950 text-ink dark:text-gray-100 overflow-x-hidden">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pt-20"
      >
        <Outlet />
      </motion.div>
      <Footer />
    </div>
  );
}
