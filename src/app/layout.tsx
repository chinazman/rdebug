import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RDebug - 埋点搜集系统",
  description: "简单的网站异常和DOM结构搜集系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 使用国内CDN字体，如果加载失败会自动回退到系统字体 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
} 