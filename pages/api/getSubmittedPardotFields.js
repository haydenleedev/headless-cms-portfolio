export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    const postData = new URLSearchParams();
    postData.append("formStepQuery", true);
    postData.append("email", parsedBody.email);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxoTIUzoVwEmuIawEp8SFZV9-pEiKPBXPrK_UEMSLpTNBtPgdM/exec",
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
