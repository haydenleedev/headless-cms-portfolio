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
        req.on("error", (error) => {
          console.error(error.message);
          reject();
        });
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

    let formHandlers = await httpsRequest(
      {
        hostname: `pi.pardot.com`,
        path: "/api/v5/objects/form-handlers?fields=id",
        headers: {
          Authorization: "Bearer " + token,
          "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
        },
      },
      "GET"
    );
    const formFieldData = [];
    let formFieldFetchError = false;
    for (let i = 0; i < formHandlers.values.length; i++) {
      let formHandlerFields = await httpsRequest(
        {
          hostname: `pi.pardot.com`,
          path: `/api/v5/objects/form-handler-fields?fields=id,name,dataFormat,isRequired,prospectApiFieldId,isMaintainInitialValue,errorMessage&formHandlerid=${formHandlers.values[i].id}`,
          headers: {
            Authorization: "Bearer " + token,
            "Pardot-Business-Unit-Id": process.env.PARDOT_BUSINESS_UNIT_ID,
          },
        },
        "GET"
      );
      if (typeof formHandlerFields !== "object" || !formHandlerFields?.values) {
        formFieldFetchError = true;
        break;
      }
      formFieldData.push({
        formHandlerID: formHandlers.values[i].id,
        fieldData: formHandlerFields.values,
      });
    }
    fs.writeFile(
      "./data/pardotFormData.json",
      formFieldFetchError ? JSON.stringify([]) : JSON.stringify(formFieldData),
      (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        console.info(
          formFieldFetchError
            ? "Something went wrong while fetching data from the Pardot API. Empty array written to file."
            : "Pardot form data written to file"
        );
      }
    );
  } catch (error) {
    if (console) console.error(error);
  }
})();
