// Enable React's strict mode for the component
'use client'

// Import necessary modules and components
import React, { useState, useEffect } from "react" // Import React and hooks for state and lifecycle management
import { useRouter } from "next/navigation" // Import useRouter for navigation
import { motion, AnimatePresence } from "framer-motion" // Import animation library for smooth transitions
import { Button } from "@/components/ui/Button" // Import custom Button component
import { ExternalLink, Menu, X } from "lucide-react" // Import icons from Lucide React

// Define a reusable Card component for displaying content with animations
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    // Define the card's style and animation properties
    className={`bg-white p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
    whileHover={{ scale: 1.05 }} // Scale card slightly on hover
    initial={{ opacity: 0, y: 20 }} // Initial animation state
    animate={{ opacity: 1, y: 0 }} // Final animation state
    transition={{ duration: 0.5 }} // Animation duration
  >
    {children} 
    {/* // Render child components inside the card */}
  </motion.div>
)

// Define a reusable ResourceLink component for displaying resource links
const ResourceLink = ({ title, description, link }: { title: string; description: string; link: string }) => (
  <Card>
    {/* Resource title */}
    <h3 className="text-lg font-semibold text-indigo-800 mb-2">{title}</h3>
    {/* Resource description */}
    <p className="text-gray-600 mb-4">{description}</p>
    {/* Button to open the resource link */}
    <Button
      variant="outline"
      size="sm"
      className="flex items-center text-indigo-600 border-indigo-600 hover:bg-indigo-50"
      onClick={() => window.open(link, "_blank")} // Open link in a new tab
    >
      Learn More <ExternalLink className="ml-2 h-4 w-4" /> {/* External link icon */}
    </Button>
  </Card>
);

// Define the main BudgetingTips component
export default function BudgetingTips() {
  const router = useRouter() // Hook for navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for mobile menu visibility
  const [isMobile, setIsMobile] = useState(false) // State to track if the screen is mobile-sized

  // Effect to handle screen resize and determine if it's mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Update state based on window width
    }
    checkIsMobile() // Initial check on component mount
    window.addEventListener('resize', checkIsMobile) // Listen to window resize events
    return () => window.removeEventListener('resize', checkIsMobile) // Cleanup event listener on component unmount
  }, [])

  // Define resources for the page
  const resources = [
    {
      title: "Building a Student Budget",
      description: "Learn the basics of creating a student-friendly budget to manage expenses for school and personal needs.",
      link: "https://www.getcopper.com/guide/budgeting",
    },
    {
      title: "Saving Tips for Students",
      description: "Explore practical ways to save money as a student.",
      link: "https://www.bankrate.com/banking/savings/how-to-save-money-as-high-school-student/",
    },
    {
      title: "How to Start a Student Emergency Fund",
      description: "Find out why an emergency fund is helpful for unexpected costs, even on a student budget.",
      link: "https://current.com/blog/why-does-a-student-need-an-emergency-fund/",
    },
  ]

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    router.push('/'); // Navigate to the home page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header section */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nexus</h1>
              <img src="/Nexus.png" alt="Nexus Logo" className="h-12 ml-3" />
            </div>
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8 justify-center w-full">
              <div className="flex flex-grow justify-center space-x-8">
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => router.push("/budgeting-tips")}>Budgeting Tips</Button>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/instructions")}>Instructions</Button>
              </div>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ml-auto"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </nav>
            {/* Mobile navigation toggle */}
            {isMobile && (
              <div className="md:hidden">
                <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
            >
              <div className="p-4">
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)} className="mb-4">
                  <X className="h-6 w-6" />
                </Button>
                <div className="flex flex-col space-y-4">
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => { router.push("/dashboard"); setIsMenuOpen(false); }}>Dashboard</Button>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => { router.push("/budgeting-tips"); setIsMenuOpen(false); }}>Budgeting Tips</Button>
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => { router.push("/instructions"); setIsMenuOpen(false); }}>Instructions</Button>
                  <Button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main content */}
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
            {/* Main chatbot section */}
            <motion.div
              className="lg:w-2/3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">Ask Our Finance Expert</h3>
                {/* Embedded chatbot */}
                <iframe
                  title="Finance Expert Chatbot"
                  src="https://www.chatbase.co/chatbot-iframe/twKXHAVsHvTUTt2iPXnja"
                  width="100%"
                  style={{ height: "600px", minHeight: "600px" }}
                  frameBorder="0"
                />
              </Card>
            </motion.div>
            {/* Resource links */}
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
