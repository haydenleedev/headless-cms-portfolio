// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// This api endpoint is used to prevent CORS error with sending a request to the pardot endpoint.
export default async function handler(req, res) {
  try {
    console.time("ajaxRequest");
    const parsedBody = JSON.parse(req.body);
    if (
      !parsedBody.formObject.Email ||
      (parsedBody.formObject?.Email === "" &&
        parsedBody.formObject?.hiddenemail !== "")
    ) {
      parsedBody.formObject.Email = parsedBody.formObject.hiddenemail;
    }
    const formBody = Object.keys(parsedBody.formObject)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(parsedBody.formObject[key])
      )
      .join("&");
    if ((parsedBody.enpoint, parsedBody.formObject)) {
      const response = await fetch(parsedBody.endpoint, {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log(response);
      console.timeEnd("ajaxRequest");
      if (response.error) res.status(200).json({ success: false });
      res.status(200).json({ success: true });
    } else throw Error("No endpoint was provided.");
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: false });
  }

  res.status(200);
}
