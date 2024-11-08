'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  onSubmit: (data: TransactionFormValues) => void
  initialValues?: Partial<TransactionFormValues>
  onCancel: () => void
  incomeCategories: string[]
  expenseCategories: string[]
}

export function TransactionForm({ onSubmit, initialValues, onCancel, incomeCategories, expenseCategories }: TransactionFormProps) {
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialValues || {
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const transactionType = watch('type')

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialValues ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-center mb-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex bg-gray-200 p-1 rounded-full">
                <label className={`flex-1 text-center py-2 px-4 rounded-full cursor-pointer transition-colors ${field.value === 'income' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-300'}`}>
                  <input
                    type="radio"
                    {...field}
                    value="income"
                    className="sr-only"
                  />
                  Income
                </label>
                <label className={`flex-1 text-center py-2 px-4 rounded-full cursor-pointer transition-colors ${field.value === 'expense' ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-300'}`}>
                  <input
                    type="radio"
                    {...field}
                    value="expense"
                    className="sr-only"
                  />
                  Expense
                </label>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // If the value is empty, set it as an empty string
                    if (value === '') {
                      field.onChange('');
                    } else {
                      // Else, parse the value as a number and pass it to the field
                      const parsedValue = parseFloat(value);
                      field.onChange(isNaN(parsedValue) ? '' : parsedValue);
                    }
                  }}
                  className="pl-10"
                  placeholder="Enter amount"
                />
              </div>
            )}
          />
          </div>
          {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {(transactionType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                {...field}
                rows={3}
                placeholder="Enter description (optional)"
              />
            )}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  {...field}
                  value={
                    field.value
                      ? new Date(new Date(field.value).getTime() + new Date().getTimezoneOffset() * 60000)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                  }}
                />
              </div>
            )}
          />
          </div>
          {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            {isSubmitting ? 'Submitting...' : initialValues ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </div>
  )
}