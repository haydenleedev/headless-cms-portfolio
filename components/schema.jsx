const Schema = () => {
  return (
    <script>
      {`{
          "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": "https://ujet.cx/#organization",
                    "name": "UJET",
                    "url": "https://ujet.cx/",
                    "sameAs": [
                        "https://www.facebook.com/UJETcx/",
                        "https://www.instagram.com/ujetcx/",
                        "https://www.linkedin.com/company/ujetcx/",
                        "https://www.youtube.com/ujetcx",
                        "https://twitter.com/UJETcx"
                    ],
                    "logo": "https://assets.ujet.cx/ujet-cx-logo.png",
                    "image" :"https://assets.ujet.cx/ujet-cx-logo.png"
                },
                {
                    "@type": "WebSite",
                    "@id": "https://ujet.cx/#website",
                    "url": "https://ujet.cx/",
                    "name": "UJET",
                    "description": "Reimagining Customer Support for a Connected World",
                    "publisher": {
                        "@id": "https://ujet.cx/#organization"
                    },
                    "potentialAction": [
                        {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://ujet.cx/?s={search_term_string}"
                            },
                            "query-input": "required name=search_term_string"
                        }
                    ],
                    "inLanguage": "en-US"
                },
                {
                    "@type": "WebPage",
                    "@id": "https://ujet.cx/resources/reports/aberdeen-mobile-engagement-lp/#webpage",
                    "url": "https://ujet.cx/resources/reports/aberdeen-mobile-engagement-lp/",
                    "name": "Aberdeen: Mobile Engagement- The Happier Customers & Better Business Results - UJET",
                    "isPartOf": {
                        "@id": "https://ujet.cx/#website"
                    },
                    "datePublished": "2021-12-06T16:03:56+00:00",
                    "dateModified": "2021-12-06T16:10:33+00:00",
                    "description": "Download the report for a deeper dive and to learn more about the role of mobile engagement in modern CX programs.",
                    "breadcrumb": {
                        "@id": "https://ujet.cx/resources/reports/aberdeen-mobile-engagement-lp/#breadcrumb"
                    },
                    "inLanguage": "en-US",
                    "potentialAction": [
                        {
                            "@type": "ReadAction",
                            "target": [
                                "https://ujet.cx/resources/reports/aberdeen-mobile-engagement-lp/"
                            ]
                        }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": "https://ujet.cx/resources/reports/aberdeen-mobile-engagement-lp/#breadcrumb",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://ujet.cx/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Resources",
                            "item": "https://ujet.cx/resources/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Reports",
                            "item": "https://ujet.cx/resources/reports/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 4,
                            "name": "Aberdeen: Mobile Engagement- The Happier Customers &#038; Better Business Results"
                        }
                    ]
                }
            ]
        }
    `}
    </script>
  );
};

export default Schema;
