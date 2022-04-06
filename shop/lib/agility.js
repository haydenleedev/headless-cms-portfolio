import agility from "@agility/content-fetch";
import { boolean } from "../../utils/validation";

export const getShopData = async () => {
  try {
    const api = agility.getApi({
      guid: process.env.AGILITY_GUID,
      apiKey: process.env.AGILITY_API_FETCH_KEY,
      isPreview: false,
    });

    let agilityPackages = await api.getContentList({
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

    agilityPackages = agilityPackages.items.map((item) => {
      const final = {
        ...item,
      };
      final.fields.includedFeatures = final.fields.includedFeatures.sort(
        (a, b) => {
          return a.properties.itemOrder - b.properties.itemOrder;
        }
      );
      final.fields.availableAddOns = final.fields.availableAddOns.sort(
        (a, b) => {
          return a.properties.itemOrder - b.properties.itemOrder;
        }
      );
      return final;
    });

    return {
      agilityPackages,
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
      freeTrialEnabled: boolean(shopConfig.fields.freeTrialEnabled)
    };
  } catch (error) {
    throw new Error("error getting shop data... caused by: ", error.message);
  }
};

export const getShopSEOData = async () => {
  try {
    const api = agility.getApi({
      guid: process.env.AGILITY_GUID,
      apiKey: process.env.AGILITY_API_FETCH_KEY,
      isPreview: false,
    });
    const shopConfig = await api.getContentItem({
      contentID: "3073",
      locale: "en-us",
      expandAllContentLinks: true,
    });
    return {
      shop: JSON.parse(shopConfig.fields.shopPageSEO),
      customize: JSON.parse(shopConfig.fields.customizePageSEO),
      subscriptionCycle: JSON.parse(shopConfig.fields.subscriptionCyclePageSEO),
      contactInformation: JSON.parse(
        shopConfig.fields.contactInformationPageSEO
      ),
      freeContactInformation: JSON.parse(
        shopConfig.fields.freeContactInformationPageSEO
      ),
      payment: JSON.parse(shopConfig.fields.paymentPageSEO),
      reviewOrder: JSON.parse(shopConfig.fields.reviewOrderPageSEO),
    };
  } catch (error) {
    throw new Error(
      "error getting shop seo data... caused by: ",
      error.message
    );
  }
};
