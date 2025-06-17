"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  BookOpen,
  Shield,
  MessageSquare,
  Sparkles,
  GraduationCap,
  PiggyBank,
  Target,
  Lightbulb,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/Sidebar_temp";

interface Resource {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function BudgetingTips() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const resources: Resource[] = [
    {
      title: "Building a Student Budget",
      description:
        "Learn the basics of creating a student-friendly budget to manage expenses for school and personal needs.",
      link: "https://www.getcopper.com/guide/budgeting",
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Saving Tips for Students",
      description:
        "Explore practical ways to save money as a student and build healthy financial habits.",
      link: "https://www.bankrate.com/banking/savings/how-to-save-money-as-high-school-student/",
      icon: <PiggyBank className="w-5 h-5 text-white" />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Start an Emergency Fund",
      description:
        "Find out why an emergency fund is helpful for unexpected costs, even on a student budget.",
      link: "https://current.com/blog/why-does-a-student-need-an-emergency-fund/",
      icon: <Shield className="w-5 h-5 text-white" />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Personal Financial Literacy Modules",
      description:
        "Access comprehensive financial literacy courses designed specifically for students to master money management.",
      link: "https://www.khanacademy.org/college-careers-more/financial-literacy",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      gradient: "from-purple-500 to-indigo-600",
    },
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "AI-Powered Advice",
      description:
        "Get personalized budgeting tips from our intelligent finance assistant",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Goal Setting",
      description:
        "Set and track financial goals tailored to your student lifestyle",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Smart Insights",
      description:
        "Receive actionable insights based on your spending patterns described",
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex">
        
        {/* Sidebar Component */}
        <Sidebar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Features Popup */}
        <AnimatePresence>
          {showFeaturesPopup && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeaturesPopup(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      Platform Features
                    </h2>
                    <button
                      onClick={() => setShowFeaturesPopup(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                      >
                        <div
                          className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg flex-shrink-0`}
                        >
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="md:hidden">
                  {/* Empty space for mobile menu button */}
                </div>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      localStorage.setItem("darkMode", (!darkMode).toString());
                      if (!darkMode) {
                        document.documentElement.classList.add("dark");
                      } else {
                        document.documentElement.classList.remove("dark");
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {darkMode ? (
                      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Budgeting Tips &{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Resources
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-slate-600 dark:text-slate-400">
                  Get expert advice and discover valuable resources
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFeaturesPopup(true)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="View platform features"
                >
                  <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" />
                </motion.button>
              </div>
            </motion.div>

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
                          <div
                            className={`p-3 bg-gradient-to-br ${resource.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
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
                              onClick={() =>
                                resource.link !== "#"
                                  ? window.open(resource.link, "_blank")
                                  : null
                              }
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
    </div>
  );
}