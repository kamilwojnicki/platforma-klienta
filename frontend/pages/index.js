// frontend/pages/index.js
import { useRouter } from "next/router";
import { useClient } from "../context/ClientContext";

export default function HomePage() {
  const { setSelectedClient } = useClient();
  const router = useRouter();

  const handleSelect = (clientName) => {
    // 1) Ustawiamy w kontekście
    setSelectedClient(clientName);
    // 2) Przekierowanie na /dashboard
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Wybierz klienta</h1>
      <p>Po wybraniu klienta zostaniesz przeniesiony do Dashboardu.</p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li>
          <button
            style={buttonStyle}
            onClick={() => handleSelect("Piko-Sport")}
          >
            Piko-Sport
          </button>
        </li>
        <li>
          <button
            style={buttonStyle}
            onClick={() => handleSelect("66 projekt")}
          >
            66 projekt
          </button>
        </li>
        <li>
          <button
            style={buttonStyle}
            onClick={() => handleSelect("SoundVoice OÜ")}
          >
            SoundVoice OÜ
          </button>
        </li>
      </ul>
    </div>
  );
}

const buttonStyle = {
  margin: "8px 0",
  padding: "8px 16px",
  fontSize: "16px",
  cursor: "pointer",
};
