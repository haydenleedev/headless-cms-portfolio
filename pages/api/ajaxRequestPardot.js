import FormData from "form-data";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// This api endpoint is used to prevent CORS error with sending a request to the pardot endpoint.
export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    const formData = new FormData();
    for (let key in parsedBody.formObject) {
      formData.append(key, parsedBody.formObject[key]);
    }
    if ((parsedBody.enpoint, parsedBody.formObject)) {
      const response = await fetch(parsedBody.endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/formdata",
        },
      });
      if (response.error) res.status(200).json({ success: false });
      res.status(200).json({ success: true });
    } else throw Error("No endpoint was provided.");
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: false });
  }

  res.status(200);
}
