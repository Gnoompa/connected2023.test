import type { NextPage } from "next";
import { useEffect } from "react";

const Redirect: NextPage = () => {
  useEffect(() => {
    setupTwitter();
  }, []);

  const setupTwitter = async () => {
    const authCode = new URLSearchParams(global.location.href).get("code");

    const res = await fetch(
      "verceltwitter-gnoompa.vercel.app/api/oauth?code=" +
        authCode
    )

    console.log(await res.json());

    // global.localStorage.setItem("test_twitter", "Um1nczJqanc3VkNnQmJwWUVZM0FNMzBxbXliTE1admduUDducXk0NDNpU2hVOjE2NzY0NDM5NTEzMjY6MTowOmF0OjE");
  };

  return <div className="container">redirected</div>;
};

export default Redirect;
