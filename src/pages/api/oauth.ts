import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code;

  try {
    const response = await fetch(
      `https://api.twitter.com/2/oauth2/token?code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:3001/redirect&code_verifier=challenge`,
      {
        headers: {
          Authorization:
            "Basic TmxsaVdXUXdlbnBvVFVoVlh6aHpYMEZuTUVzNk1UcGphUTpvaTA1VnVZeWVwa3dvQmZoVlJSeGpVQkp2dDRrQUM2SWprX1czOGs5VWtRVXlmVll5TQ==",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }
    );

    res.status(200).json(await response.json());
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }

  return res;
}
