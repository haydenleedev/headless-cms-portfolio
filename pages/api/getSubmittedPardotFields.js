import { Client, query } from "faunadb";

export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);

    const {
      Let,
      IsNonEmpty,
      Get,
      Index,
      Match,
      Var,
      Map,
      Select,
      Paginate,
      Lambda,
      If,
    } = query;

    const client = new Client({
      endpoint: "https://db.us.fauna.com",
      secret: process.env.FAUNA_SERVER_SECRET,
    });

    const submitted = await client.query(
      Let(
        {
          isPreviouslySubmitted: Match(
            Index("form_submissions_by_email"),
            parsedBody.email
          ),
        },
        If(
          IsNonEmpty(Var("isPreviouslySubmitted")),
          Select(
            ["data", 0],
            Map(
              Paginate(Var("isPreviouslySubmitted"), { size: 1 }),
              Lambda("result", Get(Var("result")))
            )
          ),
          false
        )
      )
    );
    return res.status(200).json({ submittedFields: submitted.data });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: false, reason: "Error" });
  }
}
