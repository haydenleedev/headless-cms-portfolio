import { emailRegex, usPhoneRegex, websiteRegex } from "../constants";

export function isEmail(email) {
  return email.match(emailRegex);
}

export function isWebsite(website) {
  return website.match(websiteRegex);
}

export function isPhoneNumber(phoneNumber) {
  return phoneNumber.match(usPhoneRegex);
}

const freeEmailDomains = [
  /@gmail.com/,
  /@yahoo.com/,
  /@msn.com/,
  /@comcast.net/,
  /@hotmail.com/,
  /@icloud.com/,
];
let freeEmailRegex;

export function isFreeEmail(email) {
  if (
    freeEmailDomains.some((domain) =>
      domain.test(String(email).toLocaleLowerCase())
    )
  ) {
    return true;
  } else {
    return false;
  }
}
