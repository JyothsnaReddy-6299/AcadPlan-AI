import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, animate } from "framer-motion";
import { UploadCloud, FileText, ArrowRight, Network, CheckCircle2, XCircle } from "lucide-react";
import { uploadSyllabus } from "../lib/Api";

// Icons that radiate outward from the upload button on hover.
const RING_ICONS = [FileText, ArrowRight, Network, FileText, ArrowRight, Network];
const RADIUS = 78; // px, how far each icon travels from the button's center
const DEG_PER_SEC = 45; // constant angular speed — same every single hover, no drift

export default function UploadSection() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [fileName, setFileName] = useState("");
  const rotate = useMotionValue(0); // drives the ring's rotation directly
  const activeAnimation = useRef(null);
  const fileInputRef = useRef(null);

  const handleEnter = () => {
    setHovered(true);
    const current = rotate.get();
    const spins = 400; // effectively endless for any realistic hover duration
    const target = current + 360 * spins;
    const duration = (360 * spins) / DEG_PER_SEC; // always the same angular speed
    activeAnimation.current = animate(rotate, target, { duration, ease: "linear" });
  };

  const handleLeave = () => {
    setHovered(false);
    activeAnimation.current?.stop(); // freezes the ring exactly where it is — no snap-back
  };

  useEffect(() => () => activeAnimation.current?.stop(), []);

  const sendFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStatus("uploading");
    try {
      const result = await uploadSyllabus(file);
      setStatus("success");
      setTimeout(() => navigate(result?.nextRoute ?? "/cdp-review"), 700);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleFileInputChange = (e) => sendFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    sendFile(e.dataTransfer.files?.[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <section className="relative bg-white px-4 sm:px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-4xl"
      >
        <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(79,70,229,0.16)] p-6 sm:p-12">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="rounded-2xl border-2 border-dashed border-indigo-200/70 bg-white/50 px-6 py-14 sm:py-16 text-center"
          >
            {/* hidden native input — the styled button just triggers this */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Upload button with radiating icon ring */}
            <div
              className="relative mx-auto grid h-[140px] w-[140px] place-items-center"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {/* rotating ring — constant speed, bound directly to a motion value */}
              <motion.div
                style={{ rotate, transformOrigin: "50% 50%" }}
                className="absolute inset-0"
              >
                {RING_ICONS.map((Icon, i) => {
                  const angle = (360 / RING_ICONS.length) * i;
                  return (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2 transition-all duration-500 ease-out"
                      style={{
                        opacity: hovered ? 0.55 : 0,
                        // emerges from the button's center (0) out to RADIUS on hover
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${
                          hovered ? RADIUS : 0
                        }px) rotate(${-angle}deg)`,
                      }}
                    >
                      <Icon size={16} className="text-indigo-500" strokeWidth={2} />
                    </span>
                  );
                })}
              </motion.div>

              {/* the button itself */}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-teal-500 shadow-lg shadow-indigo-600/25 transition-transform duration-300 hover:scale-105"
              >
                <UploadCloud className="h-6 w-6 text-white" strokeWidth={2.25} />
              </button>
            </div>

            <h3 className="mt-5 font-display font-bold text-lg text-ink">
              Upload Syllabus
            </h3>
            <p className="mt-1.5 text-[13.5px] text-slate-500">
              Drag and drop your syllabus document here, or click to browse
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500">
              Supports PDF, DOCX
            </p>

            {/* upload status feedback */}
            {status !== "idle" && (
              <div className="mt-5 flex items-center justify-center gap-2 text-[13px]">
                {status === "uploading" && (
                  <span className="text-slate-500">Uploading {fileName}…</span>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle2 size={16} className="text-teal-600" />
                    <span className="text-teal-700">{fileName} uploaded successfully</span>
                  </>
                )}
                {status === "error" && (
                  <>
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-red-500">
                      Couldn't reach the server — check it's running
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
