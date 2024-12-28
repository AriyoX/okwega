"use client";

import { Compass } from "lucide-react";
import Link from "next/link";
import  Button  from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">Okwega</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-12 flex justify-center items-center space-x-10">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/success-stories" className="text-gray-600 hover:text-gray-900">
                Success Stories
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <Link href="/login">Sign In</Link>
              </Button>
            <Button>
              <Link href="/register">Get Started</Link>
              </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}