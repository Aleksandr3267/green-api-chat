import type { GreenApiCredentials, GreenApiNotification } from "../types";


const API_BASE = "https://api.green-api.com";


export function phoneToChatId(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return `${digitsOnly}@c.us`;
}
export function isValidPhone(phone: string): boolean {
  if (!/^[+\d\s()-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function sendMessage(
  creds: GreenApiCredentials,
  chatId: string,
  message: string
): Promise<void> {
  const url = `${API_BASE}/waInstance${creds.idInstance}/sendMessage/${creds.apiTokenInstance}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Не удалось отправить сообщение: ${errorText}`);
  }
}


export async function receiveNotification(
  creds: GreenApiCredentials,
  receiveTimeout = 5
): Promise<GreenApiNotification | null> {
  const url = `${API_BASE}/waInstance${creds.idInstance}/receiveNotification/${creds.apiTokenInstance}?receiveTimeout=${receiveTimeout}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка получения уведомлений: ${response.status}`);
  }

  const text = await response.text();
 
  if (!text) return null;

  return JSON.parse(text) as GreenApiNotification;
}

export async function deleteNotification(
  creds: GreenApiCredentials,
  receiptId: number
): Promise<void> {
  const url = `${API_BASE}/waInstance${creds.idInstance}/deleteNotification/${creds.apiTokenInstance}/${receiptId}`;

  await fetch(url, { method: "DELETE" });
}


export async function checkCredentials(
  creds: GreenApiCredentials
): Promise<boolean> {
  const url = `${API_BASE}/waInstance${creds.idInstance}/getStateInstance/${creds.apiTokenInstance}`;
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}
