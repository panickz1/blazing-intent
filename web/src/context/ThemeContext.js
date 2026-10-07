"use client";
import { ThemeProvider } from "next-themes";

export default function ThemeContextProvider({ children, ...props }) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
