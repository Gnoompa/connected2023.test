// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  return new Response(
    `<svg><image width='136' height='136' xlink:href='https://cyberconnect.me/_next/image?url=%2Fassets%2Fapp%2Flink3.png&w=128&q=75'/><text x="10" y="20" fill="red">${id}</text></svg>`,
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
