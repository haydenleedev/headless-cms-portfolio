import { fetchAllProducts, refreshOAuthToken } from "../../shop/lib/zuora";

export default async function handler(req, res) {
  const accessToken = await refreshOAuthToken();
  const products = await fetchAllProducts(accessToken);
  res.status(200).json({ products });
}
