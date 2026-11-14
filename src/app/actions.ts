'use server'

import prisma from './lib/db'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

type TransactionInput = {
  id?: string
  text: string
  amount: number
  amountINR: number
  type: string
  category: string
  paymentMode: string
  bankAccount: string
  country: string
  currency: string
  symbol: string
  date: string
}

// Only logged-in users can use these actions, and each user only sees their own rows
async function currentUserId() {
  const { userId } = await auth()
  return userId
}

export async function getTransactions() {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: transactions }
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return { success: false, error: 'Database se data laane mein error aayi hai' }
  }
}

export async function saveTransaction(formData: TransactionInput) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }

    const amount = Number(formData.amount)
    const amountINR = Number(formData.amountINR)
    if (!Number.isFinite(amount) || !Number.isFinite(amountINR)) {
      return { success: false, error: 'Invalid amount' }
    }

    const data = {
      text: String(formData.text || '').slice(0, 300),
      amount,
      amountINR,
      type: formData.type === 'expense' ? 'expense' : 'income',
      category: String(formData.category || 'General').slice(0, 100),
      paymentMode: String(formData.paymentMode || 'Cash').slice(0, 50),
      bankAccount: String(formData.bankAccount || 'Main Cash Drawer').slice(0, 100),
      country: String(formData.country || 'India').slice(0, 100),
      currency: String(formData.currency || 'INR').slice(0, 10),
      symbol: String(formData.symbol || '₹').slice(0, 10),
    }

    if (formData.id) {
      const result = await prisma.transaction.updateMany({
        where: { id: formData.id, userId },
        data,
      })
      if (result.count === 0) return { success: false, error: 'Transaction not found' }
    } else {
      await prisma.transaction.create({
        data: { ...data, date: String(formData.date || ''), userId },
      })
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to save transaction:', error)
    return { success: false, error: 'Transaction save nahi ho payi' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }

    const result = await prisma.transaction.deleteMany({ where: { id, userId } })
    if (result.count === 0) return { success: false, error: 'Transaction not found' }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    return { success: false, error: 'Transaction delete nahi ho payi' }
  }
}
