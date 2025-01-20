import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1>タイムトラッカー</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
