// use to get a specific cookie by name
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const setCookie = (name, value, expirationDate) => {
  if (typeof document !== "undefined") {
    if (!getCookie(name)) {
      document.cookie = `${name}=${value};${expirationDate ? `expires=${expirationDate}` : null}`;
    }
  }
}
