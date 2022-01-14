module.exports = {
  async redirects() {
    return [
      {
        source: "/integrations",
        destination: "/resources",
        // TODO: is this permanent?
        permanent: true,
      },
      {
        source: "/wp-content/:path*/:slug",
        destination: "https://assets.ujet.cx/:slug", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/files/:path*/:slug",
        destination: "https://assets.ujet.cx/:slug", // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: "/customerstories/the-farmers-dog",
        destination: "/customerstories",
        // TODO: is this permanent?
        permanent: true,
      },
      {
        source: "/digital-voice-channels",
        destination: "/channels",
        // TODO: is this permanent?
        permanent: true,
      },
      // press release redirects
      {
        source:
          "/ujet-adds-sms-texting-to-its-proprietary-smart-actions-updates-mobile-sdk-and-optimizes-queue-management",
        destination:
          "/press-releases/ujet-adds-sms-texting-to-its-proprietary-smart-actions-updates-mobile-sdk-and-optimizes-queue-management",
        permanent: true,
      },
      {
        source:
          "/ujet-announces-record-year-and-exponential-growth-of-contact-center-customer-service-platform",
        destination:
          "/press-releases/ujet-announces-record-year-and-exponential-growth-of-contact-center-customer-service-platform",
        permanent: true,
      },
      {
        source: "/ujet-announces-salesforce-sales-cloud-integration",
        destination:
          "/press-releases/ujet-announces-salesforce-sales-cloud-integration",
        permanent: true,
      },
      {
        source:
          "/ujet-awarded-customer-magazine-workforce-optimization-innovation-award",
        destination:
          "/press-releases/ujet-awarded-customer-magazine-workforce-optimization-innovation-award",
        permanent: true,
      },
      {
        source: "/ujet-focuses-on-expansion-with-25-million-series-b",
        destination:
          "/press-releases/ujet-focuses-on-expansion-with-25-million-series-b",
        permanent: true,
      },
      {
        source: "/ujet-named-a-leader-in-the-saas-1000",
        destination: "/press-releases/ujet-named-a-leader-in-the-saas-1000",
        permanent: true,
      },
      {
        source:
          "/ujet-named-hot-vendor-by-aragon-research-in-intelligent-contact-center",
        destination:
          "/press-releases/ujet-named-hot-vendor-by-aragon-research-in-intelligent-contact-center",
        permanent: true,
      },
      {
        source:
          "/ujet-receives-2019-customer-magazine-product-of-the-year-award",
        destination:
          "/press-releases/ujet-receives-2019-customer-magazine-product-of-the-year-award",
        permanent: true,
      },
      {
        source:
          "/ujet-strengthens-its-executive-leadership-team-with-vasili-triant-as-chief-business-officer",
        destination:
          "/press-releases/ujet-strengthens-its-executive-leadership-team-with-vasili-triant-as-chief-business-officer",
        permanent: true,
      },
      {
        source:
          "/ujet-raises-another-55-million-to-accelerate-contact-center-transformation-2",
        destination:
          "/press-releases/ujet-raises-another-55-million-to-accelerate-contact-center-transformation-2",
        permanent: true,
      },
      {
        source:
          "/ujet-releases-e-book-on-how-millennials-and-generation-z-are-transforming-customer-support",
        destination:
          "/press-releases/ujet-releases-e-book-on-how-millennials-and-generation-z-are-transforming-customer-support",
        permanent: true,
      },
      {
        source:
          "/ujet-named-a-2019-cool-vendor-in-crm-customer-service-and-support-by-gartner",
        destination:
          "/press-releases/ujet-named-a-2019-cool-vendor-in-crm-customer-service-and-support-by-gartner",
        permanent: true,
      },
      {
        source:
          "/ujet-appoints-jeff-nichols-as-new-chief-financial-officer-amidst-rapid-growth",
        destination:
          "/press-releases/ujet-appoints-jeff-nichols-as-new-chief-financial-officer-amidst-rapid-growth",
        permanent: true,
      },
      {
        source:
          "/ujet-and-acqueon-to-help-companies-create-modern-and-hyper-personalized-outbound-campaigns",
        destination:
          "/press-releases/ujet-and-acqueon-to-help-companies-create-modern-and-hyper-personalized-outbound-campaigns",
        permanent: true,
      },
      {
        source: "/ujet-announces-strategic-global-partnership-with-telarus",
        destination:
          "/press-releases/ujet-announces-strategic-global-partnership-with-telarus",
        permanent: true,
      },
      {
        source:
          "/ujet-ccaas-cloud-contact-center-now-available-on-oracle-cloud-marketplace",
        destination:
          "/press-releases/ujet-ccaas-cloud-contact-center-now-available-on-oracle-cloud-marketplace",
        permanent: true,
      },
      {
        source: "/karen-bowman-of-ujet-recognized-as-2021-crn-channel-chief",
        destination:
          "/press-releases/karen-bowman-of-ujet-recognized-as-2021-crn-channel-chief",
        permanent: true,
      },
      {
        source:
          "/observe-ai-partners-with-ujet-to-improve-cx-quality-for-the-remote-work-era",
        destination:
          "/press-releases/observe-ai-partners-with-ujet-to-improve-cx-quality-for-the-remote-work-era",
        permanent: true,
      },
      {
        source: "/ujet-adds-intelisys-to-expanding-channel-partner-program",
        destination:
          "/press-releases/ujet-adds-intelisys-to-expanding-channel-partner-program",
        permanent: true,
      },
      {
        source: "/ujet-as-the-best-software-company-2021-by-g2",
        destination:
          "/press-releases/ujet-as-the-best-software-company-2021-by-g2",
        permanent: true,
      },
      {
        source:
          "/ujet-announces-partnership-with-google-cloud-contact-center-ai",
        destination:
          "/press-releases/ujet-announces-partnership-with-google-cloud-contact-center-ai",
        permanent: true,
      },
      {
        source: "/ujet-adds-microcorp",
        destination: "/press-releases/ujet-adds-microcorp",
        permanent: true,
      },
      {
        source: "/ujet-announces-strategic-global-partnership-with-jenne",
        destination:
          "/press-releases/ujet-announces-strategic-global-partnership-with-jenne",
        permanent: true,
      },
      {
        source: "/ujet-announces-strategic-partnership-with-cx-effect",
        destination:
          "/press-releases/ujet-announces-strategic-partnership-with-cx-effect",
        permanent: true,
      },
      {
        source:
          "/ujet-adds-planetone-to-rapidly-growing-channel-partner-program",
        destination:
          "/press-releases/ujet-adds-planetone-to-rapidly-growing-channel-partner-program",
        permanent: true,
      },
      {
        source:
          "/ujet-continues-unparalleled-pace-of-innovation-with-added-text-chat-and-feedback-capabilities",
        destination:
          "/press-releases/ujet-continues-unparalleled-pace-of-innovation-with-added-text-chat-and-feedback-capabilities",
        permanent: true,
      },
      {
        source: "/avant-and-ujet-announce-strategic-partnership",
        destination:
          "/press-releases/avant-and-ujet-announce-strategic-partnership",
        permanent: true,
      },
      {
        source:
          "/g2-ranks-ujet-1-in-user-satisfaction-for-5th-consecutive-quarter",
        destination:
          "/press-releases/g2-ranks-ujet-1-in-user-satisfaction-for-5th-consecutive-quarter",
        permanent: true,
      },
      {
        source: "/sms-adapter",
        destination: "/press-releases/sms-adapter",
        permanent: true,
      },
      {
        source:
          "/ujet-adds-live-multimedia-sharing-over-text-messaging-to-improve-the-real-time-customer-support-experience",
        destination:
          "/press-releases/ujet-adds-live-multimedia-sharing-over-text-messaging-to-improve-the-real-time-customer-support-experience",
        permanent: true,
      },
      {
        source:
          "/ujet-and-calabrio-partner-to-drive-new-wave-of-cloud-contact-center-and-workforce-engagement-solutions-2",
        destination:
          "/press-releases/ujet-and-calabrio-partner-to-drive-new-wave-of-cloud-contact-center-and-workforce-engagement-solutions-2",
        permanent: true,
      },
      {
        source:
          "/ujet-launches-its-channel-partner-program-with-peakview-partnership",
        destination:
          "/press-releases/ujet-launches-its-channel-partner-program-with-peakview-partnership",
        permanent: true,
      },
      {
        source:
          "/ujet-recognized-as-a-leader-in-contact-center-operations-software",
        destination:
          "/press-releases/ujet-recognized-as-a-leader-in-contact-center-operations-software",
        permanent: true,
      },
      {
        source:
          "/ujet-unveils-next-generation-virtual-agent-for-less-robotic-interactions",
        destination:
          "/press-releases/ujet-unveils-next-generation-virtual-agent-for-less-robotic-interactions",
        permanent: true,
      },
      {
        source: "/ujet-wins-2020-stevie-award-for-sales-and-customer-service",
        destination:
          "/press-releases/ujet-wins-2020-stevie-award-for-sales-and-customer-service",
        permanent: true,
      },
      {
        source:
          "/zendesk-marketplace-lists-ujets-ultra-modern-enterprise-grade-contact-center-solution",
        destination:
          "/press-releases/zendesk-marketplace-lists-ujets-ultra-modern-enterprise-grade-contact-center-solution",
        permanent: true,
      },
      {
        source:
          "/ujet-releases-new-research-with-insights-on-the-new-tools-technologies-and-channels-shaping-customer-support",
        destination:
          "/press-releases/ujet-releases-new-research-with-insights-on-the-new-tools-technologies-and-channels-shaping-customer-support",
        permanent: true,
      },
      {
        source: "/ujet-mobile-first-approach-raises-over-20m-in-funding",
        destination:
          "/press-releases/ujet-mobile-first-approach-raises-over-20m-in-funding",
        permanent: true,
      },
      {
        source: "/ujet-commits-to-customer-security-in-latest-certifications",
        destination:
          "/press-releases/ujet-commits-to-customer-security-in-latest-certifications",
        permanent: true,
      },
      {
        source: "/ujet-integrates-okta-onelogin-and-microsoft-adfs",
        destination:
          "/press-releases/ujet-integrates-okta-onelogin-and-microsoft-adfs",
        permanent: true,
      },
      {
        source: "/ujet-leads-g2-fall-2020-report-for-satisfaction-relationship",
        destination:
          "/press-releases/ujet-leads-g2-fall-2020-report-for-satisfaction-relationship",
        permanent: true,
      },
      {
        source: "/ujet-unveils-platform-enhancements-to-fit-and-flexibility",
        destination:
          "/press-releases/ujet-unveils-platform-enhancements-to-fit-and-flexibility",
        permanent: true,
      },
      {
        source: "/ujet-and-kustomer-further-extend-their-integration",
        destination:
          "/press-releases/ujet-and-kustomer-further-extend-their-integration",
        permanent: true,
      },
      {
        source: "/ujet-powers-the-worlds-largest-cloud-contact-center",
        destination:
          "/press-releases/ujet-powers-the-worlds-largest-cloud-contact-center",
        permanent: true,
      },
      {
        source: "/ujet-wins-saas-product-of-the-year-award-2021",
        destination:
          "/press-releases/ujet-wins-saas-product-of-the-year-award-2021",
        permanent: true,
      },
      {
        source: "/g2-ranks-ujet-1-in-user-satisfaction",
        destination: "/press-releases/g2-ranks-ujet-1-in-user-satisfaction",
        permanent: true,
      },
      {
        source:
          "/ujet-walks-away-victorious-in-the-2021-titan-business-awards-second-season",
        destination:
          "/press-releases/ujet-walks-away-victorious-in-the-2021-titan-business-awards-second-season",
        permanent: true,
      },
      {
        source: "/google-cloud-and-ujet-announce-strategic-partnership",
        destination:
          "/press-releases/google-cloud-and-ujet-announce-strategic-partnership",
        permanent: true,
      },
      {
        source: "/tom-puorro-as-chief-business-officer",
        destination: "/press-releases/tom-puorro-as-chief-business-officer",
        permanent: true,
      },
      {
        source: "/ujet-and-playvox-partner-to-optimize-contact-center-agent",
        destination:
          "/press-releases/ujet-and-playvox-partner-to-optimize-contact-center-agent",
        permanent: true,
      },
      {
        source:
          "/ujet-assembled-partner-enable-seamless-customer-service-intelligent-workforce-management",
        destination:
          "/press-releases/ujet-assembled-partner-enable-seamless-customer-service-intelligent-workforce-management",
        permanent: true,
      },
      // resource redirects
      {
        source: "/why-ujet-ccaas-wbn-ty",
        destination: "/resources/webinars/why-ujet-ccaas-wbn-ty",
        permanent: true,
      },
      {
        source: "/the-evolution-of-cx-wbn-typ",
        destination: "/resources/webinars/the-evolution-of-cx-wbn-typ",
        permanent: true,
      },

      {
        source:
          "/resources/webinars/successful-case-study-snapshot-destcrm-wbn-lp",
        destination:
          "/resources/webinars/destcrm-successful-case-study-snapshot-wbn-typ",
        permanent: true,
      },
      // archive redirects
      {
        source: "/archive/policy-prior-to-01-June-2019",
        destination: "/archive/policy-prior-to-01-june-2019",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["assets.ujet.cx"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
};
