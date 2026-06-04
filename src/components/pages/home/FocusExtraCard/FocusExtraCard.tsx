/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';

/**
 * TYPES & INTERFACES
 */
interface FocusCardData {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'legality' | 'sell' | 'rent';
}

interface TopCardData {
  title: string;
  description: string;
}

interface FocusExtraCardProps {
  heading?: string;
  subheading?: string;
  topCards?: TopCardData[];
  focusCards?: FocusCardData[];
}

/**
 * SVG ICONS (keeping your existing icons)
 */
const BookOpenIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" className={className}>
  <path d="M18.5549 36.0547C14.6113 31.7129 9.26316 28.9006 3.45101 28.1123C2.78946 28.0391 2.17847 27.7234 1.73597 27.2262C1.29347 26.729 1.05082 26.0856 1.05486 25.42V3.7467C1.05483 3.35781 1.13905 2.97354 1.30172 2.62032C1.46439 2.26709 1.70164 1.9533 1.99717 1.70052C2.28748 1.45235 2.62728 1.26878 2.99399 1.16201C3.3607 1.05525 3.74593 1.02773 4.12409 1.08129C9.6818 2.0037 14.766 4.77349 18.5549 8.9429V36.0547Z" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M18.5519 36.0547C22.4955 31.7129 27.8436 28.9006 33.6557 28.1123C34.3173 28.0391 34.9283 27.7234 35.3708 27.2262C35.8133 26.729 36.0559 26.0856 36.0519 25.42V3.7467C36.0519 3.35781 35.9677 2.97354 35.805 2.62032C35.6424 2.26709 35.4051 1.9533 35.1096 1.70052C34.8193 1.45235 34.4795 1.26878 34.1128 1.16201C33.746 1.05525 33.3608 1.02773 32.9826 1.08129C27.4249 2.0037 22.3407 4.77349 18.5519 8.9429V36.0547Z" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const ShoppingCartIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
<svg xmlns="http://www.w3.org/2000/svg" width="38" height="39" viewBox="0 0 38 39" fill="none" className={className}>
  <path d="M4.60435 20.4389H26.6306L29.3233 6.59277H2.39634C2.19943 6.59352 2.00507 6.63867 1.82697 6.72506C1.64887 6.81144 1.49136 6.93695 1.36555 7.09274C1.23974 7.24854 1.14869 7.43081 1.09882 7.62672C1.04895 7.82263 1.04148 8.02741 1.07692 8.22661L3.28493 19.3035C3.33644 19.6238 3.49788 19.9144 3.73996 20.1227C3.98205 20.3311 4.28873 20.4432 4.60435 20.4389V20.4389Z" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M29.3169 6.59312L30.4478 2.16237C30.5099 1.84963 30.6751 1.56854 30.9156 1.36669C31.156 1.16484 31.4569 1.05462 31.7672 1.05469H36.0486" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M26.6213 20.4385L25.4904 26.2538C25.4283 26.5666 25.2631 26.8477 25.0226 27.0495C24.7822 27.2514 24.4813 27.3616 24.171 27.3615H7.77246" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M9.11881 37.0554C9.86237 37.0554 10.4652 36.4354 10.4652 35.6707C10.4652 34.906 9.86237 34.2861 9.11881 34.2861C8.37524 34.2861 7.77246 34.906 7.77246 35.6707C7.77246 36.4354 8.37524 37.0554 9.11881 37.0554Z" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M22.5832 37.0554C23.3267 37.0554 23.9295 36.4354 23.9295 35.6707C23.9295 34.906 23.3267 34.2861 22.5832 34.2861C21.8396 34.2861 21.2368 34.906 21.2368 35.6707C21.2368 36.4354 21.8396 37.0554 22.5832 37.0554Z" stroke="#004E60" strokeWidth="2.10972" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);

const HomeCartIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="34" viewBox="0 0 36 34" fill="none" className={className}>
  <path d="M33.1862 26.1988C33.1871 26.1743 33.1875 26.1501 33.1875 26.126C33.1868 25.5129 32.9495 24.9251 32.5277 24.4916C32.1059 24.058 31.534 23.8142 30.9375 23.8135V13.1182L32.9625 11.5572C33.0328 11.503 33.0898 11.4326 33.1289 11.3517C33.1679 11.2707 33.188 11.1815 33.1875 11.0911C33.1869 11.0008 33.1658 10.9118 33.1257 10.8314C33.0857 10.7509 33.0278 10.6813 32.9569 10.628L28.125 6.99886V0.688477C28.2742 0.688477 28.4172 0.627567 28.5227 0.519148C28.6282 0.410728 28.6875 0.26368 28.6875 0.110352V-2.20215C28.6875 -2.35548 28.6282 -2.50253 28.5227 -2.61094C28.4172 -2.71936 28.2742 -2.78027 28.125 -2.78027H22.5C22.3508 -2.78027 22.2077 -2.71936 22.1022 -2.61094C21.9967 -2.50253 21.9375 -2.35548 21.9375 -2.20215V0.110352C21.9375 0.26368 21.9967 0.410728 22.1022 0.519148C22.2077 0.627567 22.3508 0.688477 22.5 0.688477V2.77413L18.3319 -0.356412C18.2355 -0.428763 18.1193 -0.467757 18 -0.467757C17.8807 -0.467757 17.7644 -0.428763 17.6681 -0.356412L3.04311 10.628C2.97213 10.6813 2.91429 10.7509 2.87425 10.8314C2.8342 10.9118 2.81305 11.0008 2.81251 11.0911C2.81196 11.1815 2.83203 11.2707 2.8711 11.3517C2.91017 11.4326 2.96715 11.503 3.03748 11.5572L5.06248 13.1182V23.8135C4.46595 23.8142 3.89405 24.058 3.47223 24.4916C3.05042 24.9251 2.81315 25.5129 2.81248 26.126C2.81248 26.1501 2.81291 26.1743 2.81375 26.1988C2.28309 26.339 1.82046 26.6735 1.51265 27.1393C1.20483 27.6052 1.073 28.1705 1.14188 28.7292C1.21076 29.2878 1.47561 29.8015 1.88676 30.1737C2.2979 30.546 2.82707 30.7512 3.37498 30.751H32.625C33.1729 30.7512 33.7021 30.546 34.1132 30.1737C34.5244 29.8015 34.7892 29.2878 34.8581 28.7292C34.927 28.1705 34.7951 27.6052 34.4873 27.1393C34.1795 26.6735 33.7169 26.339 33.1862 26.1988ZM23.0625 -1.62402H27.5625V-0.467773H23.0625V-1.62402ZM23.625 3.5791V0.688477H27V6.15393L23.5718 3.5791H23.625ZM18 0.826359L31.6796 11.1008L30.3699 12.1104L18.3309 3.11154C18.2347 3.03966 18.1189 3.00094 18 3.00094C17.8811 3.00094 17.7652 3.03966 17.6691 3.11154L5.63012 12.1104L4.32034 11.1008L18 0.826359ZM2.24998 28.4385C2.2503 28.1349 2.36661 27.8436 2.57388 27.6273C2.78115 27.4111 3.06278 27.2871 3.35811 27.2822H3.35944C3.3882 27.2863 3.41696 27.2899 3.44628 27.2918C3.53949 27.2979 3.63271 27.28 3.7175 27.2397C3.8023 27.1995 3.87602 27.1382 3.93199 27.0613C3.98797 26.9845 4.02445 26.8945 4.03814 26.7996C4.05183 26.7046 4.04229 26.6077 4.0104 26.5174C3.96385 26.3924 3.93916 26.2599 3.93748 26.126C3.93784 25.8194 4.05648 25.5255 4.26738 25.3088C4.47828 25.092 4.76422 24.9701 5.06248 24.9697V29.5947H3.37498C3.07672 29.5944 2.79078 29.4724 2.57988 29.2557C2.36898 29.0389 2.25034 28.745 2.24998 28.4385ZM26.4375 29.5947H19.6875V16.876H26.4375V29.5947ZM27.5625 29.5947V16.2979C27.5625 16.1445 27.5032 15.9975 27.3977 15.8891C27.2922 15.7806 27.1492 15.7197 27 15.7197H19.125C18.9758 15.7197 18.8327 15.7806 18.7272 15.8891C18.6217 15.9975 18.5625 16.1445 18.5625 16.2979V29.5947H6.18748V13.1235L18 4.29395L29.8125 13.1235V29.5947H27.5625ZM32.625 29.5947H30.9375V24.9697C31.2357 24.9701 31.5217 25.092 31.7326 25.3088C31.9435 25.5255 32.0621 25.8194 32.0625 26.126C32.0608 26.26 32.0362 26.3926 31.9896 26.5177C31.9577 26.608 31.9481 26.7049 31.9618 26.7999C31.9755 26.8948 32.012 26.9848 32.068 27.0616C32.124 27.1385 32.1977 27.1998 32.2825 27.24C32.3673 27.2803 32.4605 27.2982 32.5537 27.2921C32.583 27.2902 32.6118 27.2866 32.6405 27.2825H32.6419C32.9402 27.2848 33.2255 27.4088 33.4349 27.6273C33.6443 27.8458 33.7607 28.1408 33.7584 28.4474C33.7562 28.7541 33.6355 29.0473 33.4229 29.2625C33.2104 29.4777 32.9234 29.5973 32.625 29.595V29.5947Z" fill="#004E60"/>
  <path d="M15.75 15.7197H9C8.85082 15.7197 8.70774 15.7806 8.60225 15.8891C8.49676 15.9975 8.4375 16.1445 8.4375 16.2979V24.3916C8.4375 24.5449 8.49676 24.692 8.60225 24.8004C8.70774 24.9088 8.85082 24.9697 9 24.9697H15.75C15.8992 24.9697 16.0423 24.9088 16.1477 24.8004C16.2532 24.692 16.3125 24.5449 16.3125 24.3916V16.2979C16.3125 16.1445 16.2532 15.9975 16.1477 15.8891C16.0423 15.7806 15.8992 15.7197 15.75 15.7197ZM15.1875 19.7666H12.9375V16.876H15.1875V19.7666ZM11.8125 16.876V19.7666H9.5625V16.876H11.8125ZM9.5625 20.9229H11.8125V23.8135H9.5625V20.9229ZM12.9375 23.8135V20.9229H15.1875V23.8135H12.9375Z" fill="#004E60"/>
