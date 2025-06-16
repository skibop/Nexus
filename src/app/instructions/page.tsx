"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  PieChart,
  Filter,
  Download,
  HelpCircle,
  TrendingUp,
  Menu,
  X,
  Wallet,
  ChevronRight,
  User,
  LogOut,
  Plus,
  Search,
  FileText,
  Lightbulb,
  Target,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InstructionCard {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  gradient: string;
}

export default function Instructions() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const instructionCards: InstructionCard[] = [
    {
      icon: <Plus className="w-6 h-6 text-white" />,
      title: "Add Transactions",
      content: (
        <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Click the "Add Transaction" button</li>
          <li>Choose income or expense</li>
          <li>Enter amount and select category</li>
          <li>Add description and date</li>
          <li>Click "Add Transaction" to save</li>
        </ol>
      ),
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <PieChart className="w-6 h-6 text-white" />,
      title: "View Financial Overview",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>See total balance at the top</li>
          <li>View income and expenses breakdown</li>
          <li>Analyze spending patterns with charts</li>
          <li>Track your savings rate & budget</li>
          <li>View your financial health score</li>
        </ul>
      ),
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Filter and Search",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Use the search bar to find transactions</li>
          <li>Filter by income or expense type</li>
          <li>Select custom date ranges</li>
          <li>Sort by date, amount, or category</li>
          <li>View your updated filtered portfolio</li>
        </ul>
      ),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Export Data",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Export to PDF for reports</li>
          <li>Export to CSV for spreadsheets</li>
          <li>Choose specific date ranges</li>
          <li>Select transaction types to export</li>
        </ul>
      ),
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Money Saving Tips",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Get personalized recommendations</li>
          <li>Track spending patterns</li>
          <li>Set budget goals</li>
          <li>Monitor your progress</li>
        </ul>
      ),
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Track Your Goals",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Monitor savings rate</li>
          <li>Analyze cash flow trends</li>
          <li>Compare monthly performance</li>
          <li>Achieve financial milestones</li>
        </ul>
      ),
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#00674F] shadow-2xl z-50 flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/20">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Nexus
              </h1>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="font-medium">Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/budgeting-tips")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="font-medium">Budgeting Tips</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/instructions")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/20 text-white transition-all duration-200 group"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-medium">Instructions</span>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </motion.button>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/20">
            <motion.div
              initial={false}
              animate={{ height: showUserMenu ? "auto" : "48px" }}
              className="overflow-hidden"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-medium">Account</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-transform ${
                    showUserMenu ? "rotate-90" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 px-4"
                  >
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </aside>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-[60] p-3 bg-[#01af5b] rounded-xl shadow-lg md:hidden"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-[55] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.aside
                className="fixed left-0 top-0 h-full w-72 bg-[#01af5b] shadow-2xl z-[56] md:hidden flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
              >
                {/* Logo Section */}
                <div className="p-6 border-b border-white/20">
                  <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                      Nexus
                    </h1>
                  </motion.div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push("/budgeting-tips");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Budgeting Tips</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push("/instructions");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/20 text-white transition-all duration-200 group"
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Instructions</span>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </motion.button>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      router.push("/");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64">
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
                How to Use{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Nexus
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Master your finances with these simple steps
              </p>
            </motion.div>

            {/* Instruction Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructionCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-center space-x-4 mb-2">
                        <div
                          className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {card.icon}
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                          {card.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>{card.content}</CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}