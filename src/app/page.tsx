"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-5xl font-bold mb-8">OzIntel</h1>
        <p className="text-xl mb-12">Personal Safety Alert System</p>

        <div className="space-y-4">
          <Link 
            href="/auth"
            className="block w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-medium"
          >
            Login / Register
          </Link>

          <Link 
            href="/settings"
            className="block w-full bg-gray-800 text-white py-5 rounded-2xl text-xl font-medium"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}