'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import bg from "@/assets/home/contact-bg.png";
import Link from "next/link";

interface ContactUsSectionProps {
  brandTitle?: string;
  sectionTitle?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function ContactUsSection({
  brandTitle = "Get in touch",
  sectionTitle = "Contact Us",
  description = "Whether you are an investor looking for stable yields or an agency specializing in income-producing assets, our team is ready to assist you in navigating Italy's vertical investment marketplace.",
  buttonLabel = "Contact Us",
  buttonHref = "/contact",
}: ContactUsSectionProps) {
  return (
    <section className="pb-20 md:pb-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden rounded-3xl shadow-2xl">
          {/* Background Image */}
          <Image
            src={bg}
            alt="Aerial view of residential neighborhood"
            fill
            className="object-cover"
            priority
          />

          {/* Darker Overlay for better contrast */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl w-full rounded-3xl bg-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl border border-white/20 text-center"
            >
              <span className="text-[#3BB273] font-bold tracking-widest uppercase text-sm mb-4 block">
                {brandTitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                {sectionTitle}
              </h2>
              <p className="text-white/90 mb-8 text-lg leading-relaxed">
                {description}
              </p>
              <Link href={buttonHref}>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#3BB273" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#004E60] font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl text-lg"
                >
                  {buttonLabel}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
