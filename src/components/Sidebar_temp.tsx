"use client";

import React, { useState } from "react";
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
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  showUserMenu: boolean;
  setShowUserMenu: (value: boolean) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  isMenuOpen,
  setIsMenuOpen,
  showUserMenu,
  setShowUserMenu,
  onCollapsedChange,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapsedChange?.(!isCollapsed);
  };

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
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex fixed left-0 top-0 h-full bg-[#00674F] shadow-2xl z-50 flex-col"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20 relative">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold text-white whitespace-nowrap"
                >
                  Nexus
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Collapse Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#00674F] border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-white" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-white" />
            )}
          </motion.button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: isCollapsed ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:text-white hover:bg-white/20"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    active
                      ? "bg-white/20"
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !isCollapsed && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
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
            animate={{ height: showUserMenu && !isCollapsed ? "auto" : "48px" }}
            className="overflow-hidden"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => !isCollapsed && setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all duration-200`}
              title={isCollapsed ? "Account" : undefined}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium whitespace-nowrap"
                    >
                      Account
                    </motion.span>
                    <ChevronRight
                      className={`w-4 h-4 ml-auto transition-transform ${
                        showUserMenu ? "rotate-90" : ""
                      }`}
                    />
                  </>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && !isCollapsed && (
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

            {/* Logout button for collapsed state */}
            {isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="w-full flex justify-center px-4 py-3 mt-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-all duration-200"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.aside>

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

      {/* Mobile Sidebar (unchanged) */}
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
              {/* Mobile content remains the same */}
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
