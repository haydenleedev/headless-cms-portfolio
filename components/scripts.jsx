import Script from "next/script";
const Scripts = () => {
  return (
    <>
      <Script id="google-tag-manager">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');`}
      </Script>
      <Script id="6sense">
        {`
var processEpsilonData = function(a) {
// --- Decode Response ---
if (a === '') {
// If the response is blank, stop processing
return;
}
var jData = JSON.parse(a);
// --- End Decode Response ---

// --- Push Company Details to GTM ---
window.dataLayer.push({
'company_name': jData.company.name,
'domain': jData.company.domain,
'country': jData.company.country,
'address': jData.company.address,
'company_state': jData.company.state,
'city': jData.company.city,
'zip': jData.company.zip,
'country_iso_code': jData.company.country_iso_code,
'industry': jData.company.industry,
'sic': jData.company.sic,
'sic_description': jData.company.sic_description,
'naics': jData.company.naics,
'naics_description': jData.company.naics_description,
'employee_range': jData.company.employee_range,
'employee_count': jData.company.employee_count,
'revenue_range': jData.company.revenue_range,
'annual_revenue': jData.company.annual_revenue,
'is_blacklisted': jData.company.is_blacklisted,
'state_code': jData.company.state_code,
'region': jData.company.region,
});
// --- End Company Details to GTM ---

// --- Push Segments to GTM ---
window.dataLayer.push({
'segment_ids': jData.segments.ids,
'segment_names': jData.segments.names,
'segment_lists': jData.segments.lists,
});
if (jData.segments.names) {
window.dataLayer.push({
'segments': jData.segments.names.join(',')
});
}
// --- End Push Segments to GTM ---

// --- Push Product Scores to GTM ---
if (jData.scores.length !== 0) {
for (var i = 0; i < jData.scores.length; i++) {
var product = jData.scores[i].product;
var scoreObject = {};
scoreObject[product] = jData.scores[i];
window.dataLayer.push(scoreObject);
}
}
// --- End Push Product Scores to GTM ---
 if(jData.scores.length != 0 && jData.scores[0]) {
var score = jData.scores[0];
window.dataLayer.push({
'buying_stage': score.buying_stage,
'profile_fit': score.profile_fit,
})
}
// --- Send Confidence Score to GTM ---
window.dataLayer.push({
'confidence': jData.confidence
});
// --- End Send Confidence Score to GTM ---

// --- Trigger Company Details Loaded in GTM ---
window.dataLayer.push({
'event': '6si_company_details_loaded'
});
// --- End Trigger Company Details Loaded in GTM ---
};

window._6si = window._6si || [];
window.dataLayer = window.dataLayer || [];
window._6si.push(['enableEventTracking', true]);
window._6si.push(['setToken', '${process.env.NEXT_PUBLIC_SIXSENSE_TOKEN}']); // REPLACE ME
window._6si.push(['setEpsilonKey', '${process.env.NEXT_PUBLIC_SIXSENSE_COMPANY_DETAILS_API_KEY}']); // REPLACE ME
window._6si.push(["setEndpoint", "b.6sc.co"]);
var epsilonName = 'enableCompanyDetails';
var enabled = true; // set to true to enable API
var callback = processEpsilonData; // optional callback
var version = 3; // 3 for v3
window._6si.push([epsilonName, enabled, callback, version]);
(function() {
var gd = document.createElement('script');
gd.type = 'text/javascript';
gd.async = true;
gd.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'j.6sc.co/6si.min.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(gd, s);
})();
`}
      </Script>
      <Script id="g2Crowd" strategy="afterInteractive">
        {`
(function (c, p, d, u, id, i) {
id = ''; // Optional Custom ID for user in your system
u = 'https://tracking.g2crowd.com/attribution_tracking/conversions/' + c + '.js?p=' + encodeURI(p) + '&e=' + id;
i = document.createElement('script');
i.type = 'application/javascript';
i.async = true;
i.src = u;
d.getElementsByTagName('head')[0].appendChild(i);
}("1136", document.location.href, document));
`}
      </Script>
      <Script
        id="onetrust"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        charSet="UTF-8"
        strategy="beforeInteractive"
        data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
      />

      <Script id="optanon-wrapper">{`function OptanonWrapper() { }`}</Script>
    </>
  );
};

export default Scripts;
