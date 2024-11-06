'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ExternalLink } from "lucide-react"

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

const ResourceLink = ({ title, description, link }: { title: string; description: string; link: string }) => (
  <Card>
    <h3 className="text-lg font-semibold text-indigo-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Button
      variant="outline"
      size="sm"
      className="flex items-center text-indigo-600 border-indigo-600 hover:bg-indigo-50"
      onClick={() => window.open(link, "_blank")}
    >
      Learn More <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

export default function BudgetingTips() {
  const router = useRouter()

  const resources = [
    {
      title: "Building a Student Budget",
      description: "Learn the basics of creating a student-friendly budget to manage expenses for school and personal needs.",
      link: "https://www.getcopper.com/guide/budgeting",
    },
    {
      title: "Saving Tips for Students",
      description: "Explore practical ways to save money as a student, from groceries to textbooks.",
      link: "https://www.bankrate.com/banking/savings/how-to-save-money-as-high-school-student/",
    },
    {
      title: "How to Start a Student Emergency Fund",
      description: "Find out why an emergency fund is helpful for unexpected costs, even on a student budget.",
      link: "https://current.com/blog/why-does-a-student-need-an-emergency-fund/",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nexus</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/dashboard")}>Dashboard</Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => router.push("/budgeting-tips")}>Budgeting Tips</Button>
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/instructions")}>Instructions</Button>
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
            Budgeting Tips & Resources
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="lg:w-2/3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">Ask Our Finance Expert</h3>
                <iframe
                  title="Finance Expert Chatbot"
                  src="https://www.chatbase.co/chatbot-iframe/twKXHAVsHvTUTt2iPXnja"
                  width="100%"
                  style={{ height: "600px", minHeight: "600px" }}
                  frameBorder="0"
                />
              </Card>
            </motion.div>

            <motion.div
              className="lg:w-1/3 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Additional Resources</h3>
              {resources.map((resource, index) => (
                <ResourceLink key={index} {...resource} />
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}