// import './globals.css'
// import type { Metadata } from 'next'
// import localFont from 'next/font/local'

// const inter = localFont({
//   src: [
//     {
//       path: '/fonts/Inter-Regular.woff2',
//       weight: '500',
//       style: 'latin',
//     },
//   ],
//   display: 'swap', // Improves performance
//   variable: '--font-inter', // Optional: CSS variable
// })

// export const metadata: Metadata = {
//   title: 'Nexus',
//   description: 'Manage your finances with ease',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }



//////////////////////////////////////////////////////////// this is the google version and the stuff above is without wifi!

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Recommended for performance
  variable: '--font-inter', // Optional: CSS variable
})

export const metadata: Metadata = {
  title: 'Nexus',
  description: 'Manage your finances with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
