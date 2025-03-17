import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <nav className="fixed top-0 right-0 left-0 p-4 bg-white dark:bg-gray-900 shadow-md flex justify-between">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              YT Converter
            </h1>
            <ThemeSwitcher />
          </nav>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
