// For App Router (app/layout.tsx)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="..." suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}