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
      <div className="bg-white relative w-full overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-[80px]">
          {/* Navigation */}
          <div className="flex items-center justify-between py-[30px] w-full">
            {/* Logo */}
            <div className="flex items-center gap-[10px]">
              <svg
                className="w-[53px] h-[48px] shrink-0"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 53 48"
              >
                <path
                  d="M45.0379 0C51.1627 0 54.9872 6.62654 51.9177 11.9204L41.0495 30.6637C40.5418 31.5393 39.4195 31.8381 38.5429 31.331C37.6662 30.8239 37.3671 29.703 37.8748 28.8273L48.743 10.084C50.3961 7.23303 48.3364 3.6643 45.0379 3.6643C43.5102 3.66432 42.0983 4.47729 41.3327 5.79767L30.3497 24.7408C29.249 26.6393 29.2454 28.9802 30.3405 30.882L33.3731 36.1488C34.7788 38.59 34.7787 41.5937 33.3729 44.0348C30.3294 49.3195 22.6963 49.3223 19.6489 44.0398L1.06662 11.8288C-1.96768 6.56892 1.83324 0 7.91101 0C10.7297 1.871e-05 13.3349 1.5002 14.7472 3.93668L20.1168 13.2004C20.6243 14.0761 20.325 15.197 19.4483 15.704C18.5715 16.211 17.4493 15.912 16.9417 15.0363L11.5721 5.77263C10.8157 4.46778 9.42057 3.66432 7.91101 3.6643C4.65598 3.6643 2.62028 7.18238 4.2453 9.99937L22.8276 42.2104C24.463 45.0453 28.5594 45.0438 30.1927 42.2077C30.9472 40.8976 30.9473 39.2856 30.1929 37.9755L27.1603 32.7089C25.412 29.6726 25.4177 25.9355 27.1751 22.9044L38.1581 3.96131C39.5796 1.50956 42.2013 1.47685e-05 45.0379 0Z"
                  fill="#090909"
                />
              </svg>
              <p className="font-['JetBrains_Mono:Regular',_sans-serif] font-normal text-[26px] text-black">
                Vectorly
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-[48px] items-center">
              <a
                href="#practice"
                className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#020407] text-[14px] hover:text-black transition-colors"
              >
                Practice
              </a>
              <a
                href="#dashboard"
                className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#020407] text-[14px] hover:text-black transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#features"
                className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#020407] text-[14px] hover:text-black transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#020407] text-[14px] hover:text-black transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#020407] text-[14px] hover:text-black transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex gap-[32px] items-center">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <AuthDialog defaultMode="login">
                    <button className="flex items-center justify-center px-[24px] py-[12px] rounded-[50px] border border-[#010205] font-['Manrope:Bold',_sans-serif] font-bold text-[16px] text-[#010205] hover:bg-black hover:text-white transition-all">
                      Sign In
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultMode="signup">
                    <button className="flex items-center justify-center px-[24px] py-[12px] rounded-[50px] bg-[#010205] font-['Manrope:Bold',_sans-serif] font-bold text-[16px] text-white hover:bg-gray-800 transition-all">
                      Get started
                    </button>
                  </AuthDialog>
                </>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center py-8 lg:py-16 min-h-[600px]">
            {/* Left Side - Hero Text */}
            <div className="flex flex-col gap-[48px] max-w-[700px]">
              <div className="flex flex-col gap-[32px]">
                <h1 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.1] text-[#010205] text-[48px] lg:text-[72px] tracking-[-2.16px]">
                  Master Mechanical Engineering Interview
                  Success
                </h1>
              </div>
              <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.8] text-[#878c91] text-[16px] max-w-[557px]">
                The only platform designed specifically for ME
                students and new grads. Practice real interview
                questions, master essential theory, and land
                your dream internship.
              </p>
              <div className="flex gap-[56px] items-center">
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button className="bg-[#010205] flex gap-[42px] items-center justify-center px-[32px] py-[16px] rounded-[70px] hover:bg-gray-800 transition-colors">
                      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.4] text-[16px] text-white tracking-[-0.32px]">
                        Start practicing
                      </p>
                      <svg
                        className="size-6"
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
                    className="bg-[#010205] flex gap-[42px] items-center justify-center px-[32px] py-[16px] rounded-[70px] hover:bg-gray-800 transition-colors"
                  >
                    <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[1.4] text-[16px] text-white tracking-[-0.32px]">
                      Start practicing
                    </p>
                    <svg
                      className="size-6"
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
            <div className="relative hidden lg:block">
              <Group427320839 />
            </div>
          </div>

          {/* Universities Badge */}
          <div className="flex flex-col sm:flex-row gap-[32px] lg:gap-[64px] items-start sm:items-center pb-12 lg:pb-16">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.6] text-[#010205] text-[14px] max-w-[206px]">
              Adopted by top universities
            </p>
            <div className="flex gap-[27.93px] items-start">
              <div className="h-[33.324px] w-[108.303px] bg-gray-300 rounded opacity-50" />
              <div className="h-[33.324px] w-[114.552px] bg-gray-300 rounded opacity-50" />
              <div className="h-[33.324px] w-[98.584px] bg-gray-300 rounded opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Sample Interview Questions Section */}
      <div className="bg-[#f8f6f6] w-full px-4 sm:px-8 lg:px-32 py-12 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.3] text-[#010205] text-[32px] sm:text-[40px] lg:text-[48px] tracking-[-1.44px] text-center mb-8">
            Sample interview questions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Card 1 */}
            <div className="bg-white p-6 lg:p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="bg-[#f34500] px-3 py-2 rounded-[4px]">
                  <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[14px] text-white">
                    Hard
                  </p>
                </div>
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[14px]">
                  <span className="text-[#252525]">
                    Asked at:
                  </span>
                  <span className="text-[#878c91]">
                    {" "}
                    Boeing, SpaceX
                  </span>
                </p>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.5] text-[#010205] text-[22px] lg:text-[26px] tracking-[-0.78px]">
                Simply Supported Beam
              </h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Solid mechanics
                </span>
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Product design
                </span>
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Materials
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#878c91] text-[14px] flex-1">
                  A simply supported beam of length 5 m carries
                  a point load of 10 N at midspan. Calculate the
                  maximum deflection.
                </p>
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button className="bg-[#010205] p-4 rounded-[70px] shrink-0 hover:bg-gray-800 transition-colors">
                      <svg
                        className="size-6"
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
                    className="bg-[#010205] p-4 rounded-[70px] shrink-0 hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="size-6"
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

            {/* Question Card 2 */}
            <div className="bg-white p-6 lg:p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="bg-[#d1a106] px-3 py-2 rounded-[4px]">
                  <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[14px] text-white">
                    Medium
                  </p>
                </div>
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[14px]">
                  <span className="text-[#252525]">
                    Asked at:
                  </span>
                  <span className="text-[#878c91]">
                    {" "}
                    Boeing, SpaceX
                  </span>
                </p>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.5] text-[#010205] text-[22px] lg:text-[26px] tracking-[-0.78px]">
                Simply Supported Beam
              </h3>
              <div className="flex flex-wrap gap-4">
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Solid mechanics
                </span>
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Product design
                </span>
                <span className="bg-white border border-[#c5c5c5] px-3 py-2 rounded-[4px] font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#7a7a7a] text-[14px]">
                  Materials
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#878c91] text-[14px] flex-1">
                  A simply supported beam of length 5 m carries
                  a point load of 10 N at midspan. Calculate the
                  maximum deflection.
                </p>
                {userState === 'not_logged_in' ? (
                  <AuthDialog defaultMode="signup">
                    <button className="bg-[#010205] p-4 rounded-[70px] shrink-0 hover:bg-gray-800 transition-colors">
                      <svg
                        className="size-6"
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
                    className="bg-[#010205] p-4 rounded-[70px] shrink-0 hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="size-6"
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
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        id="pricing"
        className="bg-[#bfbfbf] flex flex-col items-center justify-center h-[795px] relative shrink-0 w-full"
      >
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative">
          {/* Table Background */}
          <div className="[grid-area:1_/_1] bg-white h-[643.864px] rounded-[35.847px] w-[785.872px]" />

          {/* Free Plan */}
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[55.149px] mt-[55.149px] place-items-start relative">
            {/* Title and Price */}
            <div className="[grid-area:1_/_1] h-[121.328px] ml-0 mt-[90.996px] overflow-clip relative w-[319.864px]">
              <p className="absolute font-['Avenir:Heavy',_sans-serif] leading-[normal] left-0 not-italic text-[#231d4f] text-[38.604px] text-nowrap top-[calc(50%-60.664px)] whitespace-pre">
                Free
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[63.421px] ml-0 mt-0 not-italic overflow-clip relative text-nowrap w-[179.234px] whitespace-pre">
              <p className="absolute font-['Avenir:Heavy',_sans-serif] leading-[63.421px] left-0 text-[#231d4f] text-[49.634px] top-[calc(50%-31.711px)]">
                $0
              </p>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[56.92%] text-[#848199] text-[23.438px] top-[calc(50%-8.272px)]">
                /month
              </p>
            </div>

            {/* List Items */}
            <div className="[grid-area:1_/_1] h-[28.953px] ml-0 mt-[223.353px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="#5243C2"
                    opacity="0.103693"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="#5243C2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[#848199] text-[20.681px] top-[calc(50%-14.477px)]">
                20 problems per month
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-0 mt-[266.094px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="#5243C2"
                    opacity="0.103693"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="#5243C2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[#848199] text-[20.681px] top-[calc(50%-14.477px)]">
                Basic progress tracking
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-0 mt-[308.834px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="#5243C2"
                    opacity="0.103693"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="#5243C2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[#848199] text-[20.681px] top-[calc(50%-14.477px)]">
                Community access
              </p>
            </div>

            {/* Button */}
            <div className="[grid-area:1_/_1] h-[62.043px] ml-0 mt-[485.311px] overflow-clip relative w-[285.396px]">
              <div className="absolute bg-[#010101] inset-0 opacity-10 rounded-[33.089px]" />
              <p className="absolute font-['Avenir:Heavy',_sans-serif] leading-[normal] left-[28.5%] not-italic text-[#010101] text-[20.681px] text-center text-nowrap top-[calc(50%-13.098px)] whitespace-pre">
                Current plan
              </p>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[394.315px] mt-0 place-items-start relative">
            {/* Black Background */}
            <div className="[grid-area:1_/_1] bg-black h-[643.864px] ml-0 mt-0 rounded-[35.847px] w-[391.557px]" />

            {/* Most Popular Badge */}
            <div className="[grid-area:1_/_1] h-[37.225px] ml-[208.187px] mt-[13.787px] overflow-clip relative w-[166.826px]">
              <div className="absolute bg-[#99ea48] inset-0 rounded-[18.613px]" />
              <p className="absolute font-['Avenir:Heavy',_sans-serif] leading-[normal] left-[13.22%] not-italic text-[#1e1e1e] text-[13.787px] text-center text-nowrap top-[calc(50%-8.962px)] tracking-[1.1489px] whitespace-pre">
                MOST POPULAR
              </p>
            </div>

            {/* Title */}
            <div className="[grid-area:1_/_1] box-border flex gap-[13.787px] items-center justify-center ml-[41.362px] mt-[146.145px] overflow-clip relative">
              <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic text-[38.604px] text-nowrap text-white whitespace-pre">
                Premium
              </p>
            </div>

            {/* Price */}
            <div className="[grid-area:1_/_1] h-[63.421px] ml-[41.362px] mt-[55.149px] not-italic overflow-clip relative text-nowrap text-white w-[209.566px] whitespace-pre">
              <p className="absolute font-['Avenir:Heavy',_sans-serif] leading-[63.421px] left-0 text-[49.634px] top-[calc(50%-31.711px)]">
                $30
              </p>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[63.16%] text-[23.438px] top-[calc(50%-8.272px)]">
                /month
              </p>
            </div>

            {/* List Items */}
            <div className="[grid-area:1_/_1] h-[28.953px] ml-[41.362px] mt-[257.564px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="white"
                    opacity="0.1"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[20.681px] text-white top-[calc(50%-14.477px)]">
                Unlimited problems
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-[41.362px] mt-[300.305px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="white"
                    opacity="0.1"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[20.681px] text-white top-[calc(50%-14.477px)]">
                Advanced analytics
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-[41.362px] mt-[343.046px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="white"
                    opacity="0.1"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[20.681px] text-white top-[calc(50%-14.477px)]">
                Industry-specific filters
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-[41.362px] mt-[428.783px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="white"
                    opacity="0.1"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[20.681px] text-white top-[calc(50%-14.477px)]">
                Theory deep-dives
              </p>
            </div>
            <div className="[grid-area:1_/_1] h-[28.953px] ml-[41.362px] mt-[386.043px] overflow-clip relative w-[285.396px]">
              <div className="absolute bottom-0 left-0 right-[90.34%] top-[4.76%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 28 28"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="14"
                    fill="white"
                    opacity="0.1"
                  />
                  <path
                    d="M19 10L12 17L9 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="absolute font-['Avenir:Medium',_sans-serif] leading-[normal] left-[14.49%] not-italic text-[20.681px] text-white top-[calc(50%-14.477px)]">
                1-on-1 mentorship
              </p>
            </div>

            {/* Button */}
            <div className="[grid-area:1_/_1] h-[62.043px] ml-[41.362px] mt-[540.46px] overflow-clip relative w-[319.864px]">
              <AuthDialog defaultMode="signup">
                <button className="absolute bg-white inset-0 rounded-[33.089px] hover:bg-gray-100 transition-colors">
                  <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic text-[20.681px] text-black text-center text-nowrap">
                    Choose plan
                  </p>
                </button>
              </AuthDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Why Vectorly Works Section */}
      <div
        id="features"
        className="bg-neutral-50 w-full px-4 sm:px-8 lg:px-20 py-12 lg:py-20"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.3] text-[#010205] text-[32px] sm:text-[40px] lg:text-[48px] tracking-[-1.44px] mb-6">
              Why Vectorly works
            </h2>
            <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.8] text-[#878c91] text-[16px] lg:text-[21px] max-w-[846px] mx-auto">
              Unlike generic coding platforms, we understand the
              unique challenges of mechanical engineering
              interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Import Contacts Icon */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6 text-center">
              <div className="flex justify-center">
                <svg
                  className="size-12"
                  viewBox="0 0 24 24"
                  fill="#1C1B1F"
                >
                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                  <path d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-.69 0-1.52.08-2.3.19v1.51c.72-.11 1.54-.2 2.3-.2zM15.2 13.2v1.5c.76-.11 1.58-.2 2.3-.2.88 0 1.73.09 2.5.26V13.24c-.79-.15-1.64-.24-2.5-.24-.69 0-1.52.08-2.3.2zM17.5 16.5c-.88 0-1.73.09-2.5.26V15.24c.79-.15 1.64-.24 2.5-.24.69 0 1.52.08 2.3.19v1.51c-.72-.11-1.54-.2-2.3-.2z"/>
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                Comprehensive Problem Bank
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#373737] text-[14px]">
                Crowdsourced questions from real mechanical
                engineering interviews across all industries.
              </p>
            </div>

            {/* Feature 2 - Adjust/Target Icon */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6 text-center">
              <div className="flex justify-center">
                <svg
                  className="size-12"
                  viewBox="0 0 24 24"
                  fill="#1C1B1F"
                >
                  <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                Theory-Linked Learning
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#373737] text-[14px]">
                Every problem connects to essential theory,
                helping you understand the 'why' behind
                solutions.
              </p>
            </div>

            {/* Feature 3 - Trending Up Icon */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6 text-center">
              <div className="flex justify-center">
                <svg
                  className="size-12"
                  viewBox="0 0 24 24"
                  fill="#1C1B1F"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                Industry-Specific Practice
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#373737] text-[14px]">
                Filter by automotive, aerospace, energy, and
                other ME specializations.
              </p>
            </div>

            {/* Feature 4 - Group Icon */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-6 text-center">
              <div className="flex justify-center">
                <svg
                  className="size-12"
                  viewBox="0 0 24 24"
                  fill="#1C1B1F"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                Community-Driven
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[#373737] text-[14px]">
                Real interview questions contributed by students
                and professionals in the field.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-[#bfbfbf] w-full px-4 sm:px-8 lg:px-20 py-12 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.3] text-[#010205] text-[32px] sm:text-[40px] lg:text-[48px] tracking-[-1.44px] text-center mb-12 lg:mb-20">
            What students say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-8">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="size-4"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1.5L10 5.5L14.5 6L11 9.5L12 14L8 11.5L4 14L5 9.5L1.5 6L6 5.5L8 1.5Z"
                        fill="#1C1B1F"
                      />
                    </svg>
                  ))}
                </div>
                <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                  "Vectorly helped me land my Tesla internship!
                  The theory-linked problems were exactly what I
                  needed."
                </p>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[14px]">
                  <span className="text-[#373737]">
                    Sarah Chen
                  </span>
                  <br />
                  <span className="text-[#878c91]">
                    ME Student, UC Berkeley
                    <br />
                    Now at Tesla
                  </span>
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-8">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="size-4"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1.5L10 5.5L14.5 6L11 9.5L12 14L8 11.5L4 14L5 9.5L1.5 6L6 5.5L8 1.5Z"
                        fill="#1C1B1F"
                      />
                    </svg>
                  ))}
                </div>
                <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                  "Finally, interview prep that actually
                  understands mechanical engineering. Got offers
                  from 3 companies!"
                </p>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[14px]">
                  <span className="text-[#373737]">
                    Marcus Rodriguez
                  </span>
                  <br />
                  <span className="text-[#878c91]">
                    Recent Graduate
                    <br />
                    Now at Ford
                  </span>
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] space-y-8 md:col-span-2 lg:col-span-1">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="size-4"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1.5L10 5.5L14.5 6L11 9.5L12 14L8 11.5L4 14L5 9.5L1.5 6L6 5.5L8 1.5Z"
                        fill="#1C1B1F"
                      />
                    </svg>
                  ))}
                </div>
                <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.5] text-[#010205] text-[20px] lg:text-[22px] tracking-[-0.66px]">
                  "The industry-specific filters saved me so
                  much time. Focused prep for aerospace
                  interviews worked perfectly."
                </p>
              </div>
              <div>
                <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[1.6] text-[14px]">
                  <span className="text-[#373737]">
                    Emily Johnson
                  </span>
                  <br />
                  <span className="text-[#878c91]">
                    ME Student, MIT
                    <br />
                    Now at Boeing
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white w-full px-4 sm:px-8 py-12 lg:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#090909] rounded-[16px] p-8 sm:p-12 lg:p-16 space-y-8 lg:space-y-12 text-center">
            <div className="bg-[rgba(255,255,255,0.22)] inline-flex items-center gap-3 px-6 py-3 rounded-[54px]">
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 2L14 7L17 5L16 9L20 10L17 13L19 16L15 15L14 19L12 16L10 19L9 15L5 16L7 13L4 10L8 9L7 5L10 7L12 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="font-['Inter:Light',_sans-serif] font-light text-[14px] lg:text-[18px] text-white">
                START YOUR JOURNEY TODAY
              </p>
            </div>

            <h2 className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-white text-[32px] sm:text-[48px] lg:text-[65px]">
              Ready to Ace Your Next Interview?
            </h2>

            <p className="font-['Inter:Light',_sans-serif] font-light text-white text-[24px] sm:text-[32px] lg:text-[47px] max-w-[1040px] mx-auto">
              Join thousands of mechanical engineers who are
              mastering their skills and landing their dream
              jobs.
            </p>

            {userState === 'not_logged_in' ? (
              <AuthDialog defaultMode="signup">
                <button className="bg-white text-black px-10 py-5 rounded-[47px] border-[3px] border-white font-['Inter:Regular',_sans-serif] font-normal text-[20px] lg:text-[24px] hover:bg-gray-100 transition-colors">
                  Start practicing now
                </button>
              </AuthDialog>
            ) : (
              <button
                onClick={handleStartPracticing}
                className="bg-white text-black px-10 py-5 rounded-[47px] border-[3px] border-white font-['Inter:Regular',_sans-serif] font-normal text-[20px] lg:text-[24px] hover:bg-gray-100 transition-colors"
              >
                Start practicing now
              </button>
            )}

            <p className="font-['Inter:Light',_sans-serif] font-light text-[#dfdfdf] text-[16px] lg:text-[22px] max-w-[1040px] mx-auto">
              No credit card required • Free forever • Cancel
              anytime
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white w-full px-4 sm:px-8 lg:px-20 py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.3] text-[#010205] text-[32px] sm:text-[40px] lg:text-[48px] tracking-[-1.44px] text-center mb-12">
            Coming soon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
            <div className="bg-[#020609] rounded-[10px] p-8 text-center">
              <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] text-white text-[28px] sm:text-[32px] lg:text-[40px] tracking-[-1.2px]">
                Mock interviews
              </p>
            </div>
            <div className="bg-[#020609] rounded-[10px] p-8 text-center">
              <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[1.3] text-white text-[28px] sm:text-[32px] lg:text-[40px] tracking-[-1.2px]">
                Additional engineering majors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-[#010205] w-full px-4 sm:px-8 lg:px-20 py-12 lg:py-16"
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Column 1 - Logo & About */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <svg
                  className="size-8"
                  fill="none"
                  viewBox="0 0 53 48"
                >
                  <path
                    d="M45.0379 0C51.1627 0 54.9872 6.62654 51.9177 11.9204L41.0495 30.6637C40.5418 31.5393 39.4195 31.8381 38.5429 31.331C37.6662 30.8239 37.3671 29.703 37.8748 28.8273L48.743 10.084C50.3961 7.23303 48.3364 3.6643 45.0379 3.6643C43.5102 3.66432 42.0983 4.47729 41.3327 5.79767L30.3497 24.7408C29.249 26.6393 29.2454 28.9802 30.3405 30.882L33.3731 36.1488C34.7788 38.59 34.7787 41.5937 33.3729 44.0348C30.3294 49.3195 22.6963 49.3223 19.6489 44.0398L1.06662 11.8288C-1.96768 6.56892 1.83324 0 7.91101 0C10.7297 1.871e-05 13.3349 1.5002 14.7472 3.93668L20.1168 13.2004C20.6243 14.0761 20.325 15.197 19.4483 15.704C18.5715 16.211 17.4493 15.912 16.9417 15.0363L11.5721 5.77263C10.8157 4.46778 9.42057 3.66432 7.91101 3.6643C4.65598 3.6643 2.62028 7.18238 4.2453 9.99937L22.8276 42.2104C24.463 45.0453 28.5594 45.0438 30.1927 42.2077C30.9472 40.8976 30.9473 39.2856 30.1929 37.9755L27.1603 32.7089C25.412 29.6726 25.4177 25.9355 27.1751 22.9044L38.1581 3.96131C39.5796 1.50956 42.2013 1.47685e-05 45.0379 0Z"
                    fill="white"
                  />
                </svg>
                <p className="font-['JetBrains_Mono:Regular',_sans-serif] font-normal text-[20px] text-white">
                  Vectorly
                </p>
              </div>
              <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal text-[14px] text-gray-400 leading-relaxed">
                The premier platform for mechanical engineering
                interview preparation.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div>
              <h4 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-white text-[16px] mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#practice"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Practice
                  </a>
                </li>
                <li>
                  <a
                    href="#dashboard"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h4 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-white text-[16px] mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Legal */}
            <div>
              <h4 className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-white text-[16px] mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#privacy"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] text-[14px] text-gray-400">
              © 2025 Vectorly. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#twitter"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="size-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#linkedin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="size-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#github"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="size-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}