import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Notes - Intelligent Note-Taking Platform',
  description: 'AI-powered note-taking app with smart summarization, content improvement, and auto-tagging. Built with Next.js 16, TypeScript, MongoDB, and Google Gemini AI.',
  keywords: ['AI notes', 'note-taking', 'productivity', 'AI summarization', 'smart notes'],
  authors: [{ name: 'Gokulakrishna N E' }],
  openGraph: {
    title: 'AI Notes - Intelligent Note-Taking Platform',
    description: 'Transform your note-taking with AI-powered features',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          // Color scheme - Matches your violet/purple gradient
          colorPrimary: '#8b5cf6', // Violet-600
          colorBackground: '#ffffff',
          colorInputBackground: '#f9fafb', // Gray-50
          colorInputText: '#111827', // Gray-900
          colorText: '#111827',
          colorTextSecondary: '#6b7280', // Gray-500
          colorDanger: '#ef4444', // Red-500
          
          // Border radius - Matches your rounded-xl style
          borderRadius: '1rem',
          
          // Font
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '0.875rem',
        },
        elements: {
          // Main card styling - Glass morphism effect
          card: 'bg-white/80 backdrop-blur-xl border-2 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700',
          
          // Primary button - Gradient to match your app
          formButtonPrimary: 
            'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95',
          
          // Secondary button
          formButtonSecondary: 
            'border-2 border-gray-300 hover:border-violet-400 rounded-xl',
          
          // Input fields
          formFieldInput: 
            'rounded-xl border-2 border-gray-200 focus:border-violet-400 dark:border-gray-700 dark:focus:border-violet-600 transition-all',
          
          // Headers
          headerTitle: 'text-2xl font-bold text-gray-900 dark:text-white',
          headerSubtitle: 'text-gray-600 dark:text-gray-400 text-sm',
          
          // Social buttons
          socialButtonsBlockButton: 
            'border-2 border-gray-200 hover:border-violet-300 rounded-xl transition-all hover:scale-105',
          
          // Footer
          footerActionLink: 'text-violet-600 hover:text-violet-700 font-semibold',
          
          // Divider
          dividerLine: 'bg-gray-200 dark:bg-gray-700',
          dividerText: 'text-gray-500 dark:text-gray-400 text-sm',
          
          // Form labels
          formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium text-sm',
          
          // Root box
          rootBox: 'w-full',
          
          // Remove default shadow (we add custom)
          cardBox: 'shadow-none',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
