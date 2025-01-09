"use client";

import { Compass } from "lucide-react";
import Link from "next/link";
import  Button  from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-md">
      <div className="w-full"> {/* Make the navbar container full width */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo Section (remains on the left) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">Okwega</span>
            </Link>
          </div>

          {/* Navigation Links (centered relative to the whole page) */}
          <div className="hidden md:flex justify-center items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-10">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Features
              </Link>
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Success Stories
              </Link>
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Pricing
              </Link>
            </div>
          </div>

          {/* Actions Section (remains on the right) */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors duration-200">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}