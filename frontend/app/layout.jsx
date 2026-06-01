import './globals.css'

export const metadata = {
  title: 'Task Management System',
  description: 'A simple task management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
