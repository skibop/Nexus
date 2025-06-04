'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, Menu, X, Wallet, ChevronRight, User, LogOut,
  BookOpen, TrendingUp, Shield, MessageSquare, Sparkles,
  GraduationCap, PiggyBank, Target, Lightbulb
} from 'lucide-react'
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Resource {
  title: string
  description: string
  link: string
  icon: React.ReactNode
  gradient: string
}

export default function BudgetingTips() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const resources: Resource[] = [
    {
      title: "Building a Student Budget",
      description: "Learn the basics of creating a student-friendly budget to manage expenses for school and personal needs.",
      link: "https://www.getcopper.com/guide/budgeting",
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Saving Tips for Students",
      description: "Explore practical ways to save money as a student and build healthy financial habits.",
      link: "https://www.bankrate.com/banking/savings/how-to-save-money-as-high-school-student/",
      icon: <PiggyBank className="w-5 h-5 text-white" />,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Start an Emergency Fund",
      description: "Find out why an emergency fund is helpful for unexpected costs, even on a student budget.",
      link: "https://current.com/blog/why-does-a-student-need-an-emergency-fund/",
      icon: <Shield className="w-5 h-5 text-white" />,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      title: "Personal Financial Literacy Modules",
      description: "Access comprehensive financial literacy courses designed specifically for students to master money management.",
      link: "https://www.khanacademy.org/college-careers-more/financial-literacy",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      gradient: "from-purple-500 to-indigo-600"
    }
  ]

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "AI-Powered Advice",
      description: "Get personalized budgeting tips from our intelligent finance assistant",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Goal Setting",
      description: "Set and track financial goals tailored to your student lifestyle",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Smart Insights",
      description: "Receive actionable insights based on your spending patterns described",
      gradient: "from-rose-500 to-pink-600"
    }
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        
        {/* Header - Same as Dashboard */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
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

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <Button
                  variant="ghost"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  onClick={() => router.push("/budgeting-tips")}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>Budgeting Tips</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => router.push("/instructions")}
                >
                  Instructions
                </Button>
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                <div className="relative hidden md:block">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        <button 
                          onClick={() => {
                            localStorage.removeItem('token')
                            router.push('/')
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Menu</h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => { router.push("/dashboard"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { router.push("/budgeting-tips"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 text-left rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      Budgeting Tips
                    </button>
                    <button
                      onClick={() => { router.push("/instructions"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Instructions
                    </button>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          localStorage.removeItem('token')
                          router.push('/')
                          setIsMenuOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              Budgeting Tips & <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Resources</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Get expert advice and discover valuable resources</p>
          </motion.div>

          {/* Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chatbot Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" />
                    Ask Our Finance Expert
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Get personalized budgeting advice from our AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-b-xl">
                    <iframe
                      title="Finance Expert Chatbot"
                      src="https://www.chatbase.co/chatbot-iframe/twKXHAVsHvTUTt2iPXnja"
                      width="100%"
                      style={{ height: "700px", minHeight: "600px" }}
                      frameBorder="0"
                      className="bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resources Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                  Additional Resources
                </h2>
              </div>

              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 bg-gradient-to-br ${resource.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {resource.description}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 group"
                            onClick={() => resource.link !== "#" ? window.open(resource.link, "_blank") : null}
                          >
                            Learn More
                            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}              
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}