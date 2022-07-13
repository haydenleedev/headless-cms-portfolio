export default async function getPardotForm() {
  try {
    console.time("getPardotForm");

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

    tokenResponse = await tokenResponse.json();
    const token = tokenResponse.access_token;

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
    return JSON.stringify(formHandlerFieldsResponse);
  } catch (error) {
    if (console) console.error(error);
  }
}
