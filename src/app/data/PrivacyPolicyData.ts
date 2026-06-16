export interface PrivacyPolicySection {
  id: string;
  title: string;
  content: string[];
  bullets?: string[];
}

export const privacyPolicyIntro = {
  lastUpdated: "January 24, 2026",
  text: "This privacy notice for Compliance Medicals ('we', 'us', or 'our') describes how and why we might collect, store, use, and/or share ('process') your information when you use our services ('Services'), such as when you visit our website at https://compliancemedicals.co.uk or engage with us in other related ways. Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at info@compliancemedicals.co.uk."
};

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: "collect-info",
    title: "1. WHAT INFORMATION DO WE COLLECT?",
    content: [
      "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.",
      "The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include:"
    ],
    bullets: [
      "Names, telephone numbers, and email addresses.",
      "Billing addresses, debit/credit card numbers, and other financial details when scheduling appointments.",
      "Medical history details provided voluntarily in connection with driver or occupational health examinations."
    ]
  },
  {
    id: "process-info",
    title: "2. HOW DO WE PROCESS YOUR INFORMATION?",
    content: [
      "We process your personal information for a variety of reasons, depending on how you interact with our Services, including:",
      "To facilitate account creation and authentication and otherwise manage user accounts. We process your information so you can create and log in to your account, as well as keep your account in working order.",
      "To deliver and facilitate delivery of services to the user. We process your information to provide you with the requested medical booking and assessment services.",
      "To respond to user inquiries and offer support to users. We process your information to respond to your inquiries and solve any potential issues you might have with the requested service.",
      "To send administrative information to you. We process your information to send you details about our services, changes to our terms and policies, and other similar information."
    ]
  },
  {
    id: "share-info",
    title: "3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
    content: [
      "We may share your information with third-party vendors, service providers, contractors, or agents ('third parties') who perform services for us or on our behalf and require access to such information to do that work.",
      "We may need to share your personal information in the following situations:",
      "Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
      "Affiliates. We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice."
    ]
  },
  {
    id: "cookies",
    title: "4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?",
    content: [
      "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.",
      "Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services."
    ]
  },
  {
    id: "retention",
    title: "5. HOW LONG DO WE KEEP YOUR INFORMATION?",
    content: [
      "We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).",
      "When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible."
    ]
  },
  {
    id: "security",
    title: "6. HOW DO WE KEEP YOUR INFORMATION SAFE?",
    content: [
      "We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process.",
      "However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information."
    ]
  },
  {
    id: "minors",
    title: "7. DO WE COLLECT INFORMATION FROM MINORS?",
    content: [
      "We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.",
      "If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under 18, please contact us."
    ]
  },
  {
    id: "rights",
    title: "8. WHAT ARE YOUR PRIVACY RIGHTS?",
    content: [
      "In some regions (like the UK and EEA), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information.",
      "You can make such a request by contacting us using the contact details provided in the contact section below. We will consider and act upon any request in accordance with applicable data protection laws."
    ]
  },
  {
    id: "dnt",
    title: "9. CONTROLS FOR DO-NOT-TRACK FEATURES",
    content: [
      "Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ('DNT') feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.",
      "At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online."
    ]
  },
  {
    id: "california",
    title: "10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
    content: [
      "California Civil Code Section 1798.83, also known as the 'Shine The Light' law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes.",
      "If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below."
    ]
  },
  {
    id: "updates",
    title: "11. DO WE MAKE UPDATES TO THIS NOTICE?",
    content: [
      "We may update this privacy notice from time to time. The updated version will be indicated by an updated 'Revised' date and the updated version will be effective as soon as it is accessible.",
      "If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information."
    ]
  },
  {
    id: "contact",
    title: "12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
    content: [
      "If you have questions or comments about this notice, you may email us at info@compliancemedicals.co.uk or by post to:",
      "Compliance Medicals Ltd",
      "71-75 Shelton Street",
      "London",
      "WC2H 9JQ"
    ]
  },
  {
    id: "review-delete",
    title: "13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
    content: [
      "Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances.",
      "To request to review, update, or delete your personal information, please submit a request to info@compliancemedicals.co.uk. We will respond to your request within 30 days."
    ]
  }
];
