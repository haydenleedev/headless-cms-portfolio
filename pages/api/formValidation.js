import { Client, query } from "faunadb";

export default async function handler(req, res) {
  try {
    console.time("formValidation: total time");
    // parsedBody structure: {check: {ip: "", domain: ""}, client: {}, token: "" }
    const parsedBody = JSON.parse(req.body);

    // Reference: https://docs.fauna.com/fauna/current/api/fql/
    const {
      Let,
      IsNonEmpty,
      Or,
      Create,
      Get,
      Index,
      Match,
      Var,
      Map,
      Update,
      Collection,
      Select,
      Paginate,
      Lambda,
      If,
    } = query;

    if (!parsedBody.client || !parsedBody.check || !parsedBody.token) {
      throw new Error("Invalid request body!");
    }

    const client = new Client({
      endpoint: "https://db.us.fauna.com",
      secret: process.env.FAUNA_SERVER_SECRET,
    });
    // check IP/domain blocklist first
    console.time("formValidation: block check");

    const isBlacklisted = await client.query(
      Let(
        {
          matchIP: Match(Index("ip_address_by_value"), parsedBody.check.ip),
          matchDomain: Match(Index("domain_by_value"), parsedBody.check.domain),
        },
        If(
          Or(IsNonEmpty(Var("matchIP")), IsNonEmpty(Var("matchDomain"))),
          true,
          false
        )
      )
    );
    if (isBlacklisted) {
      return res
        .status(200)
        .json({ submissionAllowed: false, reason: "Disallowed" });
    }
    console.timeEnd("formValidation: block check");
    // if block list check was ok, proceed to creating recaptcha accessment
    console.time("formValidation: recaptcha");
    let assessment = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/ujet-cx-marketing-website/assessments?key=AIzaSyDei7-DOrMEvJzzIefivfXHRmOVt2uyFdo`,
      {
        method: "POST",
        body: JSON.stringify({
          event: {
            token: parsedBody.token,
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY,
            expectedAction: "FORM_SUBMISSION",
          },
        }),
      }
    );
    assessment = await assessment?.json();
    console.timeEnd("formValidation: recaptcha");
    const isAcceptableScore = assessment?.riskAnalysis?.score >= 0.3;
    if (!isAcceptableScore)
      return res
        .status(200)
        .json({ submissionAllowed: false, reason: "ReCAPTCHA failed" });
    // block list check and recaptcha assesment were ok, proceed to saving client data
    console.time("formValidation: save client data");

    let clientData = parsedBody.client;

    Object.keys(parsedBody.client).map((key) => {
      if (key === "") delete clientData[key];
    });
    await client.query(
      Let(
        {
          isPreviouslySubmitted: Match(
            Index("form_submission_by_email"),
            parsedBody.client["Email"]
          ),
        },
        If(
          IsNonEmpty(Var("isPreviouslySubmitted")),
          Let(
            {
              found: Select(
                ["data", 0],
                Map(
                  Paginate(Var("isPreviouslySubmitted"), { size: 1 }),
                  Lambda("result", Get(Var("result")))
                )
              ),
            },
            Update(Select("ref", Var("found")), {
              data: clientData,
            })
          ),
          Create(Collection("form_submissions"), {
            data: clientData,
          })
        )
      )
    );

    console.timeEnd("formValidation: save client data");
    console.timeEnd("formValidation: total time");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: false, reason: "Error" });
  }
}
