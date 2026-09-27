import { useEffect, useRef } from "react";
import type { GreenApiCredentials } from "../types";
import {
  receiveNotification,
  deleteNotification,
} from "../api/greenApi";


export function useMessagePolling(
  creds: GreenApiCredentials | null,
  activeChatId: string | null,
  onIncomingMessage: (text: string) => void
) {
  
  const callbackRef = useRef(onIncomingMessage);
  callbackRef.current = onIncomingMessage;

  useEffect(() => {
    if (!creds || !activeChatId) return;

    let stopped = false;

    async function pollLoop() {
      while (!stopped) {
        try {
          const notification = await receiveNotification(creds!, 5);

          if (notification) {
            const { body, receiptId } = notification;
            const senderChatId = body.senderData?.chatId;
            const text =
              body.messageData?.textMessageData?.textMessage ??
              body.messageData?.extendedTextMessageData?.text;

            
            if (
              body.typeWebhook === "incomingMessageReceived" &&
              senderChatId === activeChatId &&
              text
            ) {
              callbackRef.current(text);
            }

            
            await deleteNotification(creds!, receiptId);
          }
        } catch (error) {
         
          console.error("Ошибка поллинга:", error);
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    }

    pollLoop();

    return () => {
      stopped = true;
    };
  }, [creds, activeChatId]);
}
