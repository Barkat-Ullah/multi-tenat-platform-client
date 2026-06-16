export interface TermsSection {
  id: string;
  title: string;
  content: string[];
  bullets?: string[];
}

export const termsIntro = {
  subtitle: "Your use of this website is subject to the following terms and conditions.",
  footerText: "Compliance Medical Services Limited — Company Registration No. 13415279 England"
};

export const termsSections: TermsSection[] = [
  {
    id: "about-us",
    title: "1. About Us",
    content: [
      "Compliance Medical Services Limited ('we', 'us', 'our') is a company registered in England and Wales under Company No. 13415279. Our registered office is located at: Eco-Innovation Centre, Peterscourt, City Road, Peterborough, PE1 1SA, United Kingdom."
    ]
  },
  {
    id: "acceptance",
    title: "2. Acceptance of Terms",
    content: [
      "By booking a medical assessment with us or using our website, you agree to these Terms and Conditions."
    ]
  },
  {
    id: "booking-contract",
    title: "3. Booking and Contract Formation",
    content: [
      "A contract between you and us is confirmed once we send your booking confirmation email, which will include the appointment date, time, and location.",
      "It is your responsibility to ensure that you receive this confirmation email. Failure to attend an appointment due to not receiving the confirmation will be considered a non-attendance and will not be eligible for a refund."
    ]
  },
  {
    id: "customer-responsibility",
    title: "4. Customer Responsibility",
    content: [
      "You acknowledge and agree that:"
    ],
    bullets: [
      "It is solely your responsibility to ensure that the medical assessment you book meets the requirements of your relevant licensing authority, including but not limited to the DVLA, TFL, or any local council.",
      "We accept no liability if a medical assessment is rejected for any reason, including where it has not been completed by an approved provider required by a specific authority."
    ]
  },
  {
    id: "fees-refunds",
    title: "5. Fees and Refund Policy",
    content: [
      "All fees must be paid at the time of booking.",
      "Once a medical assessment has been completed, no refunds will be issued under any circumstances. This is due to costs incurred, including but not limited to clinician time, facility hire, and administrative expenses.",
      "Cancellations:",
      "• Cancellations made at least 3 working days before the appointment are eligible for a full refund.",
      "• Cancellations made within 3 working days of the appointment are non-refundable.",
      "Rescheduling:",
      "• You may reschedule your appointment once, provided at least 3 working days' notice is given.",
      "• Any additional rescheduling requests will be subject to our discretion.",
      "• If you cancel after rescheduling, no refund will be issued.",
      "Non-attendance:",
      "• Failure to attend your appointment, including due to lateness, transport issues, or weather conditions, will result in no refund."
    ]
  },
  {
    id: "delivery",
    title: "6. Delivery of Service",
    content: [
      "We will carry out the medical assessment with reasonable care and skill, in line with accepted medical standards.",
      "You are responsible for:"
    ],
    bullets: [
      "Bringing all required documentation.",
      "Providing accurate and complete information.",
      "Reviewing your completed form before submission."
    ]
  },
  {
    id: "errors",
    title: "7. Errors and Corrections",
    content: [
      "If an administrative error is made by us, such as an incomplete form, our liability will be limited strictly to:"
    ],
    bullets: [
      "Correcting the error, or",
      "Refunding the fee paid for the medical assessment."
    ]
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: [
      "To the fullest extent permitted by law:"
    ],
    bullets: [
      "We shall not be liable for any indirect, consequential, or financial losses, including loss of earnings, loss of license, or business interruption.",
      "Our total liability to you shall not exceed the fee paid for the medical assessment.",
      "Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, or any liability that cannot be excluded under the Consumer Rights Act 2015."
    ]
  },
  {
    id: "decisions",
    title: "9. Licensing Authority Decisions",
    content: [
      "We accept no responsibility for:"
    ],
    bullets: [
      "Decisions made by the DVLA, TFL, or any licensing authority.",
      "Requests for additional medical information.",
      "Delays, refusals, or further requirements imposed by any authority.",
      "All such matters are outside our control."
    ]
  },
  {
    id: "website-use",
    title: "10. Website Use",
    content: [
      "We do our best to ensure all information on our site is correct, but mistakes can occasionally happen. As such, we cannot guarantee total accuracy and disclaim liability for any errors, as allowed by law."
    ]
  },
  {
    id: "data-protection",
    title: "11. Data Protection",
    content: [
      "We process all personal data in strict compliance with UK data protection legislation and medical confidentiality standards."
    ]
  },
  {
    id: "third-party",
    title: "12. Third-Party Links",
    content: [
      "We accept no responsibility for the content, privacy practices, or accuracy of any third-party websites linked from our platform."
    ]
  },
  {
    id: "general",
    title: "13. General",
    content: [],
    bullets: [
      "1. If any rule is found to be invalid, all other rules in these Terms still apply.",
      "2. If we miss or delay enforcing a rule, it doesn't mean we are giving up our rights to enforce it later.",
      "3. These Terms follow the laws of England and Wales."
    ]
  }
];
