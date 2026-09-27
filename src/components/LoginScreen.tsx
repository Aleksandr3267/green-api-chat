import { useState, type FormEvent } from "react";
import type { GreenApiCredentials } from "../types";
import { checkCredentials } from "../api/greenApi";
import "./LoginScreen.css";

interface Props {
  onLogin: (creds: GreenApiCredentials) => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError("Заполните оба поля");
      return;
    }

    const creds: GreenApiCredentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    };

    setIsChecking(true);
    const isValid = await checkCredentials(creds);
    setIsChecking(false);

    if (!isValid) {
      setError("Не удалось подключиться. Проверьте idInstance и apiTokenInstance");
      return;
    }

    onLogin(creds);
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Вход в чат</h1>
        <p className="login-subtitle">
          Введите данные вашего инстанса GREEN-API
        </p>

        <label className="login-field">
          <span>idInstance</span>
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="1101123456"
            autoComplete="off"
          />
        </label>

        <label className="login-field">
          <span>apiTokenInstance</span>
          <input
            type="text"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="d0e...9f3"
            autoComplete="off"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-submit" disabled={isChecking}>
          {isChecking ? "Проверка…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
