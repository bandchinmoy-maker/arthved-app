'use server';

import { getSql } from './lib/db';
import { revalidatePath } from 'next/cache';

// 1. Fetch all transactions
export async function getTransactions() {
  try {
    const sql = getSql();
    const transactions = await sql`
      SELECT * FROM transactions ORDER BY created_at DESC
    `;
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

// 2. Insert a new transaction
export async function addTransaction(formData: FormData) {
  const amount = formData.get('amount');
  const type = formData.get('type');         // 'income' or 'expense'
  const category = formData.get('category'); // e.g., 'Food', 'Rent'
  const person = formData.get('person');     // optional person name
  const date = formData.get('date');         // transaction date

  try {
    const sql = getSql();
    await sql`
      INSERT INTO transactions (amount, type, category, person, date)
      VALUES (${Number(amount)}, ${String(type)}, ${String(category)}, ${person ? String(person) : null}, ${String(date)})
    `;
    
    revalidatePath('/');
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to save transaction.');
  }
}