'use client'
import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { BsChatDots } from 'react-icons/bs';
import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TextsLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BsChatDots className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Ezilogs</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a>
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">Login</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden">
            <div className="px-6 py-4 space-y-4">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">FAQ</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Support</a>
              <a href="/login" className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-center">Login</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-20 h-[80vh]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Every&nbsp;
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              transactions
            </span>
            <br />
            In one clean log
          </h1>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={()=>router.push('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl animate-bounce duration-3000">
              Checkout Ezilogs →
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-400">
            <span>Free for 10 accounts.</span>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
              See plans
            </a>
          </div>
        </div>
      </main>

<div className='flex items-center mx-auto justify-center w-[80vw]'>
    <Image
    className='rounded-lg'
        src="/home.png"
        alt="Hero image"
        width={1000}
        height={800}
        priority // Use for above-the-fold images
      />

</div>

      {/* Floating Elements for Visual Appeal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      {/* Footer */}
      <footer className="mt-32 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BsChatDots className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Texts</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The ultimate CMS platform that records and organize all ur transactions together in one beautiful, unified logs.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Downloads</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Integrations</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Status</a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Ezilogs. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ by Bibesh Basnet @ Digitech Enterprises.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}