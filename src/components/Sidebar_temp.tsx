"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  LayoutDashboard,
  Lightbulb,
  HelpCircle,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  showUserMenu: boolean;
  setShowUserMenu: (value: boolean) => void;
}

export default function Sidebar({
  isMenuOpen,
  setIsMenuOpen,
  showUserMenu,
  setShowUserMenu,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/budgeting-tips",
      label: "Budgeting Tips",
      icon: Lightbulb,
    },
    {
      path: "/instructions",
      label: "Instructions",
      icon: HelpCircle,
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
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
            <h1 className="text-2xl font-bold text-white">Nexus</h1>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:text-white hover:bg-white/20"
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    active
                      ? "bg-white/20"
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.button>
            );
          })}
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
        className="fixed top-4 left-4 z-[60] p-3 bg-[#00674F] rounded-xl shadow-lg md:hidden"
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
              className="fixed left-0 top-0 h-full w-72 bg-[#00674F] shadow-2xl z-[56] md:hidden flex flex-col"
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
                  <h1 className="text-2xl font-bold text-white">Nexus</h1>
                </motion.div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        router.push(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        active
                          ? "bg-white/20 text-white"
                          : "text-white/90 hover:text-white hover:bg-white/20"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          active
                            ? "bg-white/20"
                            : "bg-white/10 group-hover:bg-white/20"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
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
    </>
  );
}