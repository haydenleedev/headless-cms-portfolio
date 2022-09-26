export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    console.log("parsedBody", parsedBody);
    const postData = new URLSearchParams();
    postData.append("ip", parsedBody.ip);
    postData.append("domain", parsedBody.domain);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw2L1DpM7EWcBR1BWEFon_FvYHX8TbRrdTH585k-kPiaAO4hj6aaRr6p_i2A5UVM3LX/exec",
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
