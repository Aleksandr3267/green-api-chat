
export interface GreenApiCredentials {
  idInstance: string;
  apiTokenInstance: string;
}


export interface ChatMessage {
  id: string; 
  text: string;
  direction: "outgoing" | "incoming";
  timestamp: number;
}


export interface GreenApiNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    senderData?: {
      chatId: string;
      sender: string;
      senderName?: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
      extendedTextMessageData?: {
        text: string;
      };
    };
  };
}
