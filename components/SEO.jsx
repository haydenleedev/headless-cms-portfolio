import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { breadcrumbs, organization, webSite } from "../schema";
import Script from "next/script";
import { getCookie, setCookie } from "../utils/cookies";
import { useContext } from "react";
import GlobalContext from "../context";
import { formatPageTitle } from "../utils/convert";
import { useRouter } from "next/router";
import { getCampaignScript } from "../utils/pardotForm";

const SEO = ({
  title,
  description,
  keywords,
  metaHTML,
  url,
  pageTemplateName,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const campaignScriptAppendTimeout = useRef(null);
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  const qualifiedSrc = "https://js.qualified.com/qualified.js?token=";
  if (!getCookie("ga_cookie_date")) {
    setCookie(
      "ga_cookie_date",
      new Date().toUTCString(),
      "Fri, 31 Dec 9999 23:59:59 GMT"
    );
  }
  const { globalSettings, campaignScriptIDRef } = useContext(GlobalContext);
  const suffixedMetaTitle = formatPageTitle(
    title,
    globalSettings?.fields?.pageTitleSuffix
  );
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(true);
      window.removeEventListener("scroll", handleScroll);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    // Delay script loading with setTimeout
    setTimeout(() => {
      setTimerExpired(true);
    }, 0);

    router.events.on("routeChangeStart", () => {
      campaignScriptIDRef.current = null;
      clearTimeout(campaignScriptAppendTimeout.current);
      if (document.getElementById("campaignScript")) {
        document.head.removeChild(document.getElementById("campaignScript"));
      }
    });
    router.events.on("routeChangeComplete", async () => {
      campaignScriptAppendTimeout.current = setTimeout(() => {
        const scriptElements = document.head.getElementsByTagName("script");
        document.head.insertBefore(
          getCampaignScript(campaignScriptIDRef.current),
          scriptElements[scriptElements.length - 1].nextSibling
        );
      }, 2000);
    });
  }, []);

  return (
    <>
      <Head>
        <title key="title">{suffixedMetaTitle}</title>
        <meta name="generator" content="Agility CMS" />
        <meta name="agility_timestamp" content={new Date().toLocaleString()} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} key="description" />
        <meta name="keywords" content={keywords} />
        {/* Cloudflare Verification */}

        <meta name="cf-2fa-verify" content="c4be59459696dd6" />
        <meta name="cf-2fa-verify" content="1f8c066dd5d61c6" />
        {/* OG DATA */}
        <meta property="og:title" content={suffixedMetaTitle} key="ogtitle" />
        {url && <meta property="og:url" content={url} key="ogurl" />}
        <meta property="og:locale" content="en_US" key="oglocale" />
        <meta property="og:site_name" content="UJET" key="ogsitename" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta
          property="og:description"
          content={description}
          key="ogdescription"
        />
        <meta name="twitter:card" content="summary" key="twittercard" />
        <meta name="twitter:creator" content="@UJETcx" key="twittercreator" />
        <meta name="twitter:site" content="@UJETcx" key="twittersite" />
        {/* Note: this is usually overridden on component/page Head, since we can't easily get the image we want to use here as prop */}
        <meta
          property="og:image"
          content="https://assets.ujet.cx/FB-UJET-Image-V2.jpg"
          key="ogimage"
        />
        <meta
          property="og:image:alt"
          content={suffixedMetaTitle}
          key="ogimagealt"
        />

        {/* schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbs(url) }}
        />

        {/* TODO: add Canonical url */}
      </Head>
      {pageTemplateName !== "BrandTemplate" && (
        <>
          {timerExpired && (
            <>
              <Script id="google-tag-manager">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');`}
              </Script>
              {/* <Script id="bombora"> */}
              {/* Bombora Tag */}
              {/* {`
              //informer
              (function(f,i,c){var a=decodeURIComponent,e="",l="",o="||",g=";;",h="split",b="length",j="indexOf",k=0,n="localStorage",m="_ccmdt";f[c]=f[c]||{};function d(q){var p;if(f[n]){return f[n][q]||""}else{p=i.cookie.match(q+"=([^;]*)");return(p&&p[1])||""}}f[c].us={};e=a(d(m))[h](o);k=e[b];if(k>0){while(k--){l=e[k][h]("=");if(l[b]>1){if(l[1][j](g)>-1){f[c].us[l[0]]=l[1][h](g);f[c].us[l[0]].pop()}else{f[c].us[l[0]]=l[1]}}}}})(window,document,"_ml");

              //tag
              (function () {
                _ml = window._ml || {};
                _ml.eid = '84421';
                _ml.informer = {
                  callback: function (gaSet,gaSend) { //call back when profile is loaded
                    if (typeof dataLayer != 'undefined' && !_ml.isEmptyObj(_ml.us)) {
                      dataLayer.push({
                        'event' : 'Bombora_Informer',
                        'Bombora_Topic': (_ml.us.tp && _ml.us.tp.length > 0) ? _ml.us.tp[0] : '',
                        'Bombora_Company_Revenue': _ml.us.cr,
                        'Bombora_Company_Size': _ml.us.cs,
                        'Bombora_Domain': _ml.us.dm,
                        'Bombora_Seniority': _ml.us.sn,
                        'Bombora_Predictive_Category': (_ml.us.pc && _ml.us.pc.length > 0) ? _ml.us.pc[0] : '',
                        'Bombora_Decision_Maker': _ml.us.dcm,
                        'Bombora_Functional_Area': (_ml.us.fa && _ml.us.fa.length > 0) ? _ml.us.fa[0] : '',
                        'Bombora_Install_Data': (_ml.us.ins && _ml.us.ins.length > 0) ? _ml.us.ins[0] : '',
                        'Bombora_Professional_Group': (_ml.us.pg && _ml.us.pg.length > 0) ? _ml.us.pg[0] : '',
                        'Bombora_Education': _ml.us.edu,
                        'Bombora_Industry': _ml.us.ind
                      });
                    }
                  },
                  enable: true
                };
                var s = document.getElementsByTagName('script')[0], cd = new Date(), mltag = document.createElement('script');
                mltag.type = 'text/javascript'; mltag.async = true;
                mltag.src = 'https://ml314.com/tag.aspx?' + cd.getDate() + cd.getMonth() + cd.getFullYear();
                s.parentNode.insertBefore(mltag, s);
              })();
            `} */}
              {/* </Script> */}
              {/* <Script id="6sense2">
            {`
              window._6si = window._6si || [];
              window._6si.push(['enableEventTracking', true]);
              window._6si.push(['setToken', '${process.env.NEXT_PUBLIC_SIXSENSE_TOKEN}']);
              window._6si.push(['setEndpoint', 'b.6sc.co']);
              (function() {
                var gd = document.createElement('script');
                gd.type = 'text/javascript';
                gd.async = true;
                gd.src = '//j.6sc.co/6si.min.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(gd, s);
              })();
            `}
          </Script> */}

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

              {/* <Script
            id="google-optimize"
            src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
            strategy="lazyOnload"
          /> */}
              {/* <Script id="ax" strategy="afterInteractive">
            {`
          _atrk_opts = { atrk_acct:"xw4cw1Y1Mn20Io", domain:"ujet.cx",dynamic: true};
          (function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();
        `}
          </Script> */}
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
              <Script id="marketoAsynchMunchkin" strategy="afterInteractive">
                {`
          (function() {
            var didInit = false;
            function initMunchkin() {
              if(didInit === false) {
                didInit = true;
                Munchkin.init('205-VHT-559');
              }
            }
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = '//munchkin.marketo.net/munchkin.js';
            s.onreadystatechange = function() {
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                initMunchkin();
              }
            };
            s.onload = initMunchkin;
            document.getElementsByTagName('head')[0].appendChild(s);
          })();
          `}
              </Script>
              <Script
                src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY}`}
              />
            </>
          )}
          {/* Load Qualified script after user starts scrolling */}
          {scrolled && (
            <>
              {/* Qualified Script */}
              <Script id="qualified" strategy="lazyOnload">
                {`(function(w,q){w['QualifiedObject']=q;w[q]=w[q]||function(){
          (w[q].q=w[q].q||[]).push(arguments)};})(window,'qualified')`}
              </Script>
              <Script
                id="qualified-src"
                async
                src={`${qualifiedSrc}${process.env.NEXT_PUBLIC_QUALIFIED_TOKEN}`}
                strategy="lazyOnload"
              />
            </>
          )}
          <Script
            id="onetrust"
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            charSet="UTF-8"
            strategy="beforeInteractive"
            data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
          />

          <Script id="optanon-wrapper">{`function OptanonWrapper() { }`}</Script>
        </>
      )}
    </>
  );
};

export default SEO;
