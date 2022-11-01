export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// helper function for easier management of classNames.
export function cn(conditions) {
  if (
    (!Array.isArray(conditions) && conditions.length) ||
    (typeof conditions !== "object" && Object.keys(conditions).length < 1)
  )
    throw new Error(
      "Usage: cn({className: condition}); or cn(['class1', 'class2']);"
    );

  if (Array.isArray(conditions)) {
    return conditions.filter((c) => c).join(" ");
  }
  const conditionEntries = Object.entries(conditions);
  const appliedClasses = conditionEntries.map(([key, value]) => {
    if (Boolean(value)) return key;
    return null;
  });
  return appliedClasses.filter((c) => c).join(" ");
}
