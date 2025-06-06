"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, DollarSign, Plus, Minus, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

// more zod stuff for validation and typescript usability
const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;
// z.infer<T>` extracts the TypeScript type from a Zod schema (Zod is a type-script schema declaration and validation librar)y that is really important for these type of applications because everything should be validated!
// `typeof transactionSchema` gets the type of the Zod schema `transactionSchema`

// This is a typescript feature that is used to define the structure of a certain object that can be looped into to be checked.
interface TransactionFormProps {
  // Function that handles form submission, receiving validated transaction data
  onSubmit: (data: TransactionFormValues) => void;
  // Optional initial values for the form (partial means some properties may be omitted)
  initialValues?: Partial<TransactionFormValues>;
  // Function to handle form cancellation, does not receive any arguments
  onCancel: () => void;
  // Array of category names for income transactions
  incomeCategories: string[];
  // Array of category names for expense transactions
  expenseCategories: string[];
}

export function TransactionForm({
  onSubmit,
  initialValues,
  onCancel,
  incomeCategories,
  expenseCategories,
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    // we use this react hook
    resolver: zodResolver(transactionSchema), // more zod validation
    defaultValues: initialValues || {
      type: "expense",
      amount: 0,
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // this sets the date in YYYY-MM-DD using some weird stuff
    },
  });

  // Uses the React Hook's WATCH function which tracks the value of the 'type' field in real-time --> useful for things that need to be constantly updated.
  const transactionType = watch("type");

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-slate-200/50 max-h-[90vh] overflow-y-auto">
            <div className="px-6 pt-6 pb-4 text-center">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  transactionType === "income"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : "bg-gradient-to-br from-red-500 to-pink-600"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {transactionType === "income" ? (
                  <Plus className="w-6 h-6 text-white" />
                ) : (
                  <Minus className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <h2
                className={`text-xl font-bold mb-1 bg-gradient-to-r ${
                  transactionType === "income"
                    ? "from-green-500 to-emerald-600"
                    : "from-red-500 to-pink-600"
                } bg-clip-text text-transparent`}
              >
                {initialValues ? "Edit Transaction" : "Add Transaction"}
              </h2>
            </div>

            <div className="px-6 pb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Transaction Type Toggle */}
                <div className="flex items-center justify-center">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                        <label
                          className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            field.value === "income"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                              : "text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="income"
                            className="sr-only"
                          />
                          <div className="flex items-center justify-center space-x-1">
                            <Plus className="w-3 h-3" />
                            <span className="text-sm font-medium">Income</span>
                          </div>
                        </label>
                        <label
                          className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            field.value === "expense"
                              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md"
                              : "text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="expense"
                            className="sr-only"
                          />
                          <div className="flex items-center justify-center space-x-1">
                            <Minus className="w-3 h-3" />
                            <span className="text-sm font-medium">Expense</span>
                          </div>
                        </label>
                      </div>
                    )}
                  />
                </div>

                {/* Amount Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-medium text-slate-700"
                  >
                    Amount
                  </Label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange("");
                            } else {
                              const parsedValue = parseFloat(value);
                              field.onChange(
                                isNaN(parsedValue) ? "" : parsedValue
                              );
                            }
                          }}
                          className="pl-9 bg-slate-50 border-slate-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  />
                  {errors.amount && (
                    <motion.p
                      className="text-xs text-red-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.amount.message}
                    </motion.p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-slate-700"
                  >
                    Category
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Tag className="h-4 w-4 text-slate-400" />
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="pl-9 bg-slate-50 border-slate-300 focus:border-green-500 focus:ring-green-500 rounded-lg">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {(transactionType === "income"
                              ? incomeCategories
                              : expenseCategories
                            ).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                  {errors.category && (
                    <motion.p
                      className="text-xs text-red-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.category.message}
                    </motion.p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FileText className="h-4 w-4 text-slate-400" />
                        </div>
                        <Textarea
                          id="description"
                          {...field}
                          rows={2}
                          placeholder="Description (optional)"
                          className="pl-9 bg-slate-50 border-slate-300 focus:border-green-500 focus:ring-green-500 rounded-lg resize-none"
                        />
                      </div>
                    )}
                  />
                  {errors.description && (
                    <motion.p
                      className="text-xs text-red-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.description.message}
                    </motion.p>
                  )}
                </div>

                {/* Date Field */}
                <div className="space-y-1">
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium text-slate-700"
                  >
                    Date
                  </Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                          id="date"
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(
                                  new Date(field.value).getTime() +
                                    new Date().getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : null;
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            );
                          }}
                          className="pl-9 bg-slate-50 border-slate-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        />
                      </div>
                    )}
                  />
                  {errors.date && (
                    <motion.p
                      className="text-xs text-red-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.date.message}
                    </motion.p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="px-4 py-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                      transactionType === "income"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    }`}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : initialValues
                      ? "Update"
                      : "Add"}{" "}
                    Transaction
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </>
  );
}
