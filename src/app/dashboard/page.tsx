'use client'

// Import everything needed for the Dashboard to work
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import { TransactionForm } from '@/components/TransactionForm'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Loader2, TrendingUp, TrendingDown, Menu, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { motion, AnimatePresence } from "framer-motion"
import './page.css'
import MoneySavingRecommendations from '@/components/MoneySaver'

// Category colors for the dynamic pie charts on the beginning of the page
const categoryColors: { [key: string]: string } = {
  Job: "#450de7",
  Allowance: "#FFD166",
  Gift: "#5BC0EB",
  Chores: "#F45D48",
  Misc: "#36c147",
  Transportation: "#EF476F",
  Entertainment: "#9D4EDD",
  Clothing: "#52e1db",
  Personal: "#7C77B9",
}

// List the interfaces going to be used for transactions and filter options
interface Transaction {
  _id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string
}

interface FilterOptions {
  searchTerm: string
  dateRange: 'all' | 'custom'
  startDate: string
  endDate: string
  type: 'all' | 'income' | 'expense'
}

// Categories that people can sort their things through
const incomeCategories: string[] = ["Job", "Allowance", "Gift", "Chores", "Misc"]
const expenseCategories: string[] = ["Transportation", "Entertainment", "Clothing", "Personal", "Misc"]

const Motioncard = motion.create(Card)

// Define all of our use states 
export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly'>('weekly')
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    type: 'all',
  })

  const [showExportModal, setShowExportModal] = useState(false)
  const [exportType, setExportType] = useState<'pdf' | 'csv'>('pdf')
  const [exportContent, setExportContent] = useState<'all' | 'income' | 'expenses' | 'selected'>('all')
  const [exportDateRange, setExportDateRange] = useState<'all' | 'custom'>('all')
  const [exportStartDate, setExportStartDate] = useState<string>('')
  const [exportEndDate, setExportEndDate] = useState<string>('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  // Smooth animation question
  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])


