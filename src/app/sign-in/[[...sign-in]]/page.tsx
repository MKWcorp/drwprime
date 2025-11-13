import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/drwprime-logo.png"
              alt="DRW Prime Logo"
              width={200}
              height={60}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="font-playfair text-3xl font-bold text-primary mb-2">
            Admin Portal
          </h1>
          <p className="text-white/70">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Sign In Component with Custom Styling */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-2xl shadow-primary/10">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "bg-primary/20 border-primary/30 text-white hover:bg-primary/30",
                formButtonPrimary: 
                  "bg-gradient-to-r from-primary to-primary-light text-dark hover:shadow-lg hover:shadow-primary/30",
                formFieldInput: 
                  "bg-black/50 border-primary/30 text-white focus:border-primary",
                formFieldLabel: "text-white/90",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-white",
                formFieldInputShowPasswordButton: "text-primary",
                formFieldSuccessText: "text-primary",
                formFieldErrorText: "text-red-400",
                otpCodeFieldInput: 
                  "bg-black/50 border-primary/30 text-white focus:border-primary",
                alertText: "text-white/90",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>

        {/* Back to Home Link */}
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
