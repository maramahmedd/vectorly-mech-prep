import svgPaths from "./legacy/svg-ynaxnms09e";
import imgImage60 from "../assets/5a7431cee3e40d481d271a4e45fcd0fb7d2b23f2.png";

export default function HeroGraphics() {
  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Main grey backdrop with unique rounded corners */}
      <div className="absolute backdrop-blur-[42px] backdrop-filter bg-[rgba(0,0,0,0.2)] h-[275px] w-[303px] rounded-bl-[20px] rounded-br-[20px] rounded-tl-[1000px] rounded-tr-[20px] left-0 top-0" />
      
      {/* Stats Card */}
      <div className="absolute left-[327px] top-0">
        {/* Stats Background */}
        <div className="absolute backdrop-blur-[42px] backdrop-filter bg-[#f0f0f0] h-[281px] w-[259px] rounded-[20px]" />
        
        {/* Progress Bar */}
        <div className="absolute left-[24px] top-[241px] w-[211px]">
          <svg className="block w-full h-[8px]" fill="none" preserveAspectRatio="none" viewBox="0 0 211 8">
            <path d="M0 4H211" stroke="#D9D9D9" strokeWidth="6.65" />
            <path d="M0 4H141" stroke="black" strokeWidth="6.65" />
          </svg>
        </div>
        
        {/* Stats Text */}
        <div className="absolute left-[25px] top-[0px] flex flex-col gap-[30px]">
          <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold text-[#010205] text-[84px] leading-[1.5] tracking-[-2.52px]">230+</p>
          <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium text-[#5c5d5f] text-[16px] w-[211px] leading-[1.5]">curated interview questions asked at top companies</p>
        </div>
      </div>

      {/* Testimony Card */}
      <div className="absolute left-0 top-[299px] w-[588px] h-[216px]">
        {/* Testimony Background */}
        <div className="absolute backdrop-blur-[42px] backdrop-filter bg-[#010205] h-[216px] w-[588px] rounded-[20px] overflow-hidden" />
        
        {/* Rotated Background Image */}
        {/* <div className="absolute left-[-180px] top-[-107px] w-[493px] h-[323px] overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[115.475deg]">
            <div className="h-[323px] w-[493px] rounded-[20px] overflow-hidden opacity-60">
              <img alt="" className="absolute h-[130%] left-[-21%] top-[-30%] w-[128%] max-w-none" src={imgImage60} />
            </div>
          </div>
        </div> */}
        
        {/* Testimony Content */}
        <div className="absolute left-[33px] top-[24px] flex flex-col gap-[24px] w-[522px] z-10">
          {/* Testimony Label */}
          <div className="flex gap-[13px] items-center">
            <svg className="w-[54px] h-[1px]" fill="none" viewBox="0 0 54 2">
              <path d="M0 1H54" stroke="white" />
            </svg>
            <p className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.26] text-[14px] text-white tracking-[-0.42px]">Testimony</p>
          </div>
          
          {/* Quote */}
          <p className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.3] text-[32px] text-white tracking-[-0.64px] max-w-[280px]">"Had been waiting for something like this..."</p>
          
          {/* Attribution */}
          <p className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[1.26] text-[14px] text-right text-white tracking-[-0.42px]">UC Berkeley Student</p>
        </div>
        
        {/* Green Bars - positioned at bottom right inside testimony card */}
        <div className="absolute bottom-0 right-[24px] flex gap-[10px] items-end z-10 h-[166px]">
          <div className="bg-[#bae289] h-[95px] w-[69px] rounded-tl-[4px] rounded-tr-[4px]" />
          <div className="bg-[#99cf63] h-[136px] w-[69px] rounded-tl-[4px] rounded-tr-[4px]" />
          <div className="bg-[#77b248] h-[166px] w-[69px] rounded-tl-[4px] rounded-tr-[4px]" />
        </div>
      </div>

      {/* Book Icon Circle */}
      <div className="absolute left-[155px] top-[-32px] size-[108px] z-20">
        <div className="absolute bg-[#010205] inset-0 rounded-full shadow-[0px_30.076px_50.582px_-6.835px_rgba(0,0,0,0.44)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
            <mask height="60" id="mask0_1_671" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="60" x="0" y="0">
              <rect fill="#D9D9D9" height="60" width="60" />
            </mask>
            <g mask="url(#mask0_1_671)">
              <path d={svgPaths.p1ca15e00} fill="#99CF63" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
