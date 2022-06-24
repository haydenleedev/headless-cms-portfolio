export default async function handler(req, res) {
  try {
    console.time("getPardotForm");

    const formId = JSON.parse(req.query.formId);

    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", `password`);
    urlencoded.append("client_secret", `${process.env.PARDOT_CLIENT_SECRET}`);
    urlencoded.append("client_id", `${process.env.PARDOT_CLIENT_ID}`);
    urlencoded.append("username", `${process.env.PARDOT_API_USERNAME}`);
    urlencoded.append("password", `${process.env.PARDOT_API_PASSWORD}`);

    var tokenResponse = await fetch(`${process.env.PARDOT_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "POST",
      },
      body: urlencoded,
    });

    // const pardotOAuthToken = await tokenResponse.json();

    tokenResponse = await tokenResponse.json();
    const token = tokenResponse.access_token;

    // TODO: missing Business Unit ID header, should find it in Salesforce / Pardot dashboard
    var formResponse = await fetch(
      `https://pi.pardot.com/api/v5/objects/forms/${formId}?fields=id,name,isDeleted,thankYouContent,submitButtonText,campaign.name,createdBy.username,updatedBy.username,createdAt,updatedAt`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    formResponse = await formResponse.json();

    console.timeEnd("getPardotForm");
    res.status(200).json({ form: formResponse });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
