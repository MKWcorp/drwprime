import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">          <Link href="/" className="inline-block">
            <Image
              src="/drwprime-logo.png"
              alt="DRW Prime Logo"
              width={200}
              height={60}
              className="mx-auto"
            />
          </Link>
        </div>        {/* Sign Up Component with Dark Theme & Gold Accents */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-2xl p-8 shadow-2xl shadow-primary/20">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                
                // Social buttons (Google, etc) - terang dan kontras
                socialButtonsBlockButton: 
                  "bg-white/10 border-primary/50 text-white hover:bg-primary/20 hover:border-primary hover:text-primary transition-colors",
                socialButtonsBlockButtonText: "text-white font-medium",
                
                // Primary button (Sign Up/Continue)
                formButtonPrimary: 
                  "bg-gradient-to-r from-primary to-primary-light text-black font-semibold hover:shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all",
                
                // Input fields - lebih terang
                formFieldInput: 
                  "bg-white/10 border-primary/40 text-white placeholder-gray-300 focus:border-primary focus:ring-primary/50 focus:bg-white/15 transition-colors",
                formFieldLabel: "text-white font-medium",
                
                // Links
                footerActionLink: "text-primary hover:text-primary-light transition-colors font-medium",
                footerActionText: "text-white/70",
                
                // Text elements
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-primary hover:text-primary-light",
                formHeaderTitle: "text-white",
                formHeaderSubtitle: "text-white/70",
                
                // Divider
                dividerLine: "bg-white/20",
                dividerText: "text-white/50",
                
                // Password visibility button
                formFieldInputShowPasswordButton: "text-white/70 hover:text-primary",
                
                // Status messages
                formFieldSuccessText: "text-primary",
                formFieldErrorText: "text-red-400",
                
                // OTP input
                otpCodeFieldInput: 
                  "bg-white/10 border-primary/40 text-white focus:border-primary focus:ring-primary/50",
                
                // Alert boxes
                alertText: "text-white",
                alert: "bg-white/10 border-primary/30",
                
                // Internal card elements
                main: "text-white",
                formFieldAction: "text-primary hover:text-primary-light",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/my-prime"
          />
        </div>        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="text-white/70 hover:text-primary transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
