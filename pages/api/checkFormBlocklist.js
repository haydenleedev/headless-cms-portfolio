export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    console.log("parsedBody", parsedBody);
    const postData = new URLSearchParams();
    postData.append("ip", parsedBody.ip);
    postData.append("domain", parsedBody.domain);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbx7VrTeDaUNiOpWEsXYl2-V9tHey2xfnO8YERb1JlokUjHNH4a1YUaQH2ptWCMS6kr1Ag/exec",
      {
        method: "POST",
        body: postData,
      }
    );
    const responseJSON = await response.json();
    console.log("response", responseJSON);
    return res.send({
      submissionAllowed: !responseJSON.blacklisted && !responseJSON.error,
    });
  } catch (error) {
    return res.send({ submissionAllowed: false });
  }
}
