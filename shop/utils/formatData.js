export function formatPhoneNumber(value) {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, '');
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
  const s1 = website.split('.');
  const s2 = website.split('//');
  const s3 = website.split('//');

  let temp1;
  if (s1[0].includes('www')) {
    temp1 = s1[1];
    for (let i = 2; i < s1.length; i++) {
      temp1 = temp1 + '.' + s1[i];
    }
  }
  const temp2 = s2[0].includes('http:') ? s2[1] : s2[0];
  const temp3 = s3[0].includes('https:') ? s3[1] : s3[0];

  return s1[0].includes('www')
    ? temp1
    : s2[0].includes('http:')
    ? temp2
    : s2[0].includes('https:')
    ? temp3
    : website;
}
