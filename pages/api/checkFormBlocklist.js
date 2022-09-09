export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    const postData = new URLSearchParams();
    postData.append("ip", parsedBody.ip);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby13GURhWG9DmUJk1qLy9XeITpQP_grLWJhshoLu13fgt5CGbs/exec",
      {
        method: "POST",
        body: postData,
      }
    );
    const responseJSON = await response.json();
    return res.send({
      submissionAllowed: !responseJSON.blacklistedIP && !responseJSON.error,
    });
  } catch (error) {
    return res.send({ submissionAllowed: false });
  }
}
