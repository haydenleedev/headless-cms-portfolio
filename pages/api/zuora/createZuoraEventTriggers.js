// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createEventTriggers, refreshOAuthToken } from "../../../shop/lib/zuora";

export default async function handler(req, res) {
  try {
    const accessToken = await refreshOAuthToken();
    await createEventTriggers(accessToken);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
}
