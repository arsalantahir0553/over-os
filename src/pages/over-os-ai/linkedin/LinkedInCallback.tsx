import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LinkedInCallback = () => {
  const location = useLocation();
  const [code, setCode] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCode(params.get("code") || "");
    setState(params.get("state") || "");
  }, [location.search]);

  return (
    <div>
      <h2>LinkedIn Callback</h2>
      <p>
        <strong>Code:</strong> {code}
      </p>
      <p>
        <strong>State:</strong> {state}
      </p>
    </div>
  );
};

export default LinkedInCallback;
