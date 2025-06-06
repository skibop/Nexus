"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Menu,
  ArrowRight,
  Star,
  X,
  CodeXml,
  Book,
  CircleCheckBig,
  Sparkles,
  Zap,
  Shield,
  Wallet,
} from "lucide-react";

const FeatureItem = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 50, rotateX: -15 }
      }
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-70"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="relative flex flex-col items-center p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px] overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="mb-6 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg"
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            scale: 1.1,
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-center leading-relaxed">
          {description}
        </p>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const FloatingOrb = ({
  delay,
  size,
  color,
  initialX,
  initialY,
}: {
  delay: number;
  size: string;
  color: string;
  initialX: number;
  initialY: number;
}) => {
  return (
    <motion.div
      className={`absolute ${size} rounded-full ${color} blur-3xl opacity-20`}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
    />
  );
};

// Pre-generated particle positions for SSR consistency
const particlePositions = [
  { x: 10, y: 20 },
  { x: 80, y: 15 },
  { x: 25, y: 60 },
  { x: 70, y: 40 },
  { x: 45, y: 80 },
  { x: 90, y: 70 },
  { x: 15, y: 45 },
  { x: 60, y: 25 },
  { x: 35, y: 90 },
  { x: 85, y: 35 },
  { x: 5, y: 75 },
  { x: 65, y: 55 },
  { x: 40, y: 10 },
  { x: 75, y: 85 },
  { x: 20, y: 65 },
  { x: 95, y: 50 },
  { x: 30, y: 30 },
  { x: 55, y: 70 },
  { x: 50, y: 5 },
  { x: 12, y: 88 },
];

export default function MissionPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background elements */}
        <FloatingOrb
          delay={0}
          size="w-96 h-96"
          color="bg-green-400"
          initialX={20}
          initialY={30}
        />
        <FloatingOrb
          delay={5}
          size="w-72 h-72"
          color="bg-emerald-400"
          initialX={70}
          initialY={60}
        />
        <FloatingOrb
          delay={10}
          size="w-64 h-64"
          color="bg-green-300"
          initialX={45}
          initialY={10}
        />

        {/* Interactive cursor glow - only render after mount */}
        {isMounted && (
          <motion.div
            className="fixed w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 pointer-events-none"
            animate={{
              x: mousePosition.x - 128,
              y: mousePosition.y - 128,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
        )}

        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Nexus
                  </h1>
                </motion.div>
              </div>
              <div className="-mr-2 -my-2 md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="ml-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between px-5"
                    onClick={() => router.push("/signup")}
                  >
                    <div className="flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign up
                    </div>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween" }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-green-600">Menu</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <nav className="space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("#mission");
                        setIsMenuOpen(false);
                      }}
                    >
                      Our Mission
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("#values");
                        setIsMenuOpen(false);
                      }}
                    >
                      Our Values
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                      onClick={() => {
                        router.push("/signup");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign up
                    </Button>
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-20">
          <section id="mission" className="py-32 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "400% 400%",
              }}
            />

            {/* Animated particles - only render after mount with fixed positions */}
            {isMounted &&
              particlePositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{
                    x: `${pos.x}vw`,
                    y: `${pos.y}vh`,
                  }}
                  animate={{
                    y: [null, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: (i % 5) + 5, // Varies between 5-9 seconds
                    repeat: Infinity,
                    delay: i % 5, // Varies delay between 0-4 seconds
                  }}
                />
              ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 50 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="inline-block mb-6"
                >
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold">
                    <Zap className="inline w-4 h-4 mr-2" />
                    Revolutionizing Finance
                  </span>
                </motion.div>

                <motion.h1
                  className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl text-white mb-8"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="block">Our Mission</span>
                  <motion.span
                    className="block text-green-200 mt-2"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255,255,255,0)",
                        "0 0 30px rgba(255,255,255,0.5)",
                        "0 0 20px rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    is Your Success
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="mt-6 max-w-3xl mx-auto text-xl text-white/90 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  At Nexus, we're committed to revolutionizing financial
                  management for the next generation. Our mission is to empower
                  individuals with the tools and knowledge they need to secure
                  their financial future.
                </motion.p>

                <motion.div
                  className="mt-10 flex justify-center gap-4 relative z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-transparent text-green-600 border-2 border-white hover:bg-white-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between px-6 relative z-30"
                      onClick={() => router.push("/signup")}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent text-white border-2 border-white hover:bg-white/10 hover:border-white/50 relative z-30"
                      onClick={() => scrollToSection("values")}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-16 relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 50,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-3xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/Nexus.png"
                    alt="Nexus Logo"
                    width={320}
                    height={320}
                    className="mx-auto rounded-full bg-white p-3 shadow-2xl relative z-10"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section
            id="values"
            className="py-32 bg-white relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="inline-block mb-4"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-semibold">
                    <Shield className="inline w-4 h-4 mr-2" />
                    Core Values
                  </span>
                </motion.div>

                <h2 className="text-base text-green-600 font-bold tracking-wide uppercase mb-4">
                  Our Values
                </h2>
                <p className="mt-2 text-4xl leading-tight font-black tracking-tight text-gray-900 sm:text-5xl">
                  Guiding Principles for a{" "}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Brighter Financial Future
                  </span>
                </p>
              </motion.div>

              <div className="mt-24">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  <FeatureItem
                    icon={CodeXml}
                    title="Innovation"
                    description="Constantly pushing the boundaries of financial technology to provide cutting-edge solutions that transform how you manage money."
                    delay={0.1}
                  />
                  <FeatureItem
                    icon={Book}
                    title="Education"
                    description="Empowering users with the knowledge and skills to make informed financial decisions through interactive learning experiences."
                    delay={0.2}
                  />
                  <FeatureItem
                    icon={CircleCheckBig}
                    title="Accessibility"
                    description="Making advanced financial tools and insights available to everyone, regardless of their background or experience level. Committed to providing for all!"
                    delay={0.3}
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="cta" className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-700 to-green-800"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />

            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8 relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                viewport={{ once: true }}
              >
                <motion.h2
                  className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="block">Ready to join our mission?</span>
                  <motion.span
                    className="block text-green-200 mt-3"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Start your journey to financial empowerment today.
                  </motion.span>
                </motion.h2>

                <motion.div
                  className="mt-10 flex justify-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white rounded-lg blur-lg opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <Button
                      size="lg"
                      className="relative bg-gray text-green-700 font-bold shadow-2xl px-8 py-6 text-lg flex items-center justify-between w-full max-w-xs"
                      onClick={() => router.push("/signup")}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <span>Get Started Now</span>
                      </div>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.p
                  className="mt-8 text-green-100 text-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Join thousands who are already transforming their financial
                  future
                </motion.p>
              </motion.div>
            </div>
          </section>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
