// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  return new Response(
    // `<svg><image width='136' height='136' xlink:href='https://cyberconnect.me/_next/image?url=%2Fassets%2Fapp%2Flink3.png&w=128&q=75'/><text x="10" y="20" fill="red">${id}</text></svg>`,
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500" fill="none"><path d="M59 104.826C59 92.0806 62.0452 79.5197 67.882 68.1894L84.3299 36.2613C89.4741 26.2754 99.766 20 110.999 20H177.569H421.276C432.322 20 441.276 28.9543 441.276 40V428.566C441.276 437.981 436.856 446.85 429.339 452.519L406.262 469.921C397.588 476.462 387.02 480 376.157 480H182.724H79C67.9543 480 59 471.046 59 460V104.826Z" fill="black"/><text text-anchor="end" dominant-baseline="hanging" x="412" y="50" fill="#fff" font-weight="700" font-family="&quot;Outfit&quot;, sans-serif" font-size="32">web3events358</text><text text-anchor="end" dominant-baseline="hanging" x="412" y="90" fill="#fff" font-weight="700" font-family="&quot;Outfit&quot;, sans-serif" font-size="32">013961</text></svg>',
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
