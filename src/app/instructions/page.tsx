"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  PieChart,
  Search,
  FileText,
  Lightbulb,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar_temp";

interface InstructionCard {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  gradient: string;
}

export default function Instructions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      title: "Correlation to Prompt",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>Monitor savings rate</li>
          <li>Analyze cash flow trends</li>
          <li>Compare financial performance</li>
          <li>Achieve financial freedom & milestones</li>
        </ul>
      ),
      gradient: "from-purple-500 to-violet-600",
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

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
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
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-slate-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
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
