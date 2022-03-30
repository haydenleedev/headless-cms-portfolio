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
