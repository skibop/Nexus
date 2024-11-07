'use client'

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { CreditCard, PieChart, Smartphone, BarChart2, Star, Menu, ArrowRight, ChevronRight } from "lucide-react"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';  // Try importing just the basic styles


const FeatureItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>
      <div className="mb-4 p-3 bg-indigo-100 rounded-full">
        <Icon className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const TestimonialItem = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-4">
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 italic mb-4">"{quote}"</p>
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-current" />
      ))}
    </div>
  </motion.div>
)

export default function Home() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 transform origin-left z-50"
        style={{ scaleX }}
      />
     <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : ""}`}>
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
      <div className="flex items-center"> {/* Flex container to align text and logo */}
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Nexus
        </h1>
        <img src="/Nexus.png" alt="Nexus Logo" className="h-12 w-auto ml-2 mt-1" /> {/* Added margin-top */}
      </div>
      <div className="-mr-2 -my-2 md:hidden">
        <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>
      <nav className="hidden md:flex space-x-10">
        {/* Place navigation links here */}
      </nav>
      <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
        <Button variant="ghost" className="text-base font-medium text-gray-500 hover:text-gray-900" onClick={() => router.push("/login")}>
          Log in
        </Button>
        <Button className="ml-8 bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => router.push("/signup")}>
          Sign up
        </Button>
      </div>
    </div>
  </div>
</header>
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nexus</h1>
                </div>
                <div className="-mr-2">
                  <Button variant="ghost" onClick={() => setIsMenuOpen(false)}>
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <a href="#features" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                    <span className="ml-3 text-base font-medium text-gray-900">Features</span>
                  </a>
                  <a href="#testimonials" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                    <span className="ml-3 text-base font-medium text-gray-900">Testimonials</span>
                  </a>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div>
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => router.push("/signup")}>
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
      <ContainerScroll
        titleComponent={
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-gray-900">Revolutionize Your</span>
            <span className="block text-indigo-600">Financial Future</span>
          </h2>
        }
        >
        <div className="relative w-full h-full">
          <Image
            src="/dashboard.png"
            alt="Financial Management Dashboard"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-xl"
          />
        </div>
      </ContainerScroll>
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Powerful Tools for Modern Finance
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Discover how Nexus can transform your financial management experience.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <FeatureItem
                  icon={CreditCard}
                  title="Expense Tracking"
                  description="Effortlessly categorize and analyze your spending with AI-powered insights."
                />
                <FeatureItem
                  icon={PieChart}
                  title="Advanced Analytics"
                  description="Gain deep insights into your financial health with interactive charts and predictive modeling."
                />
                <FeatureItem
                  icon={BarChart2}
                  title="Real-Time Sync"
                  description="Experience seamless updates across all your devices, ensuring your data is always current."
                />
                <FeatureItem
                  icon={Smartphone}
                  title="Mobile Optimization"
                  description="Manage your finances on-the-go with our intuitive and responsive mobile experience."
                />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-16">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What Our Users Are Saying
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <TestimonialItem
                quote="Nexus has completely changed how I think about managing my allowance and savings. It's easy to use and super helpful!"
                author="Alex M."
                role="High School Junior"
              />
              <TestimonialItem
                quote="The budgeting tools and simple charts helped me keep track of my spending for the first time. Now I can save for things I really want!"
                author="Jordan L."
                role="Sophomore"
              />
              <TestimonialItem
                quote="As a high school senior, Nexus has made it easy to prepare financially for college. I feel a lot more confident about managing money now."
                author="Taylor R."
                role="Senior"
              />
            </div>
          </div>
        </section>
        <section className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-indigo-200">Start tracking your expenses today.</span>
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
              onClick={() => router.push("/signup")}
            >
              Get started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-indigo-600 text-indigo-600 bg-indigo-50 transition-colors duration-300"
              onClick={() => router.push("/mission")}
            >
              Learn More
            </Button>
          </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}