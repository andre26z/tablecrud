export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#121212] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}