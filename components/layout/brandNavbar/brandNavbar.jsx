import style from "./brandNavbar.module.scss";
import dynamic from "next/dynamic";
const BrandNavbarNav = dynamic(()=> import("./brandNavbarNav/brandNavbarNav"),{ssr:false})
const BrandNavbar = ({ globalData }) => {
  return (
    <header className={`${style.navbar} `}>
      <BrandNavbarNav
        globalData={globalData}
      />
    </header>
  );
};

BrandNavbar.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let navbarGroups = null;

  try {
    let brandNavbar = await api.getContentList({
      referenceName: "BrandNavbarConfiguration",
      languageCode: languageCode,
      contentLinkDepth: 5,
      expandAllContentLinks: true,
    });

    if (brandNavbar && brandNavbar.items && brandNavbar.items.length > 0) {
      navbarGroups = brandNavbar.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console)
      console.error("Could not load site navbar configuration.", error);
    return null;
  }

  // return clean object...
  return {
    brandNavbar: navbarGroups,
  };
};

export default BrandNavbar;
