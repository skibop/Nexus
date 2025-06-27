"use client";;
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useSpring, useInView } from "framer-motion"; // Transition library
import { Button } from "@/components/ui/Button";
import {
  CreditCard,
  PieChart,
  Smartphone,
  BarChart2,
  Star,
  Menu,
  ArrowRight,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Wallet,
} from "lucide-react"; // Icons
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import "swiper/css"; // Transitions with modern touch sliders with hardware-accelerated transitions

const FeatureItem = ({
  icon: Icon,
  title,
  description,
}: { // Typescript requires the additional type-safe objects
  icon: React.ElementType; 
  title: string;
  description: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    // Motion transition
    <motion.div
      ref={ref}
      className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:bg-white/90"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl"></div>
      <div className="relative mb-6 p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-700 transition-colors duration-300">
        {/* Lets you loop through the title and then description below later */}
        {title}
      </h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </motion.div>
  );
};

const TestimonialItem = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <motion.div
    className="group bg-gradient-to-br from-white to-green-50/50 p-8 rounded-2xl shadow-lg border border-green-100 transition-all duration-500 hover:shadow-2xl hover:scale-105 relative overflow-hidden"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
            {author.charAt(0)}
          </span>
        </div>
        <div> 
          {/* // Same concept as above, loop through the quote, author, and role */}
          <p className="font-bold text-gray-900 text-lg">{author}</p>
          <p className="text-sm text-green-600 font-medium">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">
        "{quote}"
      </p>
      <div className="flex text-yellow-400">
        {/* Generate array of 5 stars and map each to a Star component */}
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-current drop-shadow-sm" />
          // There is a unique key for React's reconciliation
        ))}
      </div>
    </div>
  </motion.div>
);

const StatItem = ({ number, label }: { number: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    // More transition stuff and continue to loop through number & label
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {number}
      </div>
      <div className="text-green-200 text-lg">{label}</div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // This is the stuff that handles the top bar of the page as well as scroll dynamics and transitions
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform origin-left z-50"
        style={{ scaleX }}
      />
      {/* Transparent header as you scroll down --> creates a more professional look */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
      {/* Some other header stuff for the corporate look.  */}
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
      {/* The Mobile Interface */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto border-l border-green-100"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                  Nexus
                </h1>
                <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:bg-green-50"
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
              <nav className="space-y-6">
                <a
                  href="#features"
                  className="block text-lg font-medium text-gray-900 hover:text-green-600 transition-colors duration-300 p-3 rounded-lg hover:bg-green-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block text-lg font-medium text-gray-900 hover:text-green-600 transition-colors duration-300 p-3 rounded-lg hover:bg-green-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
              </nav>
              <div className="mt-8">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    router.push("/signup");
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Our Hero Section with the Container Scroll Animation */}
      <main>
        <ContainerScroll
          titleComponent={
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              ></motion.div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block text-gray-900">Revolutionize Your</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
                  Financial Future
                </span>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed"
              ></motion.p>
            </div>
          }
        >
          <div className="relative w-full h-full">
            <Image
              src="/dash2.png"
              alt="Financial Management Dashboard"
              fill
              style={{ objectFit: "fill" }}
              className="rounded-2xl shadow-2xl border-4 border-white"
            />
          </div>
        </ContainerScroll>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem number="5,000+" label="Happy Users" />
              <StatItem number="99.9%" label="Uptime" />
              <StatItem number="4.9★" label="App Rating" />
              <StatItem number="24/7" label="Support" />
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          className="py-32 bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="lg:text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6 shadow-lg">
                <Zap className="w-4 h-4 mr-2" />
                POWERFUL FEATURES
              </span>
              <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
                Built for the
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
                  Modern Era
                </span>
              </h2>
              <p className="max-w-3xl text-xl text-gray-600 lg:mx-auto leading-relaxed">
                Discover cutting-edge tools designed to transform your financial
                journey with intelligence, security, and style.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureItem
                icon={CreditCard}
                title="Smart Tracking"
                description="AI-powered expense categorization that learns your spending patterns and provides intelligent insights."
              />
              <FeatureItem
                icon={PieChart}
                title="Predictive Analytics"
                description="Advanced forecasting models that help you plan for the future and optimize your financial decisions."
              />
              <FeatureItem
                icon={BarChart2}
                title="Real-Time Sync"
                description="Lightning-fast synchronization across all devices with military-grade security and reliability."
              />
              <FeatureItem
                icon={Smartphone}
                title="Mobile-First Design"
                description="Beautifully crafted mobile experience that makes managing finances feel effortless and enjoyable."
              />
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="py-32 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-300 rounded-full animate-ping delay-500"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 mb-6 shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                SUCCESS STORIES
              </span>
              <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                Loved by
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                  {" "}
                  Thousands
                </span>
              </h2>
              <p className="max-w-3xl text-xl text-green-100 mx-auto leading-relaxed">
                Join the community of students who've transformed their
                financial future with Nexus.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <TestimonialItem
                quote="Nexus completely revolutionized how I manage my money. The AI and money saving reccomendations helped me save $2,000 for college in just 6 months!"
                author="Alex M."
                role="High School Senior"
              />
              <TestimonialItem
                quote="The interface is stunning and so intuitive. I actually look forward to checking my finances now - it's like a game!"
                author="Jordan L."
                role="High School Sophomore"
              />
              <TestimonialItem
                quote="Thanks to Nexus, I was able to understand my finances faster than ever. The budgeting tools are incredible!"
                author="Taylor R."
                role="High School Freshman"
              />
            </div>
          </div>
        </section>
        {/* Call to Action Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full transform translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-24 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                Ready to Transform
                <span className="block text-green-200">
                  Your Financial Life?
                </span>
              </h2>
              <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who've already discovered the power
                of intelligent financial management.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-white text-green-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 font-bold text-lg px-12 py-4 rounded-2xl flex items-center justify-center"
                  onClick={() => router.push("/signup")}
                >
                  <span className="mr-3">Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>

                <Button
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-white bg-transparent text-green-600  shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 font-bold text-lg px-12 py-4 rounded-2xl flex items-center justify-center"
                  onClick={() => router.push("/mission")}
                >
                  <span className="mr-3">Discover More</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>

              <motion.div
                className="mt-16 flex justify-center items-center space-x-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center text-green-200">
                  <Shield className="w-6 h-6 mr-2" />
                  <span className="font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center text-green-200">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  <span className="font-medium">Proven Results</span>
                </div>
                <div className="hidden sm:flex items-center text-green-200">
                  <Sparkles className="w-6 h-6 mr-2" />
                  <span className="font-medium">AI-Powered</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
