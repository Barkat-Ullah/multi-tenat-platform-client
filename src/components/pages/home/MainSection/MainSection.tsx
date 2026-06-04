import { DollarSign, FileText, ShoppingCart } from "lucide-react";
import propertyLegalityImg from "@/assets/card/image.png";
import consultationImg from "@/assets/card/image.png";
import rentPropertyImg from "@/assets/card/image.png";
import sellPropertyImg from "@/assets/card/image.png";
import Image from "next/image";

const MainFocusSection = () => {
  const steps = [
    {
      number: 1,
      title: "Rent a Property",
      description: "Find your perfect rental home with our extensive listings and expert guidance through the entire process.",
      icon: DollarSign,
      image: rentPropertyImg,
    },
    {
      number: 2,
      title: "Buy a Property",
      description: "Discover your dream property with personalized recommendations and comprehensive market insights.",
      icon: FileText,
      image: sellPropertyImg,
    },
    {
      number: 3,
      title: "Sell a Property",
      description: "Get the best value for your property with our strategic marketing and negotiation expertise.",
      icon: ShoppingCart,
    },
  ];

  const sideItems = [
    {
      title: "Provide Property Legality",
      description: "Ensure all legal aspects are handled properly with our comprehensive documentation and verification services.",
      image: propertyLegalityImg,
    },
    {
      title: "Expert Consultation",
      description: "Receive professional guidance from our experienced real estate consultants throughout your journey.",
      image: consultationImg,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24 ">
      {/* Decorative curved shape */}
      {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/90 rounded-bl-[300px] -z-10 shadow-2xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-tr-[250px] -z-10" /> */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Title and Side Items */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                Our Main Focus
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed">
                We provide comprehensive real estate services tailored to your needs, from rentals to sales and investment opportunities.
              </p>
            </div>

            <div className="space-y-8">
              {sideItems.map((item, index) => (
                <div key={index} className="group space-y-4">
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                    <Image
                      width={500}
                      height={500}
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground capitalize">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Timeline Steps */}
          <div className="lg:col-span-8">
            <div className="space-y-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Vertical dashed line between steps */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-7 top-20 w-0.5 h-20 border-l-2 border-dashed border-primary/30" />
                    )}

                    <div className="flex gap-6">
                      {/* Step Number & Icon */}
                      <div className="flex-shrink-0 flex items-start gap-4">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-lg">
                          {step.number}
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cream border-2 border-primary/20 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110">
                          <IconComponent size={24} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4 pt-2">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {step.description}
                        </p>
                        {step.image && (
                          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl mt-6 group">
                            <Image
                              fill
                              src={step.image}
                              alt={step.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainFocusSection;
