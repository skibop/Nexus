"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { TransactionForm } from "@/components/TransactionForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Download,
  Filter,
  Plus,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Target,
  ChevronRight,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  FileText,
  FileSpreadsheet,
  Moon,
  Sun,
  Edit2,
  Trash2,
  Lightbulb,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import "./page.css";
import MoneySavingRecommendations from "@/components/MoneySaver";

// Enhanced color palette with gradients
const categoryColors: { [key: string]: string } = {
  Work: "#6366f1",
  Allowance: "#f59e0b",
  Gift: "#06b6d4",
  Chores: "#ec4899",
  Misc: "#10b981",
  Transportation: "#ef4444",
  Entertainment: "#8b5cf6",
  Clothing: "#14b8a6",
  Personal: "#f97316",
  Food: "#a855f7",
};

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface FilterOptions {
  searchTerm: string;
  dateRange: "all" | "custom";
  startDate: string;
  endDate: string;
  type: "all" | "income" | "expense";
}

interface SortConfig {
  key: keyof Transaction | null;
  direction: "asc" | "desc";
}

interface Budget {
  category: string;
  limit: number;
  period: "monthly" | "weekly" | "yearly" | "custom";
  spent: number;
  remaining: number;
  percentUsed: number;
}

type BudgetPeriod = "monthly" | "weekly" | "yearly";

interface BudgetData {
  [key: string]: number;
}

interface UserBudgets {
  monthly: BudgetData;
  weekly: BudgetData;
  yearly: BudgetData;
}

const incomeCategories: string[] = [
  "Work",
  "Allowance",
  "Gift",
  "Chores",
  "Misc",
];
const expenseCategories: string[] = [
  "Transportation",
  "Entertainment",
  "Clothing",
  "Personal",
  "Food",
  "Misc",
];

