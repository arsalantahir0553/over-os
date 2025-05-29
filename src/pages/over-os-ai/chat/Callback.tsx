import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Callback = () => {
  const [searchParams] = useSearchParams();

  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [realmId, setRealmId] = useState<string | null>(null);

  useEffect(() => {
    const codeParam = searchParams.get("code");
    const stateParam = searchParams.get("state");
    const realmIdParam = searchParams.get("realmId");

    setCode(codeParam);
    setState(stateParam);
    setRealmId(realmIdParam);

    console.log("Code:", codeParam);
    console.log("State:", stateParam);
    console.log("Realm ID:", realmIdParam);
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>OAuth Callback Parameters</h2>
      <ul>
        <li>
          <strong>Code:</strong> {code || "Not found"}
        </li>
        <li>
          <strong>State:</strong> {state || "Not found"}
        </li>
        <li>
          <strong>Realm ID:</strong> {realmId || "Not found"}
        </li>
      </ul>
    </div>
  );
};

export default Callback;
