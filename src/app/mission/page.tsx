'use client'

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Menu, ArrowRight, Star } from "lucide-react"

const FeatureItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>
      <motion.div 
        className="mb-4 p-3 bg-indigo-100 rounded-full"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-8 h-8 text-indigo-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  )
}

export default function MissionPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : ""}`}>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
              <div className="flex justify-start">
                <Link href="/">
                  <span className="sr-only">Nexus</span>
                  <motion.h1 
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Nexus
                  </motion.h1>
                </Link>
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

        <main className="pt-20">
          <section className="py-24 bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                  Our Mission
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl">
                  At Nexus, we're committed to revolutionizing financial management for the next generation. Our mission is to empower individuals with the tools and knowledge they need to secure their financial future.
                </p>
              </motion.div>
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Image
                  src="/Nexus.png"
                  alt="Nexus Logo"
                  width={280}
                  height={280}
                  className="mx-auto rounded-full bg-white p-2"
                />
              </motion.div>
            </div>
          </section>

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="lg:text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Values</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Guiding Principles for a Brighter Financial Future
                </p>
              </motion.div>

              <div className="mt-20">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <FeatureItem
                    icon={ArrowRight}
                    title="Innovation"
                    description="Constantly pushing the boundaries of financial technology to provide cutting-edge solutions."
                  />
                  <FeatureItem
                    icon={ArrowRight}
                    title="Education"
                    description="Empowering users with the knowledge and skills to make informed financial decisions."
                  />
                  <FeatureItem
                    icon={ArrowRight}
                    title="Accessibility"
                    description="Making advanced financial tools and insights available to everyone, regardless of their background."
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-indigo-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <motion.h2 
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="block">Ready to join our mission?</span>
                <span className="block text-indigo-200">Start your journey to financial empowerment today.</span>
              </motion.h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <motion.div 
                  className="inline-flex rounded-md shadow"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-indigo-600 hover:bg-indigo-50"
                    onClick={() => router.push("/signup")}
                  >
                    Get started
                    <motion.span
                      className="ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
      </motion.div>
    </AnimatePresence>
  )
}