</svg>
);

/**
 * SUB-COMPONENTS
 */
const StepIndicator: React.FC<{ steps: number[] }> = ({ steps }) => (
  <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto mb-12">
    {/* Dashed background line */}
    <div className="absolute top-1/2 left-0 w-full border-t-2 border-gray-300 border-dashed -translate-y-1/2 z-0"></div>
    
    <div className="relative z-10 flex justify-between w-full">
      {steps.map((num) => (
        <div 
          key={num} 
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E8F4F8] text-[#004E60] font-bold text-xl shadow-sm"
        >
          {num}
        </div>
      ))}
    </div>
  </div>
);

// Simple Card (Top Row - Icon overlapping top)
const SimpleCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ 
  title, 
  description, 
  icon 
}) => (
  <div className="relative pt-10 h-full">
    {/* Icon overlapping top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center z-10">
      {icon}
    </div>
    {/* Card with curved top to accommodate icon */}
    <div className="bg-white rounded-2xl shadow-md pt-14 h-full pb-8 px-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

// Image Card (Bottom Row - Icon overlapping top of image)
const ImageCard: React.FC<FocusCardData> = ({ title, description, image, type }) => (
  <div className="relative pt-10 h-full">
    {/* Icon overlapping top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center z-10">
      {type === 'rent' ? (
        <HomeCartIcon className="w-9 h-9" />
      ) : type === 'legality' ? (
        <BookOpenIcon className="w-9 h-9" />
      ) : (
        <ShoppingCartIcon className="w-9 h-9" />
      )}
    </div>
    
    {/* Card */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-8 text-center flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

/**
 * MAIN PAGE COMPONENT
 */
export default function FocusExtraCard({
  heading = "our main focus",
  subheading = "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.",
  topCards,
  focusCards,
}: FocusExtraCardProps) {
  const defaultFocusData: FocusCardData[] = [
    {
      id: 1,
      title: "Rent a Property",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
      type: 'rent'
    },
    {
      id: 2,
      title: "Provide property legality",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      type: 'legality'
    },
    {
      id: 3,
      title: "Sell a Property",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=800",
      type: 'sell'
    }
  ];
  const defaultTopCards: TopCardData[] = [
    {
      title: "Rent a Property",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      title: "Provide property legality",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      title: "Sell a Property",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];
  const topCardIcons = [<HomeCartIcon key="rent" />, <BookOpenIcon key="legality" />, <ShoppingCartIcon key="sell" />];
  const resolvedTopCards = topCards ?? defaultTopCards;
  const focusData = focusCards ?? defaultFocusData;

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Step Progression */}
        <StepIndicator steps={[1, 2, 3]} />

        {/* Top Row - Simple Cards (Icon on top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {resolvedTopCards.map((card, index) => (
            <SimpleCard
              key={`${card.title}-${index}`}
              title={card.title}
              description={card.description}
              icon={topCardIcons[index % topCardIcons.length]}
            />
          ))}
        </div>

        {/* Bottom Row - Image Cards (Icon on top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {focusData.map((item) => (
            <ImageCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
