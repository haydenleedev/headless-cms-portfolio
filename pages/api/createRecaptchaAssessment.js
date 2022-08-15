export default async function handler(req, res) {
  const parsedBody = JSON.parse(req.body);
  const assessment = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/ujet-cx-marketing-website/assessments?key=AIzaSyDei7-DOrMEvJzzIefivfXHRmOVt2uyFdo`,
    {
      method: "POST",
      body: JSON.stringify({
        event: {
          token: parsedBody.token,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY,
          expectedAction: "FORM_SUBMISSION",
        },
      }),
    }
  );
  const assessmentJSON = await assessment?.json();
  const isAcceptableScore = assessmentJSON?.riskAnalysis?.score >= 0.9;
  return res.send({ isAcceptableScore: isAcceptableScore });
}
