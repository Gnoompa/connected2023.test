import type { NextPage } from "next";
import { useEffect } from "react";

const Redirect: NextPage = () => {
  useEffect(() => {
    global.close();
    // setupTwitter();
  }, []);

  const setupTwitter = async () => {
    let token = global.localStorage.getItem("twitter_access");

    if (!token) {
      const authCode = new URLSearchParams(global.location.href).get("code");

      const res = await fetch(
        "https://verceltwitter-gnoompa.vercel.app/api/oauth?code=" + authCode
      );

      const resp = await res.json();

      token = resp.access_token;
      global.localStorage.setItem("twitter_access", resp.access_token);
    }

    fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  return <div className="container">redirected</div>;
};

export default Redirect;
