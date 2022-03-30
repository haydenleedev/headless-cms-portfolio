import { getOrderPreview, refreshOAuthToken } from "../../shop/lib/zuora";

export default async function handler(req, res) {
  const accessToken = await refreshOAuthToken();
  const subData = JSON.parse(req.body);
  const subscriptions = await getOrderPreview(accessToken, subData);
  res.status(200).json({ subscriptions });
}
