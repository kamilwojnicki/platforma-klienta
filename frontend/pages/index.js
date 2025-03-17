// frontend/pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useClient } from "../context/ClientContext";

export default function Home() {
  const router = useRouter();
  const { selectedClient } = useClient();

  useEffect(() => {
    if (selectedClient) {
      // Jeśli zalogowany (selectedClient nie jest null), idź do dashboardu
      router.push("/dashboard");
    } else {
      // W przeciwnym razie do strony logowania
      router.push("/login");
    }
  }, [selectedClient, router]);

  // Strona główna nie wyświetla treści – służy tylko do przekierowania
  return null;
}
