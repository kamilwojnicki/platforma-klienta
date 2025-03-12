// frontend/context/ClientContext.js
import React, { createContext, useState, useContext } from "react";

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
