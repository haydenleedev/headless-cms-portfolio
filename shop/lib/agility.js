import agility from "@agility/content-fetch";

export const getShopData = async () => {
  try {
    const api = agility.getApi({
      guid: process.env.AGILITY_GUID,
      apiKey: process.env.AGILITY_API_FETCH_KEY,
      isPreview: false,
    });

    const agilityPackages = await api.getContentList({
      referenceName: "packages",
      locale: "en-us",
      take: 50,
      expandAllContentLinks: true,
      sort: "properties.itemOrder",
    });
    const agilityAddOns = await api.getContentList({
      referenceName: "addons",
      locale: "en-us",
      take: 50,
    });
    const implementationServices = await api.getContentList({
      referenceName: "implementationServices",
      locale: "en-us",
      expandAllContentLinks: true,
      take: 50,
      sort: "properties.itemOrder",
      direction: "desc",
    });
    const shopConfig = await api.getContentItem({
      contentID: "3073",
      locale: "en-us",
      expandAllContentLinks: true,
    });

    return {
      agilityPackages: agilityPackages.items,
      includedFeaturesChartData: JSON.parse(
        shopConfig.fields.includedFeaturesChart
      ),
      addOnsChartData: JSON.parse(shopConfig.fields.addOnsChart),
      agilityAddOns: agilityAddOns.items,
      implementationServices: implementationServices.items,
      voiceUsage: {
        information: shopConfig.fields.voiceUsageInformation,
        data: shopConfig.fields.voiceUsageList,
      },
    };
  } catch (error) {
    throw new Error("error getting shop data... caused by: ", error.message);
  }
};
