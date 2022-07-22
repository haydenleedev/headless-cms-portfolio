export default async function handler(req, res) {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycby95LtuXxBZcHePoWG51Ne5nGPUBi43sjw6fsVqT4lxmxP3t-0L2dLmhpdn-6BR5XzO/exec",
    {
      method: "POST",
      body: { ip: "test", country: "test" },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log("Response:", data);
  return res.send({ test: true });
}
