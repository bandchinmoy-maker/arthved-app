import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'Arthved — Financial Ledger',
  description: 'Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
