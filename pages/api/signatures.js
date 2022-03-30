import { getRSASignature, refreshOAuthToken } from "../../shop/lib/zuora";

export default async function handler(req, res) {
  const token = await refreshOAuthToken();
  const signatureData = await getRSASignature(token);
  res.status(200).json({ signatureData });
}
