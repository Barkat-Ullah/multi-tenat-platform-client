import Image from 'next/image';
import Link from 'next/link';
import interiorImg from '@/assets/about/home-img-1.jpg';
import exteriorImg from '@/assets/about/home-img-2.jpg';
import modernImg from '@/assets/about/home-img-3.jpg';

interface PropertyArticleProps {
  paragraphs?: string[];
  ctaTitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

const PropertyArticle = ({
  paragraphs = [
    "Welcome to iRendity, your trusted partner in discovering exceptional investment properties across prime locations. Whether you're a first-time buyer looking for your dream home, a seasoned investor seeking high-yield rental properties, or someone ready to diversify their portfolio with commercial real estate, we provide comprehensive solutions tailored to your financial goals. Our platform connects you with verified properties, transparent pricing, and expert guidance every step of the way.",
    "Our curated collection features a diverse range of properties, from modern urban apartments and suburban family homes to luxury estates and commercial spaces. Each listing undergoes rigorous verification to ensure accuracy, legal compliance, and investment viability. We understand that purchasing property is more than a transaction it's a significant life decision. That's why we provide detailed property analytics, neighborhood insights, ROI calculations, and financing options to help you make informed choices with confidence.",
    "With advanced search filters, virtual tours, and real-time market data, finding your perfect property has never been easier. Our dedicated team of real estate professionals is committed to delivering exceptional service, from initial consultation through closing and beyond. We don't just help you find a property; we help you build lasting wealth through strategic real estate investments. Join thousands of satisfied clients who have achieved their property ownership dreams with iRendity.",
  ],
  ctaTitle = "Find Your Property With Us",
  buttonLabel = "Discover Properties",
  buttonHref = "/all-property",
}: PropertyArticleProps) => {
  return (
    <section className="py-16">
      {/* Images Container */}
      <div className="w-full mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="relative h-96 overflow-hidden group">
            <Image
              src={interiorImg}
              alt="Modern luxury interior"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-96 overflow-hidden group">
            <Image
              src={exteriorImg}
              alt="Beautiful suburban home"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-96 overflow-hidden group">
            <Image
              src={modernImg}
              alt="Contemporary architecture"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-gray-700 leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#004E60] mb-8 tracking-tight">
            {ctaTitle}
          </h2>
          <Link href={buttonHref}>
            <button className="bg-[#3BB273] hover:bg-[#2fa063] text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              {buttonLabel}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyArticle;
