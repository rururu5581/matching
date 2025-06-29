import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "morich Optimal Matcher",
  description: "An internal tool for morich inc. consultants to accurately match job seekers with the best job opportunities using AI analysis. It streamlines the matching process by evaluating resumes against job descriptions based on multiple key criteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 font-sans text-gray-800">{children}</body>
    </html>
  );
}