import { getShopData } from "./agility";
import { getRequestWithAuth, postWithCustomHeader } from "./api";

export async function refreshOAuthToken() {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "POST",
  };

  let urlencoded = new URLSearchParams();
  urlencoded.append("client_id", `${process.env.ZUORA_CLIENT_ID}`);
  urlencoded.append("client_secret", `${process.env.ZUORA_CLIENT_SECRET}`);
  urlencoded.append("grant_type", "client_credentials");
  const res = await postWithCustomHeader(
    `${process.env.ZUORA_API_URL}/oauth/token`,
    urlencoded,
    headers
  );
  return res.access_token;
}

/*
Fetch the listed products from zuora product catalog.
Params:
  token: OAuth Token
Logic:
  All agility products that have a matching id are returned from zuora.
*/
export async function fetchAllProducts(token, agilityPackages) {
  try {
    const ids = agilityPackages
      .map((item) => {
        if (process.env.ACTIVE_ENVIRONMENT === "production")
          return item.fields.productionID;
        return item.fields.previewID;
      })
      .filter((item) => item);
    const products = ids.map((productId) =>
      getRequestWithAuth(
        `${process.env.ZUORA_API_URL}/v1/catalog/product/${productId}`,
        token
      )
    );
    const result = await Promise.all(products);
    return result.filter((product) => product.success === true);
  } catch (error) {
    return [];
  }
}

/*
Function to create an array of data of all base products.
Data from Zuora and AgilityCMS is merged to create a final sorted array.
*/
export async function getHomePageData(token) {
  try {
    const { agilityPackages, includedFeaturesChartData, addOnsChartData } =
      await getShopData();

    const findAgilityPackage = (id) =>
      agilityPackages.find(
        (item) =>
          (process.env.ACTIVE_ENVIRONMENT === "production" &&
            id === item?.fields?.productionID) ||
          (process.env.ACTIVE_ENVIRONMENT === "preview" &&
            id === item?.fields?.previewID)
      );

    const products = await fetchAllProducts(token, agilityPackages);

    if (products.length > 0) {
      let finalProducts = [];
      products.map((prod) =>
        prod.productRatePlans.map((productRatePlan) => {
          if (productRatePlan.BillingFrequency__c === "Annual") {
            const agilityPackage = findAgilityPackage(prod.id);
            let finalProduct = productRatePlan;
            finalProduct.primaryId = prod.id;
            finalProduct.addOnSKUs = prod.Addons__c
              ? prod.Addons__c.split(";")
              : null;
            finalProduct.includes = agilityPackage.fields.includedFeatures;
            finalProduct.packageName = agilityPackage.fields.name;
            finalProduct.packageFeaturesAlsoIncluded = agilityPackage.fields
              .alsoIncluded
              ? agilityPackage.fields.alsoIncluded.fields.name
              : null;
            finalProducts.push(finalProduct);
          }
        })
      );

      // Filter rate plan charges to find per unit charges in USD and assign the charge to price key.
      finalProducts.map((finalProduct) => {
        // package data from AgilityCMS
        const agilityPackage = findAgilityPackage(finalProduct.primaryId);

        const charges = finalProduct.productRatePlanCharges.filter(
          (plan) => plan.model === "PerUnit"
        );
        const price = charges[0].pricing.filter(
          (prices) => prices.currency === "USD"
        );
        finalProduct.price = price[0].price;

        // make sure we include only the add-ons that are defined in Zuora even if it's defined in Agility.
        finalProduct.addOns = agilityPackage.fields.availableAddOns
          .map((addOn) => {
            const found = finalProduct.addOnSKUs?.find?.(
              (sku) => sku.trim() === addOn.fields.zuoraSKU
            );
            if (found) {
              return {
                name: addOn.fields.name,
                tooltip: addOn.fields.description,
              };
            }
          })
          .filter((addOn) => addOn);
      });

      // sort products according to below order
      const sortList = ["Basic", "Pro", "Enterprise", "Digital"];
      const sortedObj = finalProducts.sort(
        (a, b) =>
          sortList.indexOf(a.PlanType__c.split(" ")[0]) -
          sortList.indexOf(b.PlanType__c.split(" ")[0])
      );

      // Add Free Plan data
      const freePlanData = agilityPackages.find(
        (agilityPackage) => agilityPackage.fields.name === "Free"
      );
      sortedObj.push({
        includes: freePlanData.fields.includedFeatures,
      });
      return {
        products: sortedObj,
        includedFeaturesChartData,
        addOnsChartData,
      };
    } else {
      return { products: null, includes: null, addOns: null };
    }
  } catch (error) {
    console.trace(error.message);
    return { products: null, includes: null, addOns: null };
  }
}

