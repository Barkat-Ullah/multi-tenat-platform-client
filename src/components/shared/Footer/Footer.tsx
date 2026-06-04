import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const menu = {
  Properties: [
    { name: "All Property", href: "/all-property" },
    { name: "Professionals", href: "/professionals" },
  ],
  iRendity: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Join Us", href: "/register" },
  ],
  Contact: [
    { name: "Investor Guides", href: "/investor-guides" },
    { name: "Tax & Legal Info", href: "/tax-legal" },
    { name: "Contact Us", href: "/contact" },
  ],
};

const socials = [
  { icon: Instagram, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Twitter, href: "#" },
];

const Footer = () => (
  <div className="bg-[#171A1C] text-[#F8F8F6]">
    <div className="py-12  container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      {Object.entries(menu).map(([title, links]) => (
        <div key={title}>
          <h3 className="text-xl md:text-3xl font-semibold mb-6">{title}</h3>
          <ul className="space-y-3">
            {links.map(({ name, href }) => (
              <li key={name}>
                <Link href={href} className="hover:text-gray-300 md:text-lg text-sm font-normal transition">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          {title === "iRendity" && (
            <div className="mt-8">
              <h4 className="font-medium mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socials.map(({ icon: Icon, href }, i) => (
                  <Link
                    key={i}
                    href={href}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E2C59F] hover:border-gold-500 hover:bg-gray-800 transition"
                  >
                    <Icon className="text-sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="bg-[#171A1C] py-4 px-6 md:px-10 lg:px-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-3 md:mb-0">
          {["Terms of Service", "Privacy Policy", "Cookies"].map((item, i) => (
            <React.Fragment key={item}>
              {i !== 0 && <span>•</span>}
              <Link href={`/${item.toLowerCase().replace(/\s/g, "-")}`} className="hover:underline">
                {item}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <div className="text-center ">
          © 1999 - 2026 iRendity International Real Estate all rights reserved.
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
