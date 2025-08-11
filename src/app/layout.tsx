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
        {/* 已移除 Google Fonts，默认使用系统中文字体族，避免在中国大陆加载失败 */}
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
} 