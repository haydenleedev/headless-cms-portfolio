export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const clientData = new URLSearchParams();
  Object.keys(body).forEach((key) => {
    clientData.append(key, body[key]);
  });
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycby95LtuXxBZcHePoWG51Ne5nGPUBi43sjw6fsVqT4lxmxP3t-0L2dLmhpdn-6BR5XzO/exec",
    {
      method: "POST",
      body: clientData,
    }
  );
  const data = await response.json();
  console.log("Response:", data);
  return res.send({ test: true });
}