const Motioncard = motion.create(Card);

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("monthly");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [breakdownType, setBreakdownType] = useState<"income" | "expense">(
    "income"
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    dateRange: "all",
    startDate: "",
    endDate: "",
    type: "all",
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "csv">("pdf");
  const [exportContent, setExportContent] = useState<
    "all" | "income" | "expenses" | "selected"
  >("all");
  const [exportDateRange, setExportDateRange] = useState<"all" | "custom">(
    "all"
  );
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHealthScore, setShowHealthScore] = useState(false);
  const [showBudgetingTool, setShowBudgetingTool] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userBudgets, setUserBudgets] = useState<{ [key: string]: number }>({});
  const [budgetStartDate, setBudgetStartDate] = useState<string>("");
  const [budgetEndDate, setBudgetEndDate] = useState<string>("");
  const [budgetsLoading, setBudgetsLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const calculateHealthScore = () => {
    // Base score starts at 50
    let score = 50;

    // Savings rate impact (0-30 points)
    if (savingsRate > 20) score += 30;
    else if (savingsRate > 10) score += 20;
    else if (savingsRate > 5) score += 10;
    else if (savingsRate > 0) score += 5;

    // Expense to income ratio impact (0-20 points)
    const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1;
    if (expenseRatio < 0.5) score += 20;
    else if (expenseRatio < 0.7) score += 15;
    else if (expenseRatio < 0.8) score += 10;
    else if (expenseRatio < 0.9) score += 5;

    // Transaction frequency bonus (0-10 points)
    const avgTransactionsPerMonth = transactions.length / 3; // Assuming 3 months of data
    if (avgTransactionsPerMonth > 20) score += 10;
    else if (avgTransactionsPerMonth > 10) score += 5;

    // Diverse income sources bonus (0-10 points)
    const incomeCategories = new Set(
      transactions.filter((t) => t.type === "income").map((t) => t.category)
    ).size;
    if (incomeCategories >= 3) score += 10;
    else if (incomeCategories >= 2) score += 5;

    // Cap score at 100
    return Math.min(Math.round(score), 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  // Update fetchBudgets function
  const fetchBudgets = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setBudgetsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/budgets`,
        {
          headers: { "x-auth-token": token },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await response.json();
      setUserBudgets(data.budgets);
      setBudgetStartDate(new Date(data.startDate).toISOString().split("T")[0]);
      setBudgetEndDate(new Date(data.endDate).toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      // Use default budgets if fetch fails
      setUserBudgets({
        Food: 300,
        Transportation: 200,
        Entertainment: 150,
        Clothing: 100,
        Personal: 100,
        Misc: 50,
      });
      // Default to current month
      const now = new Date();
      setBudgetStartDate(
        new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0]
      );
      setBudgetEndDate(
        new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0]
      );
    } finally {
      setBudgetsLoading(false);
    }
  }, []);

  // Update calculateBudgetData to use the correct period
  const calculateBudgetData = () => {
    const categoryBudgets: { [key: string]: Budget } = {};

    const startDate = new Date(budgetStartDate);
    const endDate = new Date(budgetEndDate);

    expenseCategories.forEach((category) => {
      const spent = filteredTransactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === category &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const limit = userBudgets[category] || 0;

      categoryBudgets[category] = {
        category,
        limit,
        period: "custom",
        spent,
        remaining: limit - spent,
        percentUsed: limit > 0 ? (spent / limit) * 100 : 0,
      };
    });

    return Object.values(categoryBudgets);
  };

  // Update saveBudgets to include the period
  const saveBudgets = async (
    newBudgets: { [key: string]: number },
    newStartDate?: string,
    newEndDate?: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/budgets`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            budgets: newBudgets,
            startDate: newStartDate || budgetStartDate,
            endDate: newEndDate || budgetEndDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save budgets");
      }

      const data = await response.json();
      setUserBudgets(data.budgets);
      if (data.startDate)
        setBudgetStartDate(
          new Date(data.startDate).toISOString().split("T")[0]
        );
      if (data.endDate)
        setBudgetEndDate(new Date(data.endDate).toISOString().split("T")[0]);
      setBudgets(calculateBudgetData());
    } catch (error) {
      console.error("Error saving budgets:", error);
    }
  };

  const resetBudgets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/budgets/reset`,
        {
          method: "DELETE",
          headers: { "x-auth-token": token },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset budgets");
      }

      const data = await response.json();
      setUserBudgets(data.budgets);
      setBudgets(calculateBudgetData());
    } catch (error) {
      console.error("Error resetting budgets:", error);
    }
  };

  const getBudgetStatusColor = (percentUsed: number) => {
    if (percentUsed >= 100) return "text-red-600 dark:text-red-400";
    if (percentUsed >= 80) return "text-amber-600 dark:text-amber-400";
    if (percentUsed >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getBudgetProgressColor = (percentUsed: number) => {
    if (percentUsed >= 100) return "from-red-500 to-rose-600";
    if (percentUsed >= 80) return "from-amber-500 to-orange-600";
    if (percentUsed >= 60) return "from-yellow-500 to-amber-600";
    return "from-green-500 to-emerald-600";
  };

  useEffect(() => {
    if (showForm && editingTransaction) {
      scrollToForm();
    }
  }, [showForm, editingTransaction, scrollToForm]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (showBudgetingTool && !budgetsLoading) {
      fetchBudgets();
    }
  }, [showBudgetingTool, fetchBudgets]);

  useEffect(() => {
    if (
      userBudgets &&
      Object.keys(userBudgets).length > 0 &&
      budgetStartDate &&
      budgetEndDate
    ) {
      setBudgets(calculateBudgetData());
    }
  }, [filteredTransactions, userBudgets, budgetStartDate, budgetEndDate]);

  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/transactions`,
        {
          headers: { "x-auth-token": token },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (data: Omit<Transaction, "_id">) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      if (editingTransaction) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/transaction/${editingTransaction._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/transaction`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(data),
        });
      }
      fetchTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/transaction/${id}`,
        {
          method: "DELETE",
          headers: { "x-auth-token": token },
        }
      );
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = React.useMemo(() => {
    const sortableTransactions = [...filteredTransactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        if (sortConfig.key === "amount") {
          return sortConfig.direction === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        const aValue = a[sortConfig.key as keyof Transaction];
        const bValue = b[sortConfig.key as keyof Transaction];
        if (aValue! < bValue!) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue! > bValue!) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableTransactions;
  }, [filteredTransactions, sortConfig]);

  const applyFilters = () => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearchTerm =
        transaction.description
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        transaction.category
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      let matchesDate = true;
      const transactionDate = new Date(transaction.date);

      if (
        filters.dateRange === "custom" &&
        filters.startDate &&
        filters.endDate
      ) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        matchesDate =
          transactionDate >= startDate && transactionDate <= endDate;
      }

      return matchesSearchTerm && matchesType && matchesDate;
    });

    setFilteredTransactions(filtered);
    setShowFilterModal(false);
  };

  const calculateTotalByCategory = (type: "income" | "expense") => {
    return filteredTransactions
      .filter((t) => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const generatePieChartData = (type: "income" | "expense") => {
    const data = calculateTotalByCategory(type);
    const categories = type === "income" ? incomeCategories : expenseCategories;
    return categories
      .map((category) => ({
        id: category,
        value: data[category] || 0,
        label: category,
        color: categoryColors[category],
      }))
      .filter((item) => item.value > 0);
  };

  const generateBarChartData = () => {
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const data: { date: string; income: number; expenses: number }[] = [];

    if (timePeriod === "weekly") {
      sortedTransactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const weekStart = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const weekKey = `${(weekStart.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${weekStart
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        const existingEntry = data.find((entry) => entry.date === weekKey);

        if (existingEntry) {
          if (transaction.type === "income") {
            existingEntry.income += transaction.amount;
          } else {
            existingEntry.expenses += transaction.amount;
          }
        } else {
          data.push({
            date: weekKey,
            income: transaction.type === "income" ? transaction.amount : 0,
            expenses: transaction.type === "expense" ? transaction.amount : 0,
          });
        }
      });
    } else {
      sortedTransactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        const existingEntry = data.find((entry) => entry.date === monthKey);

        if (existingEntry) {
          if (transaction.type === "income") {
            existingEntry.income += transaction.amount;
          } else {
            existingEntry.expenses += transaction.amount;
          }
        } else {
          data.push({
            date: monthKey,
            income: transaction.type === "income" ? transaction.amount : 0,
            expenses: transaction.type === "expense" ? transaction.amount : 0,
          });
        }
      });
    }

    return data;
  };

  const barChartData = generateBarChartData();

  const handleExport = () => {
    let dataToExport = transactions;

    if (exportContent === "selected") {
      dataToExport = filteredTransactions;
    } else if (exportContent !== "all") {
      dataToExport = dataToExport.filter(
        (t) => t.type === (exportContent === "income" ? "income" : "expense")
      );
    }

    if (exportDateRange === "custom" && exportStartDate && exportEndDate) {
      dataToExport = dataToExport.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate >= new Date(exportStartDate) &&
          transactionDate <= new Date(exportEndDate)
        );
      });
    }

    if (exportType === "pdf") {
      exportToPDF(dataToExport);
    } else {
      exportToCSV(dataToExport);
    }

    setShowExportModal(false);
  };

  const exportToPDF = (data: Transaction[]) => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 20, 10);

    const tableData = data.map((t) => [
      formatDate(t.date),
      t.type,
      t.category,
      t.description,
      `$${t.amount.toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: tableData,
    });

    doc.save("transaction_report.pdf");
  };

  const exportToCSV = (data: Transaction[]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Type,Category,Description,Amount\n" +
      data
        .map(
          (t) =>
            `${formatDate(t.date)},${t.type},${t.category},"${
              t.description
            }",$${t.amount.toFixed(2)}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const getSortIcon = (column: keyof Transaction) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-indigo-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-indigo-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div id="rotate-message" className="md:hidden">
          <p>
            Please rotate your device to landscape mode for the best experience.
          </p>
        </div>

        {/* Enhanced Header with Glass Effect */}
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
                  className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  onClick={() => router.push("/dashboard")}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span>Dashboard</span>
                  </div>
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
                    <ChevronRight
                      className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
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
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/");
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

                {/* Mobile Menu Button */}
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
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      Menu
                    </h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        router.push("/budgeting-tips");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Budgeting Tips
                    </button>
                    <button
                      onClick={() => {
                        router.push("/instructions");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Instructions
                    </button>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          router.push("/");
                          setIsMenuOpen(false);
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
          {/* Welcome Section with Stats */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Nexus!
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's your financial overview
              </p>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Current Balance
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(totalBalance)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Real-time net worth
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Total Income
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(totalIncome)}
                    </p>
                    <div className="flex items-center mt-2 space-x-1">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        +12.5%
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Total Expenses
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                      {formatCurrency(totalExpenses)}
                    </p>
                    <div className="flex items-center mt-2 space-x-1">
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">
                        -8.3%
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                        <PiggyBank className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Savings Rate
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                      {savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Of total income
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section - Reversed Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Cash Flow Analysis (Bar Chart) - Left Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <div>
                          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
                            Cash Flow Analysis
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            Income vs Expenses over time
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => setShowHealthScore(!showHealthScore)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Financial Health Score"
                        >
                          <svg
                            className="w-5 h-5 text-slate-500 dark:text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setTimePeriod("weekly")}
                          variant={
                            timePeriod === "weekly" ? "default" : "outline"
                          }
                          className={
                            timePeriod === "weekly"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md"
                              : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                          size="sm"
                        >
                          Weekly
                        </Button>
                        <Button
                          onClick={() => setTimePeriod("monthly")}
                          variant={
                            timePeriod === "monthly" ? "default" : "outline"
                          }
                          className={
                            timePeriod === "monthly"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md"
                              : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                          size="sm"
                        >
                          Monthly
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 1 }} // increase bottom margin for legend
                        >
                          <defs>
                            <linearGradient
                              id="incomeGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                            <linearGradient
                              id="expenseGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#ef4444"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#ef4444"
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-slate-200 dark:stroke-slate-700"
                          />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }}
                          />
                          <YAxis
                            className="text-xs"
                            tick={{ fill: darkMode ? "#94a3b8" : "#64748b" }}
                            tickFormatter={(value) =>
                              `${
                                value >= 1000
                                  ? `${(value / 1000).toFixed(0)}k`
                                  : value
                              }`
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value: any) => formatCurrency(value)}
                          />
                          <Legend
                            verticalAlign="bottom"
                            align="center"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ paddingTop: "10px" }}
                          />
                          <Bar
                            dataKey="income"
                            fill="url(#incomeGradient)"
                            radius={[8, 8, 0, 0]}
                            name="Income"
                          />
                          <Bar
                            dataKey="expenses"
                            fill="url(#expenseGradient)"
                            radius={[8, 8, 0, 0]}
                            name="Expenses"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Combined Income & Expense Breakdown - Right Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
                          Category Breakdown
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          Distribution by category
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setBreakdownType("income")}
                          variant={
                            breakdownType === "income" ? "default" : "outline"
                          }
                          className={
                            breakdownType === "income"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-md"
                              : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                          size="sm"
                        >
                          Income
                        </Button>
                        <Button
                          onClick={() => setBreakdownType("expense")}
                          variant={
                            breakdownType === "expense" ? "default" : "outline"
                          }
                          className={
                            breakdownType === "expense"
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md"
                              : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                          size="sm"
                        >
                          Expenses
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] flex items-center justify-center">
                      <PieChart
                        series={[
                          {
                            data: generatePieChartData(breakdownType),
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                            faded: {
                              innerRadius: 30,
                              additionalRadius: -30,
                              color: "gray",
                            },
                            innerRadius: 60,
                            outerRadius: 120,
                            paddingAngle: 2,
                            cornerRadius: 5,
                            cx: "50%",
                            cy: "50%",
                          },
                        ]}
                        width={400}
                        height={300}
                        slotProps={{
                          legend: {
                            direction: "horizontal",
                            position: {
                              vertical: "bottom",
                              horizontal: "center",
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Transactions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
                        Recent Transactions
                        {filters.type !== "all" &&
                          ` • ${
                            filters.type.charAt(0).toUpperCase() +
                            filters.type.slice(1)
                          }`}
                        {filters.searchTerm && ` • "${filters.searchTerm}"`}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        {filteredTransactions.length} transactions found
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowForm(true)}
                        className="flex flex-row items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-700 hover:to-green-700 shadow-md"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                      <Button
                        onClick={() => setShowRecommendations(true)}
                        className="flex flex-row items-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md"
                        size="sm"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Money Saving Recommendations
                      </Button>
                      <Button
                        onClick={() => setShowBudgetingTool(true)}
                        className="flex flex-row items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-md"
                        size="sm"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Budget Planner
                      </Button>
                      <Button
                        onClick={() => setShowFilterModal(true)}
                        variant="outline"
                        className="flex items-center border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        size="sm"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        onClick={() => setShowExportModal(true)}
                        variant="outline"
                        className="flex items-center border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {showForm && (
                    <div
                      ref={formRef}
                      className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    >
                      <TransactionForm
                        onSubmit={handleSubmit}
                        initialValues={editingTransaction || undefined}
                        onCancel={() => {
                          setShowForm(false);
                          setEditingTransaction(null);
                        }}
                        incomeCategories={incomeCategories}
                        expenseCategories={expenseCategories}
                      />
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.searchTerm}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            searchTerm: e.target.value,
                          });
                          applyFilters();
                        }}
                        className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-emerald-300 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort("date")}
                              className="flex items-center space-x-1 text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <span>Date</span>
                              {getSortIcon("date")}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort("description")}
                              className="flex items-center space-x-1 text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <span>Description</span>
                              {getSortIcon("description")}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort("category")}
                              className="flex items-center space-x-1 text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <span>Category</span>
                              {getSortIcon("category")}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-left">
                            <button
                              onClick={() => handleSort("amount")}
                              className="flex items-center space-x-1 text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <span>Amount</span>
                              {getSortIcon("amount")}
                            </button>
                          </th>
                          <th className="px-6 py-4 text-center text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {sortedTransactions.length > 0 ? (
                          sortedTransactions.map((transaction, index) => (
                            <motion.tr
                              key={transaction._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(transaction.date)}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                                {transaction.description || ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    transaction.type === "income"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.category}
                                </span>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                  transaction.type === "income"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingTransaction(transaction);
                                      setShowForm(true);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(transaction._id)
                                    }
                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                            >
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        {/* Money Saving Recommendations Modal */}
        <AnimatePresence>
          {showRecommendations && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecommendations(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                        <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Money Saving Recommendations
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowRecommendations(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <MoneySavingRecommendations />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                  Filter Transactions
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          type: e.target.value as "all" | "income" | "expense",
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Transactions</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expenses Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="dateRange"
                          value="all"
                          checked={filters.dateRange === "all"}
                          onChange={() =>
                            setFilters({ ...filters, dateRange: "all" })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          All Dates
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="dateRange"
                          value="custom"
                          checked={filters.dateRange === "custom"}
                          onChange={() =>
                            setFilters({ ...filters, dateRange: "custom" })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Custom Range
                        </span>
                      </label>
                    </div>
                  </div>

                  {filters.dateRange === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              startDate: e.target.value,
                            })
                          }
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                          }
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => setShowFilterModal(false)}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyFilters}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-700 hover:to-teal-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Modal */}
        <AnimatePresence>
          {showExportModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                  Export Transactions
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Export Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setExportType("pdf")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          exportType === "pdf"
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                        }`}
                      >
                        <FileText className="w-6 h-6 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          PDF
                        </span>
                      </button>
                      <button
                        onClick={() => setExportType("csv")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          exportType === "csv"
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                        }`}
                      >
                        <FileSpreadsheet className="w-6 h-6 mx-auto mb-1 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          CSV
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Content to Export
                    </label>
                    <select
                      value={exportContent}
                      onChange={(e) =>
                        setExportContent(
                          e.target.value as
                            | "all"
                            | "income"
                            | "expenses"
                            | "selected"
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Transactions</option>
                      <option value="income">Income Only</option>
                      <option value="expenses">Expenses Only</option>
                      <option value="selected">Filtered Transactions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="exportDateRange"
                          value="all"
                          checked={exportDateRange === "all"}
                          onChange={() => setExportDateRange("all")}
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          All Dates
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="exportDateRange"
                          value="custom"
                          checked={exportDateRange === "custom"}
                          onChange={() => setExportDateRange("custom")}
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Custom Range
                        </span>
                      </label>
                    </div>
                  </div>

                  {exportDateRange === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={exportStartDate}
                          onChange={(e) => setExportStartDate(e.target.value)}
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={exportEndDate}
                          onChange={(e) => setExportEndDate(e.target.value)}
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => setShowExportModal(false)}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-700 hover:to-teal-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 right-4 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Notifications
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Financial Health Score Modal */}
        <AnimatePresence>
          {showHealthScore && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHealthScore(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    Financial Health Score
                  </h3>

                  <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-slate-200 dark:text-slate-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 88 * (1 - calculateHealthScore() / 100)
                        }`}
                        className={getScoreColor(calculateHealthScore())}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-5xl font-bold ${getScoreColor(
                          calculateHealthScore()
                        )}`}
                      >
                        {calculateHealthScore()}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        out of 100
                      </span>
                    </div>
                  </div>

                  <div
                    className={`text-lg font-semibold mb-4 ${getScoreColor(
                      calculateHealthScore()
                    )}`}
                  >
                    {getScoreLabel(calculateHealthScore())}
                  </div>

                  <div className="text-left space-y-3 mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your financial health score is calculated based on:
                    </p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>
                          <strong>Savings Rate (30%):</strong> How much you save
                          compared to income
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>
                          <strong>Expense Ratio (20%):</strong> Your expenses
                          relative to income
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>
                          <strong>Transaction Activity (10%):</strong> Regular
                          financial tracking
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>
                          <strong>Income Diversity (10%):</strong> Multiple
                          income sources
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span>
                          <strong>Base Score (30%):</strong> Starting baseline
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Score Scale:</strong> 0-39 (Needs Improvement) •
                      40-59 (Fair) • 60-79 (Good) • 80-100 (Excellent)
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowHealthScore(false)}
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Budgeting Tool Modal */}
        {/* Budgeting Tool Modal */}
        <AnimatePresence>
          {showBudgetingTool && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBudgetingTool(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Budget Planner
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Set your spending limits for a custom date range
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBudgetingTool(false)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                  {budgetsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {/* Date Range Selector */}
                      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                          Budget Period
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Start Date
                            </label>
                            <Input
                              type="date"
                              value={budgetStartDate}
                              onChange={(e) => {
                                setBudgetStartDate(e.target.value);
                                saveBudgets(
                                  userBudgets,
                                  e.target.value,
                                  budgetEndDate
                                );
                              }}
                              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={budgetEndDate}
                              onChange={(e) => {
                                setBudgetEndDate(e.target.value);
                                saveBudgets(
                                  userBudgets,
                                  budgetStartDate,
                                  e.target.value
                                );
                              }}
                              min={budgetStartDate}
                              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                          Tracking expenses from{" "}
                          {new Date(
                            budgetStartDate + "T00:00:00"
                          ).toLocaleDateString()}{" "}
                          to{" "}
                          {new Date(
                            budgetEndDate + "T00:00:00"
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Budget Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Total Budget
                              </span>
                              <DollarSign className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                              {formatCurrency(
                                budgets.reduce((sum, b) => sum + b.limit, 0)
                              )}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Total Spent
                              </span>
                              <TrendingUp className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                              {formatCurrency(
                                budgets.reduce((sum, b) => sum + b.spent, 0)
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {budgets.length > 0
                                ? (
                                    (budgets.reduce(
                                      (sum, b) => sum + b.spent,
                                      0
                                    ) /
                                      budgets.reduce(
                                        (sum, b) => sum + b.limit,
                                        0
                                      )) *
                                    100
                                  ).toFixed(1)
                                : "0"}
                              % of budget
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Remaining
                              </span>
                              <Wallet className="w-4 h-4 text-slate-400" />
                            </div>
                            <p
                              className={`text-2xl font-bold ${
                                budgets.reduce(
                                  (sum, b) => sum + b.remaining,
                                  0
                                ) >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {formatCurrency(
                                Math.abs(
                                  budgets.reduce(
                                    (sum, b) => sum + b.remaining,
                                    0
                                  )
                                )
                              )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {budgets.reduce(
                                (sum, b) => sum + b.remaining,
                                0
                              ) >= 0
                                ? "under budget"
                                : "over budget"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Category Budgets */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                          Category Budgets
                        </h4>
                        {budgets.map((budget) => (
                          <motion.div
                            key={budget.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                                  style={{
                                    backgroundColor: `${
                                      categoryColors[budget.category]
                                    }20`,
                                  }}
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        categoryColors[budget.category],
                                    }}
                                  />
                                </div>
                                <div>
                                  <h5 className="font-medium text-slate-800 dark:text-white">
                                    {budget.category}
                                  </h5>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {formatCurrency(budget.spent)} of{" "}
                                    {formatCurrency(budget.limit)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-lg font-semibold ${getBudgetStatusColor(
                                    budget.percentUsed
                                  )}`}
                                >
                                  {budget.percentUsed.toFixed(0)}%
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {budget.remaining >= 0
                                    ? `${formatCurrency(budget.remaining)} left`
                                    : `${formatCurrency(
                                        Math.abs(budget.remaining)
                                      )} over`}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getBudgetProgressColor(
                                  budget.percentUsed
                                )} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(
                                    budget.percentUsed,
                                    100
                                  )}%`,
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                              {budget.percentUsed > 100 && (
                                <div
                                  className="absolute right-0 top-0 h-full bg-red-600 dark:bg-red-500 animate-pulse"
                                  style={{
                                    width: `${budget.percentUsed - 100}%`,
                                  }}
                                />
                              )}
                            </div>

                            {/* Edit Budget */}
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Budget limit:
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  $
                                </span>
                                <input
                                  type="number"
                                  defaultValue={budget.limit}
                                  onBlur={async (e) => {
                                    const newLimit =
                                      parseFloat(e.target.value) || 0;
                                    if (newLimit === budget.limit) return; // No change

                                    const updatedBudgets = {
                                      ...userBudgets,
                                      [budget.category]: newLimit,
                                    };

                                    await saveBudgets(updatedBudgets);
                                  }}
                                  onKeyPress={async (e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  className="w-24 px-2 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Budget Insights */}
                      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                          Budget Insights
                        </h4>
                        <div className="space-y-2">
                          {budgets.filter((b) => b.percentUsed >= 80).length >
                            0 && (
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              <span className="font-medium text-amber-600 dark:text-amber-400">
                                ⚠️ Alert:
                              </span>{" "}
                              You're approaching or exceeding your budget limit
                              in{" "}
                              {budgets
                                .filter((b) => b.percentUsed >= 80)
                                .map((b) => b.category)
                                .join(", ")}
                              .
                            </p>
                          )}
                          {budgets.filter((b) => b.percentUsed < 50).length >
                            0 && (
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              <span className="font-medium text-green-600 dark:text-green-400">
                                ✓ Great job:
                              </span>{" "}
                              You're under 50% budget in{" "}
                              {budgets
                                .filter((b) => b.percentUsed < 50)
                                .map((b) => b.category)
                                .join(", ")}
                              .
                            </p>
                          )}
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-medium">💡 Tip:</span> Adjust
                            your budget period to match your income cycle for
                            better tracking.
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          onClick={async () => {
                            if (
                              confirm("Reset all budgets to default values?")
                            ) {
                              await resetBudgets();
                            }
                          }}
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600"
                        >
                          Reset to Defaults
                        </Button>
                        <Button
                          onClick={() => setShowBudgetingTool(false)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-700 hover:to-teal-700"                        >
                          Done
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
