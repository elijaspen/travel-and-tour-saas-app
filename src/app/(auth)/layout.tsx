import * as React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      {/* Left Side - Image & Branding */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        {/* TODO: Replace hardcoded URL with dynamic destination images from DB Storage*/}
        <div 
          className="absolute inset-0 bg-zinc-900 bg-cover bg-center mix-blend-multiply opacity-80" 
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop)` }}
        />
        
        <Link 
          href="/" 
          className="relative z-20 flex items-center text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity w-fit"
        >
          WorkWanders
        </Link>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &quot;Unlock exclusive savings for your next trip. Join thousands of travelers and get insider tips delivered to your inbox.&quot;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="p-8 lg:p-8 flex h-full items-center">
        {children}
      </div>
    </div>
  )
}