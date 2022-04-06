import { createLead, createConnection } from "../../shop/lib/salesForce";

export default async function handler(req, res) {
  try {
    console.time("createSFLead")
    const connection = await createConnection();
    const Id = await createLead(connection, JSON.parse(req.query.leadInfo));
    console.timeEnd("createSFLead");
    res.status(200).json({ Id: `${Id}` });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
