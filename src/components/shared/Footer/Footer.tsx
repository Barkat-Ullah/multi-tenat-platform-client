import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const quickLinksOne = [
  { name: "HGV/Bus Medicals", href: "/hgv-bus-medicals" },
  { name: "Taxi Medicals", href: "/taxi-medicals" },
  { name: "Other Medicals", href: "/other-medicals" },
  { name: "Business", href: "/business" },
];


const quickLinksTwo = [
  { name: "Occupational Health", href: "/occupational-health" },
  { name: "Locations", href: "/locations" },
  { name: "FAQ's", href: "/#faq" },
];

const FooterLink = ({ href, name }: { href: string; name: string }) => (
  <li>
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[15px] font-medium leading-none text-[#1D2B34] transition-colors hover:text-[#00B2D6]"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <ChevronRight className="absolute h-4 w-4 stroke-[2.4] transition-transform group-hover:translate-x-0.5" />
        <ChevronRight className="absolute left-1.5 h-4 w-4 stroke-[2.4] transition-transform group-hover:translate-x-0.5" />
      </span>
      {name}
    </Link>
  </li>
);

const Footer = () => (
  <footer className="relative bg-white pt-14 text-[#111827] poppins">
    <div className="relative bg-[#DFF6FC]">
      <svg
        className="pointer-events-none absolute left-0 top-0 hidden h-14 w-full -translate-y-full lg:block"
        viewBox="0 0 1280 56"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#DFF6FC"
          d="M0 0H390C420 0 421 42 456 42H824C859 42 860 0 890 0H1280V56H0Z"
        />
      </svg>

      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 lg:pb-8 lg:pt-[94px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[minmax(268px,1fr)_183px_189px_minmax(268px,1fr)] lg:gap-[62px]">
          <div>
            <Link href="/" aria-label="Compliance Medicals home" className="inline-flex">
              <Logo />
            </Link>
            <p className="mt-7 max-w-[270px] text-[15px] font-normal leading-[1.35] text-[#18232B]">
              All driver medicals are completed by GMC registered doctors in accordance with current DVLA Group 2 guidelines
            </p>
          </div>

          <nav aria-label="Quick Link 1">
            <h3 className="text-lg font-bold leading-none text-[#0D1820]">Quick Link 1</h3>
            <div className="mt-6 h-[2px] w-full bg-[#50CBE1]" />
            <ul className="mt-6 space-y-5">
              {quickLinksOne.map((link) => (
                <FooterLink key={link.name} {...link} />
              ))}
            </ul>
          </nav>

          <nav aria-label="Quick Link 2">
            <h3 className="text-lg font-bold leading-none text-[#0D1820]">Quick Link 2</h3>
            <div className="mt-6 h-[2px] w-full bg-[#50CBE1]" />
            <ul className="mt-6 space-y-5">
              {quickLinksTwo.map((link) => (
                <FooterLink key={link.name} {...link} />
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg font-bold leading-none text-[#0D1820]">Contact Information's</h3>
            <div className="mt-6 h-[2px] w-full bg-[#50CBE1]" />
            <div className="mt-[18px] space-y-[18px]">
              <a
                href="tel:+02039855800"
                className="flex items-center gap-4 text-[16px] font-medium leading-tight text-[#1D2B34] transition-colors hover:text-[#00B2D6]"
              >
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/50 text-[#00B2D6]">
                  <Phone className="h-[17px] w-[17px]" />
                </span>
                +020 3985 5800
              </a>
              <a
                href="mailto:Bookings@compliancemedicals.uk"
                className="flex items-start gap-4 text-[16px] font-medium leading-tight text-[#1D2B34] transition-colors hover:text-[#00B2D6]"
              >
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/50 text-[#00B2D6]">
                  <Mail className="h-[17px] w-[17px]" />
                </span>
                <span className="break-words">Bookings@compliancemedicals.uk</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#C6E1E7] pt-5 lg:mt-[22px]">
          <div className="flex flex-col gap-4 text-[13px] font-normal text-[#26353D] sm:flex-row sm:items-center sm:justify-between">
            <p>Compliance Medicals Ltd &copy; 2026. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/privacy-policy" className="underline underline-offset-2 transition-colors hover:text-[#00B2D6]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-[#00B2D6]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
