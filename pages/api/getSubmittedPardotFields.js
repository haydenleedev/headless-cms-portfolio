export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    const postData = new URLSearchParams();
    postData.append("formStepQuery", true);
    postData.append("email", parsedBody.email);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwS8kFTFhN4vPpykcC9LcxsCdSjxtMnWXCHwNxUsOxKOKeZo90YGDztuIeBqrIQzhWhLw/exec",
      {
        method: "POST",
        body: postData,
      }
    );
    const responseJSON = await response.json();
    return res.send({ submittedFields: responseJSON });
  } catch (error) {
    return res.send({ success: false });
  }
}
