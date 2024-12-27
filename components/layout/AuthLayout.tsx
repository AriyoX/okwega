"use client"

import React from 'react'
import { Compass } from 'lucide-react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#1e40af]">
      {/* Logo Section - Hidden on mobile */}
      <div className="hidden md:flex w-1/3 items-center justify-center">
        <Link 
          href="/" 
          className="relative flex items-center justify-center"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-110 origin-center">
            <Compass className="h-16 w-16 text-[#1e40af]" />
          </div>
        </Link>
      </div>
      
      {/* Content Section */}
      <div className="w-full md:w-2/3 bg-white p-12 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo - Shown only on mobile */}
          <div className="flex md:hidden justify-center mb-4">
            <Link href="/">
                <div className="flex items-center mr-2">
                    <div className="w-16 h-16 text-[#1e40af] rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-110">
                        <Compass className="h-10 w-10 text-[#1e40af]" />
                    </div>
                    <span className="text-2xl font-bold text-[#1e40af]">Okwega</span>
                </div>
            </Link>
          </div>
          <hr className="md:hidden h-px my-6 bg-gray-200 border-0" />

          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}