"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Wifi, Zap, Shield, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    question: "What is GigaLink?",
    answer:
      "GigaLink is a prepaid, QR-based WiFi system that lets you access the internet instantly—no apps or subscriptions required.",
  },
  {
    id: 2,
    question: "How does GigaLink work?",
    answer:
      "Connect to the GigaLink WiFi network, scan/type your QR voucher, and get online immediately.",
  },
  {
    id: 3,
    question: "What do I need to use GigaLink?",
    answer: "Any WiFi-enabled device. No app or registration is required.",
  },
];

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1750711158632-5273ec9b9b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    title: "Fast & Reliable WiFi",
    description: "Experience lightning-fast internet connectivity anywhere",
  },
  {
    url: "https://images.unsplash.com/photo-1771859997374-5aa3106190d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    title: "Powered by Starlink",
    description: "Satellite technology bringing internet to remote areas",
  },
  {
    url: "https://images.unsplash.com/photo-1758519288954-4e4f55e4701e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    title: "Connect Instantly",
    description: "Get online in seconds with any WiFi-enabled device",
  },
  {
    url: "https://images.unsplash.com/photo-1681321570365-df53da7dbaa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    title: "Network Excellence",
    description: "Seamless connectivity for all your devices",
  },
  {
    url: "https://images.unsplash.com/photo-1569908420024-c8f709b75700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    title: "QR Code Simplicity",
    description: "Just scan and go - no apps or registration needed",
  },
];

const features = [
  {
    icon: Wifi,
    title: "Instant Access",
    description: "Connect immediately with QR vouchers",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by Starlink satellite technology",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Safe connectivity you can trust",
  },
];

export function Landing() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    pauseOnHover: true,
    arrows: false,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -120, 0], y: [0, 120, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-600/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8 max-w-5xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative inline-block"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(20,184,166,0.3)",
                    "0 0 100px rgba(20,184,166,0.5)",
                    "0 0 60px rgba(20,184,166,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-br from-teal-400 to-teal-600 p-8 rounded-3xl"
              >
                <div className="flex items-center gap-4">
                  <Wifi size={80} className="text-white" strokeWidth={2.5} />
                  <div className="text-left">
                    <h1 className="text-6xl font-black text-white tracking-tight">
                      GIGALINK
                    </h1>
                  </div>
                </div>
              </motion.div>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute w-2 h-2 bg-teal-400 rounded-full"
                  style={{
                    top: `${Math.sin((i / 8) * Math.PI * 2) * 120 + 50}%`,
                    left: `${Math.cos((i / 8) * Math.PI * 2) * 120 + 50}%`,
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Instant WiFi Access,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  Anywhere You Are
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                QR-based prepaid WiFi powered by Starlink. No apps, no
                subscriptions—just scan and connect.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => router.push("/login")}
                className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-teal-500/50 hover:shadow-xl hover:shadow-teal-500/60 flex items-center gap-2"
              >
                Get Started
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold text-lg transition-all border border-white/20"
              >
                Learn More
              </button>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <ChevronDown size={32} className="text-teal-400" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Why Choose GigaLink?</h2>
              <p className="text-slate-400 text-lg">
                Fast, secure, and incredibly simple
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group"
                >
                  <div className="w-16 h-16 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/30 transition-colors">
                    <feature.icon size={32} className="text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                See GigaLink in Action
              </h2>
              <p className="text-slate-400 text-lg">
                Experience the future of connectivity
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="carousel-container rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/20 border border-teal-500/30"
            >
              <Slider {...sliderSettings}>
                {carouselImages.map((image, index) => (
                  <div key={index}>
                    <div className="relative h-[500px] overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-12">
                        <h3 className="text-3xl font-bold mb-3 text-white">
                          {image.title}
                        </h3>
                        <p className="text-xl text-slate-300">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400 text-lg">
                Get quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn(
                    "bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all",
                    openFAQ === faq.id
                      ? "border-teal-500 shadow-lg shadow-teal-500/20"
                      : "border-white/10 hover:border-white/20",
                  )}
                >
                  <button
                    onClick={() =>
                      setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm transition-colors shrink-0",
                          openFAQ === faq.id
                            ? "bg-teal-500 text-white"
                            : "bg-teal-500/20 text-teal-400",
                        )}
                      >
                        {faq.id}
                      </div>
                      <h3 className="font-semibold text-lg text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown
                        size={24}
                        className={cn(
                          "transition-colors",
                          openFAQ === faq.id
                            ? "text-teal-400"
                            : "text-slate-500",
                        )}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-20">
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-slate-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <button
                onClick={() => router.push("/faqs")}
                className="group px-8 py-4 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-xl font-semibold transition-all inline-flex items-center gap-2"
              >
                View All FAQs
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
            </motion.div>
          </div>
        </section>

        {/* CTA
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-500/30 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Connected?</h2>
            <p className="text-xl text-slate-300 mb-8">Join thousands already enjoying fast, reliable WiFi access</p>
            <button
              onClick={() => router.push("/login")}
              className="px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-xl font-bold text-xl transition-all shadow-2xl shadow-teal-500/50 hover:shadow-teal-500/70 hover:scale-105"
            >
              Access Vendor Portal
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-slate-400">
            <p>
              &copy; 2026 GigaLink by ComClark. Powered by Starlink. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        .carousel-container .slick-dots { bottom: 20px; }
        .carousel-container .slick-dots li button:before { color: white; opacity: 0.5; font-size: 12px; }
        .carousel-container .slick-dots li.slick-active button:before { color: #14B8A6; opacity: 1; }
      `}</style>
    </div>
  );
}