// Our Use Effects to check if it is mobile and to see our editing transaction.
  useEffect(() => {
    if (showForm && editingTransaction) {
      scrollToForm()
    }
  }, [showForm, editingTransaction, scrollToForm])

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Function to fetch transactions
  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/transactions`, {
        headers: { 'x-auth-token': token }, // check with the token to see if it matches up
      })
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      setTransactions(data)
      setFilteredTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // format the date properly on everything
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // function for handling submitting for every function
  const handleSubmit = async (data: Omit<Transaction, '_id'>) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      if (editingTransaction) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/transaction/${editingTransaction._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
          },
          body: JSON.stringify(data)
        })
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/transaction`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
          },
          body: JSON.stringify(data)
        })
      }
      fetchTransactions()
      setShowForm(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error submitting transaction:', error)
    }
  }

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    // If all goes well --> send the DELETE method to the backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      })
      // Important because we still need to display the transactions after a deletion.
      fetchTransactions() 
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const applyFilters = () => {
    // Filter transactions based on user-defined criteria
    const filtered = transactions.filter((transaction) => {
      // Check if the transactions matches the search term (in description or category)
      const matchesSearchTerm = transaction.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                                transaction.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      // Check if the transaction type matches the second filter or if 'all' is selected
      const matchesType = filters.type === 'all' || transaction.type === filters.type
      
      // Default to true for date matching (no date filter applied)
      let matchesDate = true
      const transactionDate = new Date(transaction.date)

      // If a custom date range is selected, check if the transaction falls within the range
      if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate)
        const endDate = new Date(filters.endDate)
        matchesDate = transactionDate >= startDate && transactionDate <= endDate
      }

      // Return true only if the transaction matches all filters (search term, type, and date range)
      return matchesSearchTerm && matchesType && matchesDate
    })


    // Update the state with the filtered transaction
    setFilteredTransactions(filtered)
    // Close the filter modal after applying the filter
    setShowFilterModal(false)
  }

  // calculations for everything including income and expenses and balance
  const calculateTotalByCategory = (type: 'income' | 'expense') => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
  }

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  // generating our pie chart data 
  const generatePieChartData = (type: 'income' | 'expense') => {
    const data = calculateTotalByCategory(type)
    const categories = type === 'income' ? incomeCategories : expenseCategories
    return categories.map((category, index) => ({
      category,
      amount: data[category] || 0,
      fill: `var(--color-${type}-${index + 1})`
    }))
  }

  const incomeChartData = generatePieChartData('income')
  const expenseChartData = generatePieChartData('expense')

  const incomeChartConfig: ChartConfig = {
    amount: { label: 'Amount' },
    ...Object.fromEntries(
      incomeCategories.map((category, index) => [
        category,
        {
          label: category,
          color: `hsl(var(--chart-${index + 1}))`
        }
      ])
    )
  }

  const expenseChartConfig: ChartConfig = {
    amount: { label: 'Amount' },
    ...Object.fromEntries(
      expenseCategories.map((category, index) => [
        category,
        {
          label: category,
          color: `hsl(var(--chart-${index + 6}))`
        }
      ])
    )
  }

  // this is for our graphs for monthly and weekly
  const generateTimeSeriesData = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const data: { date: string; income: number; expenses: number }[] = []

    if (timePeriod === 'weekly') {
      sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        const weekKey = `${(weekStart.getMonth() + 1).toString().padStart(2, '0')}/${weekStart.getDate().toString().padStart(2, '0')}/${weekStart.getFullYear().toString().slice(-2)}`
        const existingEntry = data.find(entry => entry.date === weekKey)

        if (existingEntry) {
          if (transaction.type === 'income') {
            existingEntry.income += transaction.amount
          } else {
            existingEntry.expenses += transaction.amount
          }
        } else {
          data.push({
            date: weekKey,
            income: transaction.type === 'income' ? transaction.amount : 0,
            expenses: transaction.type === 'expense' ? transaction.amount : 0
          })
        }
      })
    } else {
      sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.date)
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        const existingEntry = data.find(entry => entry.date === monthKey)

        if (existingEntry) {
          if (transaction.type === 'income') {
            existingEntry.income += transaction.amount
          } else {
            existingEntry.expenses += transaction.amount
          }
        } else {
          data.push({
            date: monthKey,
            income: transaction.type === 'income' ? transaction.amount : 0,
            expenses: transaction.type === 'expense' ? transaction.amount : 0
          })
        }
      })
    }

    return data
  }

  const timeSeriesData = generateTimeSeriesData()

  // function for handling the exports to PDF or CSV
  const handleExport = () => {
    let dataToExport = transactions

    if (exportContent === 'selected') {
      dataToExport = filteredTransactions
    } else if (exportContent !== 'all') {
      dataToExport = dataToExport.filter(t => t.type === (exportContent === 'income' ? 'income' : 'expense'))
    }

    if (exportDateRange === 'custom' && exportStartDate && exportEndDate) {
      dataToExport = dataToExport.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= new Date(exportStartDate) && transactionDate <= new Date(exportEndDate)
      })
    }

    if (exportType === 'pdf') {
      exportToPDF(dataToExport)
    } else {
      exportToCSV(dataToExport)
    }

    setShowExportModal(false)
  }

  const exportToPDF = (data: Transaction[]) => {
    // Initalize a new jsPDF document
    const doc = new jsPDF()
    doc.text('Transaction Report', 20, 10)
    
    // Add a title to the PDF documnet
    const tableData = data.map(t => [
      formatDate(t.date),   // Format the date of the transaction 
      t.type,               // Include the type of the transaction (e.g., income, expense)
      t.category,           // Include the category of the transaction
      t.description,        // Add a brief description of the transcraption
      `$${t.amount.toFixed(2)}` // Format the amount as a currency string
    ])

    // Generate a table in the PDF document using the autoTable plugin
    ;(doc as any).autoTable({
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']], // Table headers
      body: tableData, // Table Content
    })

    // Save the PDF with a default filename
    doc.save('transaction_report.pdf')
  }

  const exportToCSV = (data: Transaction[]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Type,Category,Description,Amount\n"
      + data.map(t => 
          `${formatDate(t.date)},${t.type},${t.category},"${t.description}",$${t.amount.toFixed(2)}`
        ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "transaction_report.csv")
    document.body.appendChild(link)
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div id="rotate-message"> 
        <p>Please rotate your device to landscape mode for the best experience.</p>
      </div>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Nexus</h1>
              <img src="/Nexus.png" alt="Nexus Logo" className="h-12 ml-3" />
            </div>
            <nav className="hidden md:flex flex-grow justify-center">
              <div className="flex space-x-8">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/budgeting-tips")}>Budgeting Tips</Button>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => router.push("/instructions")}>Instructions</Button>
              </div>
            </nav>
            <div className="hidden md:block">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/')
                }}
              >
                Log Out
              </Button>
            </div>
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
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => { router.push("/dashboard"); setIsMenuOpen(false); }}>Dashboard</Button>
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => { router.push("/budgeting-tips"); setIsMenuOpen(false); }}>Budgeting Tips</Button>
                  <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-all duration-300" onClick={() => { router.push("/instructions"); setIsMenuOpen(false); }}>Instructions</Button>
                  <Button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    onClick={() => {
                      localStorage.removeItem('token')
                      router.push('/')
                      setIsMenuOpen(false)
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-2 bg-indigo-600"></div>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">${totalBalance.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-2 bg-green-600"></div>
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-2 bg-red-600"></div>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Income Breakdown</CardTitle>
              <CardDescription>Current Period</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={incomeChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={incomeChartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                  >
                    {incomeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#8884d8"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Total Income: ${totalIncome.toFixed(2)} <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Current Period</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={expenseChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={expenseChartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#8884d8"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Total Expenses: ${totalExpenses.toFixed(2)} <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Income and Expenses Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => setTimePeriod('weekly')}
                variant={timePeriod === 'weekly' ? 'default' : 'outline'}
                className={`${
                  timePeriod === 'weekly' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-black'
                } hover:from-indigo-700 hover:to-purple-700 transition-all duration-300`}
              >
                Weekly
              </Button>
              <Button
                onClick={() => setTimePeriod('monthly')}
                variant={timePeriod === 'monthly' ? 'default' : 'outline'}
                className={`${
                  timePeriod === 'monthly' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-200 text-black'
                } hover:from-indigo-700 hover:to-purple-700 transition-all duration-300`}
              >
                Monthly
              </Button>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#F44336" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <MoneySavingRecommendations />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Transactions
              {filters.type !== 'all' && ` - ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}`}
              {filters.searchTerm && ` - "${filters.searchTerm}"`}
              {filters.dateRange === 'custom' && filters.startDate && filters.endDate && 
                ` - ${formatDate(filters.startDate)} to ${formatDate(filters.endDate)}`
              }
            </CardTitle>
            <div className="space-x-2">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowFilterModal(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
              >
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showForm && (
              <div ref={formRef}>
                <TransactionForm
                  onSubmit={handleSubmit}
                  initialValues={editingTransaction || undefined}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingTransaction(null)
                  }}
                  incomeCategories={incomeCategories}
                  expenseCategories={expenseCategories}
                />
              </div>
            )}
            {showFilterModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="filter-modal">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Filter Transactions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters({...filters, type: e.target.value as 'all' | 'income' | 'expense'})}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">All Transactions</option>
                          <option value="income">Income Only</option>
                          <option value="expense">Expenses Only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date Range</label>
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio"
                              name="dateRange"
                              value="all"
                              checked={filters.dateRange === 'all'}
                              onChange={() => setFilters({ ...filters, dateRange: 'all' })}
                            />
                            <span className="ml-2">All Dates</span>
                          </label>
                          <br />
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio"
                              name="dateRange"
                              value="custom"
                              checked={filters.dateRange === 'custom'}
                              onChange={() => setFilters({ ...filters, dateRange: 'custom' })}
                            />
                            <span className="ml-2">Custom Range</span>
                          </label>
                        </div>
                      </div>
                      {filters.dateRange === 'custom' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                              Start Date
                            </label>
                            <Input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={filters.startDate}
                              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                              End Date
                            </label>
                            <Input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={filters.endDate}
                              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                          Search Term
                        </label>
                        <Input
                          type="text"
                          id="searchTerm"
                          name="searchTerm"
                          value={filters.searchTerm}
                          onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                          placeholder="Search by description or category"
                        />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                      <Button onClick={() => setShowFilterModal(false)} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={applyFilters} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction._id} className="bg-gray-50 p-4 rounded-md shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{transaction.category}</h3>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
                      <span className={`text-lg font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setEditingTransaction(transaction)
                            setShowForm(true)
                          }}
                          variant="outline"
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-300"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(transaction._id)}
                          variant="outline"
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              onClick={() => {
                setExportType('pdf')
                setShowExportModal(true)
              }}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
            >
              Export to PDF
            </Button>
            <Button
              onClick={() => {
                setExportType('csv')
                setShowExportModal(true)
              }}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300"
            >
              Export to CSV
            </Button>
          </CardFooter>
        </Card>
      </main>

      {showExportModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Export Transactions
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Choose the content and date range for your export.
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Content to Export</label>
                  <select
                    value={exportContent}
                    onChange={(e) => setExportContent(e.target.value as 'all' | 'income' | 'expenses' | 'selected')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expenses">Expenses Only</option>
                    <option value="selected">Selected Transactions</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Date Range</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="exportDateRange"
                        value="all"
                        checked={exportDateRange === 'all'}
                        onChange={() => setExportDateRange('all')}
                      />
                      <span className="ml-2">All Dates</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        className="form-radio"
                        name="exportDateRange"
                        value="custom"
                        checked={exportDateRange === 'custom'}
                        onChange={() => setExportDateRange('custom')}
                      />
                      <span className="ml-2">Custom Range</span>
                    </label>
                  </div>
                </div>
                {exportDateRange === 'custom' && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="exportStartDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="exportStartDate"
                        name="exportStartDate"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="exportEndDate" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="exportEndDate"
                        name="exportEndDate"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleExport}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Export
                </Button>
                <Button
                  onClick={() => setShowExportModal(false)}
                  variant="outline"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}