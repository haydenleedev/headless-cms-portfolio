export default async function handler(req, res) {
  const parsedBody = JSON.parse(req.body);
  const assessment = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/ujet-cx-marketing-website/assessments?key=AIzaSyDei7-DOrMEvJzzIefivfXHRmOVt2uyFdo`,
    {
      method: "POST",
      body: JSON.stringify({
        event: {
          token: parsedBody.token,
          siteKey: "6LcCUkQhAAAAALRJTYiLND_SN9Ja4B_xJ9Hq7TbK",
          expectedAction: "FORM_SUBMISSION",
        },
      }),
    }
  );
  const assessmentJSON = await assessment.json();
  const isAcceptableScore = assessmentJSON.riskAnalysis.score >= 0.3;
  return res.send({ isAcceptableScore: isAcceptableScore });
}
