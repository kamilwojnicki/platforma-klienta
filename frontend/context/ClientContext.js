// frontend/context/ClientContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedClient");
    if (stored) {
      // Odczytujemy obiekt z localStorage
      setSelectedClient(JSON.parse(stored));
    }
  }, []);

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
