import Head from "next/head";
import { breadcrumbs, organization, webSite } from "../schema";
import Script from "next/script";
import { setCookie } from "../utils/cookies";
import { useContext } from "react";
import GlobalContext from "../context";
import { formatPageTitle } from "../utils/convert";

const SEO = ({ title, description, keywords, metaHTML, url }) => {
  // setup and parse additional header markup
  // TODO: probably dangerouslySetInnerHTML...
  const googleOptimize = "https://www.googleoptimize.com/optimize.js?id=";
  const qualifiedSrc = "https://js.qualified.com/qualified.js?token=";
  setCookie(
    "ga_cookie_date",
    new Date().toUTCString(),
    "Fri, 31 Dec 9999 23:59:59 GMT"
  );
  const { globalSettings } = useContext(GlobalContext);
  const suffixedMetaTitle = formatPageTitle(
    title,
    globalSettings?.fields?.pageTitleSuffix
  );
  return (
    <>
      <Head>
        <title key="title">{suffixedMetaTitle}</title>
        <meta name="generator" content="Agility CMS" />
        <meta name="agility_timestamp" content={new Date().toLocaleString()} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} key="description" />
        <meta name="keywords" content={keywords} />
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
        <script type="application/ld+json">
          {JSON.stringify(organization)}
        </script>
        <script type="application/ld+json">{JSON.stringify(webSite)}</script>
        <script type="application/ld+json">{breadcrumbs(url)}</script>

        {/* TODO: add Canonical url */}
      </Head>
      {/* <Script
        id="onetrust"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        charSet="UTF-8"
        strategy="beforeInteractive"
        data-domain-script={`${process.env.NEXT_PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT}`}
      />

      <Script id="optanon-wrapper">
        {`function OptanonWrapper() { }`}
      </Script> */}

      {/* <Script id="google-tag-manager">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');`}
      </Script>
      <Script
        id="google-optimize"
        src={`${googleOptimize}${process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_ID}`}
        strategy="lazyOnload"
      />

      <Script id="bombora">*/}
        {/* Bombora Tag */}
        {/*{`
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
        `}
      </Script> */}

      {/* <Script id="6sense">
        {`window._6si = window._6si || [];
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
          })();`}
      </Script> */}

      {/* Qualified Script */}
      <Script id="qualified">
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
  );
};

export default SEO;
