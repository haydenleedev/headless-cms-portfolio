// This is an empty helper component that helps Agility get global site settings as global data

const GlobalSettings = () => null;

GlobalSettings.getCustomInitialProps = async function ({
  agility,
  languageCode,
  channelName,
}) {
  const api = agility;
  let contentItem = null;

  try {
    let data = await api.getContentList({
      referenceName: "globalSettings",
      languageCode: languageCode,
      take: 1,
      contentLinkDepth: 4,
    });

    if (data && data.items && data.items.length > 0) {
      contentItem = data.items[0];
    } else {
      return null;
    }
  } catch (error) {
    if (console) console.error("Could not load global settings.", error);
    return null;
  }
  // return clean object...
  return {
    data: contentItem,
  };
};

export default GlobalSettings;
