export const logErrorToGraphJSON = async (error) => {
  const payload = {
    api_key: process.env.NEXT_PUBLIC_GRAPHJSON_API_KEY,
    collection: "error_logs",
    json: JSON.stringify(error),
    timestamp: Math.floor(new Date().getTime() / 1000),
  };
  await fetch("https://api.graphjson.com/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};
