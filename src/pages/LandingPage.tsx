import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Group427320839 from "../components/HeroGraphics";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { UserMenu } from "@/components/auth/UserMenu";
import { useUserState } from "@/hooks/useUserState";

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <ResponsiveDm1 />
    </div>
  );
}

function ResponsiveDm1() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const { userState, isLoggedIn } = useUserState();
  const navigate = useNavigate();

  // Handle "Start practicing" button clicks
  const handleStartPracticing = () => {
    if (userState === 'not_logged_in') {
      // Not logged in - do nothing, AuthDialog will handle it
      return;
    } else if (userState === 'logged_in' || userState === 'premium') {
      // Logged in (free or premium) - go to practice page
      navigate('/practice');
    }
  };

  return (
    <div className="bg-[#fbfbfb] w-full">
      {/* Hero Section - Desktop12 */}
      <div className="bg-white relative w-full overflow-hidden border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          {/* Navigation */}
          <div className="flex items-center justify-between py-6 w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:gap-3">
              <svg
                className="w-8 h-7 lg:w-12 lg:h-11 shrink-0"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 53 48"
              >
                <path
                  d="M45.0379 0C51.1627 0 54.9872 6.62654 51.9177 11.9204L41.0495 30.6637C40.5418 31.5393 39.4195 31.8381 38.5429 31.331C37.6662 30.8239 37.3671 29.703 37.8748 28.8273L48.743 10.084C50.3961 7.23303 48.3364 3.6643 45.0379 3.6643C43.5102 3.66432 42.0983 4.47729 41.3327 5.79767L30.3497 24.7408C29.249 26.6393 29.2454 28.9802 30.3405 30.882L33.3731 36.1488C34.7788 38.59 34.7787 41.5937 33.3729 44.0348C30.3294 49.3195 22.6963 49.3223 19.6489 44.0398L1.06662 11.8288C-1.96768 6.56892 1.83324 0 7.91101 0C10.7297 1.871e-05 13.3349 1.5002 14.7472 3.93668L20.1168 13.2004C20.6243 14.0761 20.325 15.197 19.4483 15.704C18.5715 16.211 17.4493 15.912 16.9417 15.0363L11.5721 5.77263C10.8157 4.46778 9.42057 3.66432 7.91101 3.6643C4.65598 3.6643 2.62028 7.18238 4.2453 9.99937L22.8276 42.2104C24.463 45.0453 28.5594 45.0438 30.1927 42.2077C30.9472 40.8976 30.9473 39.2856 30.1929 37.9755L27.1603 32.7089C25.412 29.6726 25.4177 25.9355 27.1751 22.9044L38.1581 3.96131C39.5796 1.50956 42.2013 1.47685e-05 45.0379 0Z"
                  fill="#090909"
                />
              </svg>
              <p className="font-['JetBrains_Mono'] font-normal text-lg lg:text-2xl text-black">
                Vectorly
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 xl:gap-12 items-center">
              <a
                href="#practice"
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Practice
              </a>
              <a
                href="#dashboard"
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#features"
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex gap-4 items-center">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <AuthDialog defaultMode="login">
                    <button className="px-6 py-3 rounded-full border border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                      Sign In
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultMode="signup">
                    <button className="px-6 py-3 rounded-full bg-black font-bold text-sm text-white hover:bg-gray-800 transition-all">
                      Get started
                    </button>
                  </AuthDialog>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t py-4 space-y-4">
              <a href="#practice" className="block py-2 font-semibold text-sm hover:text-black transition-colors">
                Practice
              </a>
              <a href="#dashboard" className="block py-2 font-semibold text-sm hover:text-black transition-colors">
                Dashboard
              </a>
              <a href="#features" className="block py-2 font-semibold text-sm hover:text-black transition-colors">
                Features
              </a>
              <a href="#pricing" className="block py-2 font-semibold text-sm hover:text-black transition-colors">
                Pricing
              </a>
              <a href="#contact" className="block py-2 font-semibold text-sm hover:text-black transition-colors">
                Contact
              </a>
              {!user && (
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <AuthDialog defaultMode="login">
                    <button className="w-full px-6 py-3 rounded-full border border-black font-bold text-sm hover:bg-black hover:text-white transition-all">
                      Sign In
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultMode="signup">
                    <button className="w-full px-6 py-3 rounded-full bg-black font-bold text-sm text-white hover:bg-gray-800 transition-all">
                      Get started
                    </button>
                  </AuthDialog>
                </div>
              )}
            </div>
          )}

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-16">
            {/* Left Side - Hero Text */}
            <div className="flex flex-col gap-8 lg:gap-12">
              <h1 className="font-semibold leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                Master Mechanical Engineering Interview Success
              </h1>

              <p className="font-medium leading-relaxed text-gray-600 text-base lg:text-lg max-w-xl">
                The only platform designed specifically for ME students and new grads. Practice real interview questions, master essential theory, and land your dream internship.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button className="w-full sm:w-auto bg-black flex gap-6 items-center justify-center px-8 py-4 rounded-full hover:bg-gray-800 transition-colors">
                      <span className="font-bold text-sm text-white">
                        Start practicing
                      </span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 12H19"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </AuthDialog>
                ) : (
                  <button
                    onClick={handleStartPracticing}
                    className="w-full sm:w-auto bg-black flex gap-6 items-center justify-center px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-bold text-sm text-white">
                      Start practicing
                    </span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 12H19"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Exact Figma Graphics */}
            <div className="relative hidden md:block">
              <Group427320839 />
            </div>
          </div>

          {/* Universities Badge */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 items-start sm:items-center pb-12 lg:pb-16">
            <p className="font-semibold text-sm max-w-xs leading-relaxed">
              Questions asked at companies like:
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="h-8 w-24 bg-gray-300 rounded opacity-50" />
              <div className="h-8 w-28 bg-gray-300 rounded opacity-50" />
              <div className="h-8 w-24 bg-gray-300 rounded opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Sample Interview Questions Section */}
      <div className="bg-[#f8f6f6] w-full px-4 sm:px-8 lg:px-24 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl text-center mb-12 tracking-tight">
            Sample interview questions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Question Card 1 */}
            <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="bg-[#f34500] text-white text-xs font-medium px-3 py-2 rounded">
                  Hard
                </div>
                <p className="text-xs">
                  <span className="text-gray-900">Asked at:</span>
                  <span className="text-gray-500"> Boeing, SpaceX</span>
                </p>
              </div>

              <h3 className="text-xl lg:text-2xl font-semibold tracking-tight">
                Simply Supported Beam
              </h3>

              <div className="flex flex-wrap gap-3">
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Solid mechanics
                </span>
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Product design
                </span>
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Materials
                </span>
              </div>

              <div className="flex items-center gap-5">
                <p className="text-xs text-gray-500 flex-1 line-clamp-3">
                  A simply supported beam of length 5 m carries a point load of 10 N at midspan. Calculate the maximum deflection.
                </p>
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button type="button" className="bg-black rounded-full p-3 hover:bg-gray-800 transition-colors flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M12 5L19 12L12 19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </AuthDialog>
                ) : (
                  <button type="button" onClick={handleStartPracticing} className="bg-black rounded-full p-3 hover:bg-gray-800 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M12 5L19 12L12 19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Question Card 2 */}
            <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="bg-[#d1a106] text-white text-xs font-medium px-3 py-2 rounded">
                  Medium
                </div>
                <p className="text-xs">
                  <span className="text-gray-900">Asked at:</span>
                  <span className="text-gray-500"> Boeing, SpaceX</span>
                </p>
              </div>

              <h3 className="text-xl lg:text-2xl font-semibold tracking-tight">
                Simply Supported Beam
              </h3>

              <div className="flex flex-wrap gap-3">
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Solid mechanics
                </span>
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Product design
                </span>
                <span className="border border-gray-300 text-gray-500 text-xs font-medium px-3 py-2 rounded">
                  Materials
                </span>
              </div>

              <div className="flex items-center gap-5">
                <p className="text-xs text-gray-500 flex-1 line-clamp-3">
                  A simply supported beam of length 5 m carries a point load of 10 N at midspan. Calculate the maximum deflection.
                </p>
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button type="button" className="bg-black rounded-full p-3 hover:bg-gray-800 transition-colors flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M12 5L19 12L12 19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </AuthDialog>
                ) : (
                  <button type="button" onClick={handleStartPracticing} className="bg-black rounded-full p-3 hover:bg-gray-800 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <path d="M12 5L19 12L12 19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-[#bfbfbf] w-full px-4 sm:px-8 lg:px-24 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Free Plan */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Invisible spacer to match "MOST POPULAR" badge height on mobile */}
                <div className="h-8 mb-4 lg:block hidden" />

                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 lg:gap-8">
                      <p className="text-4xl lg:text-5xl font-black text-[#231d4f]">$0</p>
                      <p className="text-xl font-medium text-[#848199]">/month</p>
                    </div>
                    <h3 className="text-3xl font-black text-[#231d4f]">Free</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="#5243C2" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="#5243C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-[#848199]">20 problems per month</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="#5243C2" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="#5243C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-[#848199]">Basic progress tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="#5243C2" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="#5243C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-[#848199]">Community access</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 relative rounded-3xl text-lg font-black text-black text-center mt-8">
                  <div className="absolute bg-black inset-0 opacity-10 rounded-3xl" />
                  <span className="relative">Current plan</span>
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-black p-8 lg:p-12 flex flex-col">
                <div className="flex justify-end h-8 mb-4">
                  <span className="bg-[#99ea48] text-black text-xs font-black px-5 py-2 rounded-2xl tracking-wider h-fit">
                    MOST POPULAR
                  </span>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 lg:gap-8 text-white">
                      <p className="text-4xl lg:text-5xl font-black">$30</p>
                      <p className="text-xl font-medium">/month</p>
                    </div>
                    <h3 className="text-3xl font-black text-white">Premium</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="white" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-white">Unlimited problems</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="white" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-white">Advanced analytics</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="white" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-white">Industry-specific filters</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="white" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-white">Theory deep-dives</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 28 28">
                        <circle cx="14" cy="14" r="14" fill="white" opacity="0.1" />
                        <path d="M19 10L12 17L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-white">1-on-1 mentorship</p>
                    </div>
                  </div>
                </div>

                <AuthDialog defaultMode="signup">
                  <button className="w-full py-4 bg-white rounded-3xl text-lg font-black text-black hover:bg-gray-100 transition-colors text-center mt-8">
                    Choose plan
                  </button>
                </AuthDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Vectorly Works Section */}
      <div id="features" className="bg-neutral-50 w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
            <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight">
              Why Vectorly works
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Unlike generic coding platforms, we understand the unique challenges of mechanical engineering interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-center tracking-tight leading-snug">
                Comprehensive Problem Bank
              </h3>
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                Crowdsourced questions from real mechanical engineering interviews across all industries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-center tracking-tight leading-snug">
                Theory-Linked Learning
              </h3>
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                Every problem connects to essential theory, helping you understand the 'why' behind solutions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-center tracking-tight leading-snug">
                Industry-Specific Practice
              </h3>
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                Filter by automotive, aerospace, energy, and other ME specializations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
              <div className="flex justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-center tracking-tight leading-snug">
                Community-Driven
              </h3>
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                Real interview questions contributed by students and professionals in the field.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-[#bfbfbf] w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl text-center mb-12 tracking-tight">
            What students say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="none" viewBox="0 0 14 14">
                      <path d="M7 1.5L9 5.5L13.5 6L10 9.5L11 13.5L7 11L3 13.5L4 9.5L0.5 6L5 5.5L7 1.5Z" fill="#1C1B1F" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl font-normal tracking-tight leading-snug">
                  "Vectorly helped me land my Tesla internship! The theory-linked problems were exactly what I needed."
                </p>
              </div>
              <p className="text-xs leading-relaxed text-center">
                <span className="text-gray-700 font-medium">Sarah Chen</span>
                <br />
                <span className="text-gray-500">ME Student, UC Berkeley</span>
                <br />
                <span className="text-gray-500">Now at Tesla</span>
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="none" viewBox="0 0 14 14">
                      <path d="M7 1.5L9 5.5L13.5 6L10 9.5L11 13.5L7 11L3 13.5L4 9.5L0.5 6L5 5.5L7 1.5Z" fill="#1C1B1F" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl font-normal tracking-tight leading-snug">
                  "Finally, interview prep that actually understands mechanical engineering. Got offers from 3 companies!"
                </p>
              </div>
              <p className="text-xs leading-relaxed text-center">
                <span className="text-gray-700 font-medium">Marcus Rodriguez</span>
                <br />
                <span className="text-gray-500">Recent Graduate</span>
                <br />
                <span className="text-gray-500">Now at Ford</span>
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="none" viewBox="0 0 14 14">
                      <path d="M7 1.5L9 5.5L13.5 6L10 9.5L11 13.5L7 11L3 13.5L4 9.5L0.5 6L5 5.5L7 1.5Z" fill="#1C1B1F" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl font-normal tracking-tight leading-snug">
                  "The industry-specific filters saved me so much time. Focused prep for aerospace interviews worked perfectly."
                </p>
              </div>
              <p className="text-xs leading-relaxed text-center">
                <span className="text-gray-700 font-medium">Emily Johnson</span>
                <br />
                <span className="text-gray-500">ME Student, MIT</span>
                <br />
                <span className="text-gray-500">Now at Boeing</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white w-full px-4 sm:px-8 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#090909] rounded-2xl p-8 lg:p-16 text-center space-y-8">
            <div className="bg-white/20 inline-flex items-center gap-3 px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5" />
                <path d="M16 2L18 9L22 7L21 12L26 13L22 17L25 21L20 20L18 25L16 21L14 25L12 20L7 21L10 17L6 13L11 12L10 7L14 9L16 2Z" stroke="white" strokeWidth="1.5" />
              </svg>
              <span className="text-white text-sm font-light tracking-wider">START YOUR JOURNEY TODAY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-white">
              Ready to Ace Your Next Interview?
            </h2>

            <p className="text-xl sm:text-2xl lg:text-4xl font-light text-white max-w-3xl mx-auto">
              Join thousands of mechanical engineers who are mastering their skills and landing their dream jobs.
            </p>

            {userState === 'not_logged_in' ? (
              <AuthDialog defaultMode="signup">
                <button className="bg-white text-black px-10 py-5 rounded-full text-xl font-normal hover:bg-white/90 transition-colors border-2 border-white">
                  Start practicing now
                </button>
              </AuthDialog>
            ) : (
              <button
                onClick={handleStartPracticing}
                className="bg-white text-black px-10 py-5 rounded-full text-xl font-normal hover:bg-white/90 transition-colors border-2 border-white"
              >
                Start practicing now
              </button>
            )}

            <p className="text-[#dfdfdf] text-lg">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-neutral-50 w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl text-center mb-8 tracking-tight">
            Coming soon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#020609] rounded-2xl p-8 lg:p-12 flex items-center justify-center">
              <p className="text-3xl lg:text-4xl font-normal text-white text-center tracking-tight">
                Mock interviews
              </p>
            </div>
            <div className="bg-[#020609] rounded-2xl p-8 lg:p-12 flex items-center justify-center">
              <p className="text-3xl lg:text-4xl font-normal text-white text-center tracking-tight">
                Additional engineering majors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-neutral-50 w-full py-12 lg:py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1 space-y-6 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 53 48">
                  <path d="M45.0379 0C51.1627 0 54.9872 6.62654 51.9177 11.9204L41.0495 30.6637C40.5418 31.5393 39.4195 31.8381 38.5429 31.331C37.6662 30.8239 37.3671 29.703 37.8748 28.8273L48.743 10.084C50.3961 7.23303 48.3364 3.6643 45.0379 3.6643C43.5102 3.66432 42.0983 4.47729 41.3327 5.79767L30.3497 24.7408C29.249 26.6393 29.2454 28.9802 30.3405 30.882L33.3731 36.1488C34.7788 38.59 34.7787 41.5937 33.3729 44.0348C30.3294 49.3195 22.6963 49.3223 19.6489 44.0398L1.06662 11.8288C-1.96768 6.56892 1.83324 0 7.91101 0C10.7297 1.871e-05 13.3349 1.5002 14.7472 3.93668L20.1168 13.2004C20.6243 14.0761 20.325 15.197 19.4483 15.704C18.5715 16.211 17.4493 15.912 16.9417 15.0363L11.5721 5.77263C10.8157 4.46778 9.42057 3.66432 7.91101 3.6643C4.65598 3.6643 2.62028 7.18238 4.2453 9.99937L22.8276 42.2104C24.463 45.0453 28.5594 45.0438 30.1927 42.2077C30.9472 40.8976 30.9473 39.2856 30.1929 37.9755L27.1603 32.7089C25.412 29.6726 25.4177 25.9355 27.1751 22.9044L38.1581 3.96131C39.5796 1.50956 42.2013 1.47685e-05 45.0379 0Z" fill="#090909" />
                </svg>
                <span className="text-xl font-bold">Vectorly</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                We offer a platform for engineers to practice interview questions so that they can be better prepared for their job interviews.
              </p>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="#192031" viewBox="0 0 7 13">
                    <path d="M4.34375 12.957V7.04492H6.125L6.38281 4.82812H4.34375V3.41797C4.34375 2.78516 4.51172 2.35547 5.39062 2.35547H6.44922V0.378906C5.99609 0.326172 5.54297 0.300781 5.08984 0.300781C3.30859 0.300781 2.07812 1.38672 2.07812 3.16797V4.80078H0.300781V7.01758H2.10547V12.957H4.34375Z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="#192031" viewBox="0 0 16 13">
                    <path d="M14.3555 3.09375C14.3555 3.22266 14.3555 3.32422 14.3555 3.45312C14.3555 7.78906 11.043 12.7773 5.03906 12.7773C3.18359 12.7773 1.45312 12.2109 0 11.2812C0.257812 11.3086 0.515625 11.3359 0.800781 11.3359C2.34375 11.3359 3.78906 10.7969 4.92188 9.86719C3.46875 9.83984 2.21094 8.85547 1.82031 7.50781C2.02344 7.53516 2.22656 7.5625 2.42969 7.5625C2.71484 7.5625 3.02734 7.50781 3.3125 7.42578C1.79297 7.09766 0.648438 5.73828 0.648438 4.08594V4.03125C1.06641 4.26172 1.55859 4.39062 2.07812 4.41797C1.17969 3.81641 0.621094 2.78516 0.621094 1.60938C0.621094 0.964844 0.800781 0.375 1.10547 -0.132812C2.74219 1.86328 5.19531 3.14844 7.92969 3.27734C7.875 3.04688 7.84766 2.78906 7.84766 2.55859C7.84766 0.65625 9.375 -0.871094 11.2773 -0.871094C12.2617 -0.871094 13.1328 -0.476562 13.7617 0.148438C14.5508 -0.0273438 15.2852 -0.285156 15.9688 -0.679688C15.7109 0.121094 15.1719 0.9375 14.4648 1.45703C15.1719 1.37891 15.8516 1.19922 16.5039 0.9375C15.9961 1.78125 15.2891 2.51562 14.3555 3.09375Z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="#192031" viewBox="0 0 14 14">
                    <path d="M12.5195 0.214844H1.34766C0.691406 0.214844 0.171875 0.734375 0.171875 1.39062V12.5625C0.171875 13.2188 0.691406 13.7383 1.34766 13.7383H12.5195C13.1758 13.7383 13.6953 13.2188 13.6953 12.5625V1.39062C13.6953 0.734375 13.1758 0.214844 12.5195 0.214844ZM4.29688 11.7422H2.25781V5.30859H4.29688V11.7422ZM3.27734 4.42578C2.59375 4.42578 2.04688 3.87891 2.04688 3.19531C2.04688 2.51172 2.59375 1.96484 3.27734 1.96484C3.96094 1.96484 4.50781 2.51172 4.50781 3.19531C4.50781 3.87891 3.93359 4.42578 3.27734 4.42578ZM11.7891 11.7422H9.75V8.63281C9.75 7.89453 9.75 6.91016 8.68359 6.91016C7.61719 6.91016 7.43359 7.73438 7.43359 8.58594V11.7422H5.39453V5.30859H7.35156V6.15625H7.37891C7.66016 5.625 8.35547 5.09375 9.39453 5.09375C11.4609 5.09375 11.7891 6.5 11.7891 8.29297V11.7422Z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="#192031" viewBox="0 0 14 16">
                    <path d="M6.97656 0.0859375C3.11719 0.0859375 0 3.20312 0 7.0625C0 10.1875 1.99219 12.8438 4.77344 13.7734C5.11719 13.8281 5.23828 13.6172 5.23828 13.4336C5.23828 13.2773 5.23828 12.8711 5.23047 12.3281C3.29297 12.7344 2.88281 11.3984 2.88281 11.3984C2.56641 10.5781 2.10156 10.3672 2.10156 10.3672C1.47266 9.96094 2.15625 9.96875 2.15625 9.96875C2.83984 10.0234 3.22266 10.6523 3.22266 10.6523C3.85156 11.6914 4.86719 11.3711 5.26562 11.1875C5.32031 10.7227 5.53125 10.4023 5.74219 10.2188C4.17969 10.0352 2.53516 9.43359 2.53516 6.72656C2.53516 5.95703 2.80469 5.32812 3.23047 4.83594C3.17578 4.65234 2.91406 3.94141 3.28516 2.99219C3.28516 2.99219 3.88672 2.80859 5.23047 3.71094C5.80469 3.55469 6.38672 3.47266 6.97656 3.47266C7.56641 3.47266 8.14844 3.55469 8.72266 3.71094C10.0664 2.80859 10.668 2.99219 10.668 2.99219C11.0391 3.94141 10.7773 4.65234 10.7227 4.83594C11.1484 5.32812 11.418 5.95703 11.418 6.72656C11.418 9.44141 9.76562 10.0352 8.19531 10.2109C8.46484 10.4492 8.70703 10.8984 8.70703 11.5859C8.70703 12.5391 8.69922 13.3047 8.69922 13.4336C8.69922 13.6172 8.82031 13.8281 9.16406 13.7734C11.9453 12.8359 13.9375 10.1875 13.9375 7.0625C13.9375 3.20312 10.8281 0.0859375 6.97656 0.0859375Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-6">Navigation</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><a href="#practice" className="hover:text-black">Practice</a></li>
                <li><a href="#dashboard" className="hover:text-black">Dashboard</a></li>
                <li><a href="#features" className="hover:text-black">Features</a></li>
                <li><a href="#pricing" className="hover:text-black">Pricing</a></li>
              </ul>
            </div>

            {/* License */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-6">License</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><a href="#privacy" className="hover:text-black">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-black">Terms of use</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-6">Contact</h3>
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5" fill="#192031" viewBox="0 0 21 21">
                  <path d="M19.5 3.5C19.5 2.67188 18.8203 2 18 2H3C2.17188 2 1.5 2.67188 1.5 3.5V17C1.5 17.8281 2.17188 18.5 3 18.5H18C18.8203 18.5 19.5 17.8281 19.5 17V3.5ZM17.1562 4.625L10.5 9.59375L3.84375 4.625H17.1562ZM3.375 16.625V5.375L10.5 10.625L17.625 5.375V16.625H3.375Z" />
                </svg>
                <p className="text-sm text-gray-600">Hey@boostim.com</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom - Copyright */}
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2025 Vectorly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}