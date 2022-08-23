export default async function handler(req, res) {
  try {
    const parsedBody = JSON.parse(req.body);
    const postData = new URLSearchParams();
    postData.append("ip", parsedBody.ip);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyDgAwr8EsqrCq4vLXpwbgUt8sqLkeUzTBK89Xa04SL-Mgbq5o/exec",
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
