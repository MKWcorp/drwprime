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
                headerSubtitle: "hidden",                socialButtonsBlockButton: 
                  "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30 hover:text-primary-light transition-colors",
                formButtonPrimary: 
                  "bg-gradient-to-r from-primary to-primary-light text-black font-semibold hover:shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all",
                formFieldInput: 
                  "bg-gray-800/50 border-primary/30 text-white placeholder-gray-400 focus:border-primary focus:ring-primary/50 focus:bg-gray-700/50 transition-colors",
                formFieldLabel: "text-primary font-medium",
                footerActionLink: "text-primary hover:text-primary-light transition-colors",
                identityPreviewText: "text-white",
                formFieldInputShowPasswordButton: "text-primary hover:text-primary-light",                formFieldSuccessText: "text-primary",
                formFieldErrorText: "text-red-400",
                otpCodeFieldInput: 
                  "bg-gray-800/50 border-primary/30 text-white focus:border-primary focus:ring-primary/50",
                alertText: "text-white/90",
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
            forceRedirectUrl="/my-prime"
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
