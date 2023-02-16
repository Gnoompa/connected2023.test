import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  let res;

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
  ).catch((e) => (res = NextResponse.json({ error: code })));

  return res || NextResponse.json({ code, ...response.json() });
}
