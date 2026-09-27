import { useState, useRef, useEffect, type FormEvent } from "react";
import type { ChatMessage, GreenApiCredentials } from "../types";
import { phoneToChatId, sendMessage } from "../api/greenApi";
import { useMessagePolling } from "../hooks/useMessagePolling";
import "./ChatScreen.css";

interface Props {
  creds: GreenApiCredentials;
  onLogout: () => void;
}

export function ChatScreen({ creds, onLogout }: Props) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  
  useMessagePolling(creds, chatId, (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        direction: "incoming",
        timestamp: Date.now(),
      },
    ]);
  });

  
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleStartChat(event: FormEvent) {
    event.preventDefault();
    if (!phoneInput.trim()) return;
    setChatId(phoneToChatId(phoneInput));
    setMessages([]);
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !chatId) return;

    const text = draft.trim();
    setDraft("");
    setIsSending(true);

    
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        direction: "outgoing",
        timestamp: Date.now(),
      },
    ]);

    try {
      await sendMessage(creds, chatId, text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  if (!chatId) {
    return (
      <div className="chat-screen chat-screen--empty">
        <form className="recipient-card" onSubmit={handleStartChat}>
          <h2>Новый чат</h2>
          <p>Введите номер телефона получателя в WhatsApp</p>
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="+996 700 123456"
            autoFocus
          />
          <button type="submit">Начать чат</button>
          <button type="button" className="link-button" onClick={onLogout}>
            Выйти из аккаунта
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      <header className="chat-header">
        <div>
          <div className="chat-header-title">{chatId.replace("@c.us", "")}</div>
          <div className="chat-header-subtitle">WhatsApp · GREEN-API</div>
        </div>
        <button className="link-button" onClick={() => setChatId(null)}>
          Сменить чат
        </button>
      </header>

      <div className="message-list">
        {messages.length === 0 && (
          <p className="message-list-empty">
            Сообщений пока нет — напишите первым
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble--${m.direction}`}>
            {m.text}
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <form className="composer" onSubmit={handleSend}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Написать сообщение…"
        />
        <button type="submit" disabled={isSending || !draft.trim()}>
          Отправить
        </button>
      </form>
    </div>
  );
}
