export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const clientData = new URLSearchParams();
    Object.keys(body).forEach((key) => {
      clientData.append(key, body[key]);
    });
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwS8kFTFhN4vPpykcC9LcxsCdSjxtMnWXCHwNxUsOxKOKeZo90YGDztuIeBqrIQzhWhLw/exec",
      {
        method: "POST",
        body: clientData,
      }
    );
    const data = await response.json();
    console.log("Response:", data);
    return res.send({ success: true });
  } catch (error) {
    return res.send({ success: false });
  }
}
