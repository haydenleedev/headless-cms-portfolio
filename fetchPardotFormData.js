const fs = require("fs");
const https = require("https");
require("dotenv").config();
(async () => {
  try {
    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", `password`);
    urlencoded.append("client_secret", `${process.env.PARDOT_CLIENT_SECRET}`);
    urlencoded.append("client_id", `${process.env.PARDOT_CLIENT_ID}`);
    urlencoded.append("username", `${process.env.PARDOT_API_USERNAME}`);
    urlencoded.append("password", `${process.env.PARDOT_API_PASSWORD}`);

    function httpsRequest({ body, ...options }, method) {
      return new Promise((resolve, reject) => {
        const req = https.request(
          {
            method: method,
            ...options,
          },
          (res) => {
            const chunks = [];
            res.on("data", (data) => chunks.push(data));
            res.on("end", () => {
              let resBody = Buffer.concat(chunks);
              switch (res.headers["content-type"]) {
                case "application/json":
                  resBody = JSON.parse(resBody);
                  break;
              }
              resolve(resBody);
            });
          }
        );
        req.on("error", reject);
        if (body) {
          req.write(body);
        }
        req.end();
      });
    }

    const authHostname =
      process.env.PARDOT_API_URL.split("https://")[1].split("/")[0];
    const authPath = `/${
      process.env.PARDOT_API_URL.split("https://")[1].split(/\/(.*)/s)[1]
    }`;
    const authResponse = await httpsRequest(
      {
        hostname: authHostname,
        path: authPath,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Request-Method": "POST",
        },
        body: urlencoded.toString(),
      },
      "POST"
    );
    const tokenResponse = JSON.parse(authResponse.toString());
    const token = tokenResponse.access_token;

    const formHandlerFieldsResponse = await httpsRequest(
      {
        hostname: "pi.pardot.com",
        path: "/api/v5/objects/form-handler-fields?fields=id,name,dataFormat,isRequired,prospectApiFieldId,isMaintainInitialValue,errorMessage,formHandlerId&orderBy=ID",
        headers: {
          Authorization: "Bearer " + token,
          "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
        },
      },
      "GET"
    );

    fs.writeFile(
      "./data/pardotFormData.json",
      JSON.stringify(formHandlerFieldsResponse.values),
      (err) => {
        if (err) throw err;
        console.info("Pardot form data written to file");
      }
    );
  } catch (error) {
    if (console) console.error(error);
  }
})();
