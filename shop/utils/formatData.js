export function formatPhoneNumber(value) {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

export function formatWebsite(website) {
  const s1 = website.split(".");
  const s2 = website.split("//");
  const s3 = website.split("//");

  let temp1;
  if (s1[0].includes("www")) {
    temp1 = s1[1];
    for (let i = 2; i < s1.length; i++) {
      temp1 = temp1 + "." + s1[i];
    }
  }
  const temp2 = s2[0].includes("http:") ? s2[1] : s2[0];
  const temp3 = s3[0].includes("https:") ? s3[1] : s3[0];

  return s1[0].includes("www")
    ? temp1
    : s2[0].includes("http:")
    ? temp2
    : s2[0].includes("https:")
    ? temp3
    : website;
}

export function getReducedZuoraObject(input) {
  function parseZuoraObject(zuoraObject) {
    if (Array.isArray(zuoraObject)) {
      return zuoraObject.map((obj) => {
        return parseZuoraObject(obj);
      });
    } else if (typeof zuoraObject === "object") {
      const reduced = { ...zuoraObject };
      for (const [key, value] of Object.entries(reduced)) {
        if (
          key.includes("__c") &&
          key !== "BillingFrequency__c" &&
          key !== "PlanType__c" &&
          key !== "SalesChannel__c"
        ) {
          delete reduced[key];
        } else if (Array.isArray(value)) {
          reduced[key] = getReducedZuoraObject(value);
        } else if (value === null) {
          delete reduced[key];
        } else if (typeof value === "object") {
          reduced[key] = parseZuoraObject(value);
        }
      }
      return reduced;
    } else {
      return zuoraObject;
    }
  }
  if (Array.isArray(input)) {
    const reduced = input.map((zuoraObject) => {
      return parseZuoraObject(zuoraObject);
    });
    return reduced;
  } else if (typeof input === "object") return parseZuoraObject(input);
}
