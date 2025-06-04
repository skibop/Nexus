'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, PieChart, Filter, Download, HelpCircle, TrendingUp, 
  Menu, X, Wallet, ChevronRight, User, LogOut, Plus, Search, 
  FileText, Lightbulb, Target, ArrowUpRight
} from 'lucide-react'
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface InstructionCard {
  icon: React.ReactNode
  title: string
  content: React.ReactNode
  gradient: string
}

export default function Instructions() {
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
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <PieChart className="w-6 h-6 text-white" />,
      title: "View Financial Overview",
      content: (
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm">
          <li>See total balance at the top</li>
          <li>View income and expenses breakdown</li>
          <li>Analyze spending patterns with charts</li>
          <li>Track your savings rate</li>
        </ul>
      ),
      gradient: "from-green-500 to-emerald-600"
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
        </ul>
      ),
      gradient: "from-blue-500 to-cyan-600"
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
      gradient: "from-amber-500 to-orange-600"
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
      gradient: "from-rose-500 to-pink-600"
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
      gradient: "from-purple-500 to-violet-600"
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
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => router.push("/budgeting-tips")}
                >
                  Budgeting Tips
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  onClick={() => router.push("/instructions")}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>Instructions</span>
                  </div>
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
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Budgeting Tips
                    </button>
                    <button
                      onClick={() => { router.push("/instructions"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-3 text-left rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
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
              How to Use <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Nexus</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Master your finances with these simple steps</p>
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
                      <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                        {card.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {card.content}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}