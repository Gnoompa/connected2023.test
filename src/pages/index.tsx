import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <a
        href="https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlliWWQwenpoTUhVXzhzX0FnMEs6MTpjaQ&redirect_uri=https://verceltwitter-gnoompa.vercel.app/redirect&scope=users.read&state=state&code_challenge=challenge&code_challenge_method=plain"
        target="_blank"
      >
        connect twitter
      </a>
    </>
  );
}