// Return Add-Ons of a specific product
export async function addOnServices2(token, productId) {
  try {
    const { agilityAddOns, agilityPackages } = await getShopData();
    const product = await getProduct(productId, token);
    const products = await fetchAllProducts(token, agilityPackages);
    const addOnIds = agilityAddOns
      .map((item) => {
        if (process.env.ACTIVE_ENVIRONMENT === "production")
          return item.fields.productionID;
        return item.fields.previewID;
      })
      .filter((id) => id);

    const addOnSKUs = product.Addons__c.split(";");
    let addOns = [];
    if (addOnSKUs.length > 0) {
      const addOnProducts = addOnIds.map((productId) =>
        getRequestWithAuth(
          `${process.env.ZUORA_API_URL}/v1/catalog/product/${productId}`,
          token
        )
      );
      const result = await Promise.all(addOnProducts);
      addOns = result.filter(
        (prod) => prod && addOnSKUs.find((sku) => sku.trim() === prod.sku)
      );
    }
    return { addOns, products };
  } catch (error) {
    return { addOns: null, products: null };
  }
}

export async function getProduct(id, token) {
  try {
    const product = await getRequestWithAuth(
      `${process.env.ZUORA_API_URL}/v1/object/product/${id}`,
      token
    );
    return product;
  } catch (error) {
    return null;
  }
}

