'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { DollarSign, PieChart, Filter, Download, HelpCircle, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import './page.css'

interface InstructionCard {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`bg-white p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

export default function Instructions() {
  const router = useRouter()
  const pathname = usePathname()

  const instructionCards: InstructionCard[] = [
    {
      icon: <DollarSign className="w-6 h-6 text-indigo-600" />,
      title: "Add Transactions",
      content: (
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Click the "Add Transaction" button</li>
          <li>Choose income or expense</li>
          <li>Enter amount and select category</li>
          <li>Add description and date</li>
          <li>Click "Add Transaction" to save</li>
        </ol>
      )
    },
    {
      icon: <PieChart className="w-6 h-6 text-indigo-600" />,
      title: "View Financial Overview",
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>See total balance at the top</li>
          <li>View income and expenses breakdown</li>
          <li>Analyze spending patterns with the pie chart</li>
          <li>Scroll down for detailed transaction list</li>
        </ul>
      )
    },
    {
      icon: <Filter className="w-6 h-6 text-indigo-600" />,
      title: "Filter and Search",
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Use the search bar to find specific transactions</li>
          <li>Filter by income or expense type</li>
          <li>Select date ranges to view specific periods</li>
          <li>Combine filters for detailed analysis</li>
        </ul>
      )
    },
    {
      icon: <Download className="w-6 h-6 text-indigo-600" />,
      title: "Export Data",
      content: (
        <>
          <p className="mb-2 text-gray-600">Export your financial data easily:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Click "Export to PDF" for a detailed report</li>
            <li>Use "Export to CSV" for spreadsheet analysis</li>
            <li>All current filters will be applied to exports</li>
          </ul>
        </>
      )
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-indigo-600" />,
      title: "Get Help",
      content: (
        <>
          <p className="mb-2 text-gray-600">Need assistance? We're here to help:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Check our FAQ section for quick answers</li>
            <li>Email support at help@studentfinance.com</li>
            <li>Live chat available 9 AM - 5 PM weekdays</li>
          </ul>
        </>
      )
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: "Correlation To Prompt",
      content: (
        <>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Generate reports to track financial progress over time</li>
            <li>Categorize expenses to spot savings opportunities</li>
            <li>Understand your overall financial health trends</li>
          </ul>
        </>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white no-scroll">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nexus</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" className={`transition-all duration-300 ${pathname === "/dashboard" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"}`} onClick={() => router.push("/dashboard")}>Dashboard</Button>
              <Button variant="ghost" className={`transition-all duration-300 ${pathname === "/budgeting-tips" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"}`} onClick={() => router.push("/budgeting-tips")}>Budgeting Tips</Button>
              <Button variant="ghost" className={`transition-all duration-300 ${pathname === "/instructions" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"}`} onClick={() => router.push("/instructions")}>Instructions</Button>
            </nav>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/');
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            How to Use Student Finance Manager
          </motion.h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {instructionCards.map((card, index) => (
              <Card key={index}>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  {card.icon}
                  <span className="ml-2">{card.title}</span>
                </h2>
                {card.content}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}