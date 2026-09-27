import { useState } from "react";
import type { GreenApiCredentials } from "./types";
import { LoginScreen } from "./components/LoginScreen";
import { ChatScreen } from "./components/ChatScreen";

const STORAGE_KEY = "green-api-credentials";

function loadStoredCredentials(): GreenApiCredentials | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GreenApiCredentials;
  } catch {
    return null;
  }
}

function App() {
  const [creds, setCreds] = useState<GreenApiCredentials | null>(
    loadStoredCredentials
  );

  function handleLogin(newCreds: GreenApiCredentials) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCreds));
    setCreds(newCreds);
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setCreds(null);
  }

  if (!creds) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <ChatScreen creds={creds} onLogout={handleLogout} />;
}

export default App;
