export default async function handler(req, res) {
  const { body } = req;
  const parsedBody = JSON.parse(body);
  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_GREENHOUSE_JOB_LIST_API_ENDPOINT}/${parsedBody.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.GREENHOUSE_JOB_BOARD_API_KEY
        ).toString("base64")}`,
      },
      body: JSON.stringify(parsedBody.applicationData),
    }
  );
  const postSuccess = postResponse.status == 200;
  return res.send({ postSuccess: postSuccess });
}