export async function getRatePlans(id, token) {
  try {
    let plans = [];
    const productPlans = await getRequestWithAuth(
      `${process.env.ZUORA_API_URL}/v1/rateplan/${id}/productRatePlan`,
      token
    );
    if (productPlans.productRatePlans.length > 0) {
      plans = productPlans.productRatePlans;
      const filtered = plans.filter((x) => x.SalesChannel__c === "ecom");
      return filtered;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

/*
Fetch all Implementation products from zuora product catalog .
Params:
  token: OAuth Token
Logic:
  get the implementation products from Zuora based on implementation service ids in AgilityCMS.
*/
export async function getImplementation(token) {
  try {
    const { agilityPackages, voiceUsage, implementationServices } =
      await getShopData();
    const products = await fetchAllProducts(token, agilityPackages);
    const implementationIds = implementationServices
      .map((item) => {
        if (process.env.ACTIVE_ENVIRONMENT === "production")
          return item.fields.productionID;
        return item.fields.previewID;
      })
      .filter((id) => id);
    const implementationProducts = implementationIds.map((productId) =>
      getRequestWithAuth(
        `${process.env.ZUORA_API_URL}/v1/catalog/product/${productId}`,
        token
      )
    );
    const implementations = await Promise.all(implementationProducts);
    implementations.map((implementation) => {
      // agility data
      const implementationServiceData = implementationServices.find((item) => {
        if (process.env.ACTIVE_ENVIRONMENT === "production")
          return item.fields.productionID === implementation.id;
        return item.fields.previewID === implementation.id;
      });
      implementation.implementationName = implementationServiceData.fields.name;
    });
    return { implementations, products, implementationServices, voiceUsage };
  } catch (error) {
    return {
      implementations: null,
      products: null,
      implementationServices: null,
      voiceUsage: null,
    };
  }
}

// Generate RSA Signature for Payment Information Page
export async function getRSASignature(token) {
  try {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      uri: `${process.env.NEXT_PUBLIC_ZUORA_PAYMENT_URL}/apps/PublicHostedPageLite.do`,
      pageId: process.env.NEXT_PUBLIC_ZUORA_HOSTED_PAGE_ID,
      method: "POST",
    });

    const response = await postWithCustomHeader(
      `${process.env.ZUORA_API_URL}/v1/rsa-signatures`,
      raw,
      myHeaders
    );
    return response;
  } catch (error) {
    return null;
  }
}

// Create Account and Order
export async function addSubscription(token, subData) {
  try {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    let today = new Date().toISOString().slice(0, 10);

    // Adding Base product data and quantity and Consumption product with 1 quantity
    let data = [
      {
        chargeOverrides: [
          {
            productRatePlanChargeId: subData.baseProduct.ratePlanChargeId,
            pricing: {
              recurringPerUnit: {
                quantity: subData.licenses,
              },
            },
          },
        ],
        productRatePlanId: subData.baseProduct.ratePlanId,
      },
      {
        productRatePlanId:
          process.env.ZUORA_CONSUMPTION_Platform_bundle_license_ID,
      },
    ];

    const subscribeData = {
      newAccount: {
        billCycleDay: 0,
        billToContact: {
          address1: subData.contactInfo.street,
          city: subData.contactInfo.city,
          state: subData.contactInfo.state,
          country: subData.contactInfo.country,
          firstName: subData.contactInfo.firstName,
          lastName: subData.contactInfo.lastName,
          workEmail: subData.contactInfo.email,
        },
        currency: "USD",
        name: `${subData.contactInfo.companyName}`,
        customFields: {
          EcomSalesChannel__c: "ecom",
        },
        hpmCreditCardPaymentMethodId: subData.hpmCreditCardPaymentMethodId,
        crmId: subData.accountNumber,
        batch: "Batch10",
      },
      orderDate: today,
      processingOptions: {
        applyCreditBalance: true,
        billingOptions: {},
        collectPayment: true,
        runBilling: true,
      },
      subscriptions: [
        {
          orderActions: [
            {
              createSubscription: {
                subscribeToRatePlans: [],
                terms: {
                  autoRenew: true,
                  initialTerm: {
                    period: 12,
                    periodType: "Month",
                    startDate: `${today}`,
                    termType: "TERMED",
                  },
                  renewalSetting: "RENEW_WITH_SPECIFIC_TERM",
                  renewalTerms: [
                    {
                      period: 12,
                      periodType: "Month",
                    },
                  ],
                },
              },
              triggerDates: [
                {
                  name: "CustomerAcceptance",
                  triggerDate: `${today}`,
                },
                {
                  name: "ServiceActivation",
                  triggerDate: `${today}`,
                },
              ],
              type: "CreateSubscription",
            },
          ],
        },
      ],
    };

    // Adding Add-On products with number of licenses if any selected
    if (subData.addOns?.length) {
      for (let i = 1; i < subData.addOns.length + 1; i++) {
        data.push({
          chargeOverrides: [
            {
              productRatePlanChargeId: subData.addOns[i - 1].ratePlanChargeId,
              pricing: {
                recurringPerUnit: {
                  quantity: subData.licenses,
                },
              },
            },
          ],
          productRatePlanId: subData.addOns[i - 1].ratePlanId,
        });
        const consumption = getConsumptionProduct(subData.addOns[i - 1].id);
        if (consumption) {
          data.push(consumption);
        }
      }
    }

    // Adding Implementation product. Starter Implementation preselected on Subscription Cycle page
    if (subData.implementations) {
      data.push({
        productRatePlanId: `${subData.implementations}`,
      });
    }

    subscribeData.subscriptions[0].orderActions[0].createSubscription.subscribeToRatePlans =
      data;

    const response = await postWithCustomHeader(
      `${process.env.ZUORA_API_URL}/v1/orders`,
      JSON.stringify(subscribeData),
      myHeaders
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Create Order Preview to see final products and charges
export async function getOrderPreview(token, subData) {
  try {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    let today = new Date().toISOString().slice(0, 10);

    let data = [
      {
        chargeOverrides: [
          {
            productRatePlanChargeId: subData.baseProduct.ratePlanChargeId,
            pricing: {
              recurringPerUnit: {
                quantity: subData.licenses,
              },
            },
          },
        ],
        productRatePlanId: subData.baseProduct.ratePlanId,
      },
      {
        productRatePlanId:
          process.env.ZUORA_CONSUMPTION_Platform_bundle_license_ID,
      },
    ];

    const subscribeData = {
      orderDate: `${today}`,
      previewOptions: {
        previewThruType: "SpecificDate",
        previewTypes: ["OrderMetrics", "BillingDocs", "ChargeMetrics"],
        specificPreviewThruDate: `${today}`,
      },
      previewAccountInfo: {
        billCycleDay: 0,
        currency: "USD",
      },
      subscriptions: [
        {
          orderActions: [
            {
              createSubscription: {
                subscribeToRatePlans: [],
                terms: {
                  autoRenew: true,
                  initialTerm: {
                    period: 12,
                    periodType: "Month",
                    startDate: `${today}`,
                    termType: "TERMED",
                  },
                  renewalSetting: "RENEW_WITH_SPECIFIC_TERM",
                  renewalTerms: [
                    {
                      period: 12,
                      periodType: "Month",
                    },
                  ],
                },
              },
              triggerDates: [
                {
                  name: "CustomerAcceptance",
                  triggerDate: `${today}`,
                },
                {
                  name: "ServiceActivation",
                  triggerDate: `${today}`,
                },
              ],
              type: "CreateSubscription",
            },
          ],
        },
      ],
    };

    if (subData.addOns?.length) {
      for (let i = 1; i < subData.addOns.length + 1; i++) {
        data.push({
          chargeOverrides: [
            {
              productRatePlanChargeId: subData.addOns[i - 1].ratePlanChargeId,
              pricing: {
                recurringPerUnit: {
                  quantity: subData.licenses,
                },
              },
            },
          ],
          productRatePlanId: subData.addOns[i - 1].ratePlanId,
        });
        const consumption = getConsumptionProduct(subData.addOns[i - 1].id);
        if (consumption) {
          data.push(consumption);
        }
      }
    }

    if (subData.implementations) {
      data.push({
        productRatePlanId: `${subData.implementations}`,
      });
    }

    subscribeData.subscriptions[0].orderActions[0].createSubscription.subscribeToRatePlans =
      data;
    const response = await postWithCustomHeader(
      `${process.env.ZUORA_API_URL}/v1/orders/preview`,
      JSON.stringify(subscribeData),
      myHeaders
    );
    return response;
  } catch (error) {
    return null;
  }
}

// Function to add consumtpion product for a specific selected Add-On product
function getConsumptionProduct(id) {
  if (id === process.env.ZUORA_ADD_ON_SECURE_PAYMENTS_ID) {
    return {
      productRatePlanId:
        process.env.ZUORA_CONSUMPTION_Secure_payment_License_ID,
    };
  } else if (id === process.env.ZUORA_ADD_ON_SMS_CHANNEL_ID) {
    return {
      productRatePlanId: process.env.ZUORA_CONSUMPTION_SMS_channel_license_ID,
    };
  } else if (id === process.env.ZUORA_ADD_ON_VOICE_CHANNEL_ID) {
    return {
      productRatePlanId: process.env.ZUORA_CONSUMPTION_Voice_channel_license_ID,
    };
  } else if (id === process.env.ZUORA_ADD_ON_CHAT_CHANNEL_ID) {
    return {
      productRatePlanId: process.env.ZUORA_CONSUMPTION_Chat_channel_license_ID,
    };
  }
}

export async function createEventTriggers(token) {
  const productTrigger = {
    active: true,
    baseObject: "Product",
    condition:
      "changeType == 'UPDATE' || changeType == 'INSERT' || changeType == 'DELETE'",
    description:
      "Trigger an event when a product is updated, created or deleted",
    eventType: {
      description:
        "Trigger an event when a product is updated, created or deleted",
      displayName: "Product changes",
      name: "ProductChanges",
    },
  };

  const ratePlanTrigger = {
    active: true,
    baseObject: "ProductRatePlan",
    condition:
      "changeType == 'UPDATE' || changeType == 'INSERT' || changeType == 'DELETE'",
    description:
      "Trigger an event when a ProductRatePlan is updated or deleted",
    eventType: {
      description:
        "Trigger an event when a ProductRatePlan is updated or deleted",
      displayName: "ProductRatePlan changes",
      name: "ProductRatePlanChanges",
    },
  };

  const ratePlanChargeTrigger = {
    active: true,
    baseObject: "ProductRatePlanCharge",
    condition:
      "changeType == 'UPDATE' || changeType == 'INSERT' || changeType == 'DELETE'",
    description:
      "Trigger an event when a ProductRatePlanCharge is updated or deleted",
    eventType: {
      description:
        "Trigger an event when a ProductRatePlanCharge is updated or deleted",
      displayName: "ProductRatePlanCharge changes",
      name: "ProductRatePlanChargeChanges",
    },
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  const productRes = await postWithCustomHeader(
    `${process.env.ZUORA_API_URL}/events/event-triggers`,
    JSON.stringify(productTrigger),
    headers
  );

  console.log(productRes);
  console.log(`Zuora event trigger '${productRes.eventType.name}' created`);

  const productRatePlanRes = await postWithCustomHeader(
    `${process.env.ZUORA_API_URL}/events/event-triggers`,
    JSON.stringify(ratePlanTrigger),
    headers
  );

  console.log(productRatePlanRes);
  console.log(
    `Zuora event trigger '${productRatePlanRes.eventType.name}' created`
  );

  const productRatePlanChargeRes = await postWithCustomHeader(
    `${process.env.ZUORA_API_URL}/events/event-triggers`,
    JSON.stringify(ratePlanChargeTrigger),
    headers
  );

  console.log(productRatePlanChargeRes);
  console.log(
    `Zuora event trigger '${productRatePlanChargeRes.eventType.name}' created`
  );
}
