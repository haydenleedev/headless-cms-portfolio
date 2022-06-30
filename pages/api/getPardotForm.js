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

    // Form
    // var formResponse = await fetch(
    //   `https://pi.pardot.com/api/v5/objects/forms/${formId}?fields=id,name,isDeleted,thankYouContent,submitButtonText,campaign.name,createdBy.username,updatedBy.username,createdAt,updatedAt,embedCode,layoutTemplateId`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
    //     },
    //   }
    // );

    // formResponse = await formResponse.json();

    // Layout template
    // var layoutTemplateResponse = await fetch(
    //   `https://pi.pardot.com/api/v5/objects/layout-templates/${formResponse.layoutTemplateId}?fields=name,layoutContent,formContent`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
    //     },
    //   }
    // );

    // layoutTemplateResponse = await layoutTemplateResponse.json();

    // Form handler fields
    var formHandlerFieldsResponse = await fetch(
      `https://pi.pardot.com/api/v5/objects/form-handler-fields?fields=id,name,dataFormat,isRequired,prospectApiFieldId,isMaintainInitialValue,errorMessage,formHandlerId&orderBy=ID`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
        },
      }
    );

    formHandlerFieldsResponse = await formHandlerFieldsResponse.json();

    console.timeEnd("getPardotForm");
    res.status(200).json({ formHandlerFieldsResponse });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
