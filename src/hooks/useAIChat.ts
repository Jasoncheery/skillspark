import { useState, useCallback } from "react";
import { useToastStore } from "../stores/toastStore";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

// Get API URL from environment
const FASTAPI_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CHAT_URL = `${FASTAPI_URL}/api/ai/chat`;

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();

  const sendMessage = useCallback(async (input: string, language: string = "en") => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language,
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        let errorMessage = "";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.error || errorText;
        } catch {
          errorMessage = errorText;
        }

        if (resp.status === 429) {
          showToast(
            language === "zh-TW" ? "請求太頻繁，請稍後再試" : "Rate limit exceeded. Please wait a moment.",
            "error"
          );
        } else if (resp.status === 402) {
          showToast(
            language === "zh-TW" ? "AI 服務需要額度，請聯繫支援" : "AI service requires credits.",
            "error"
          );
        } else {
          showToast(
            errorMessage || (language === "zh-TW" ? "發生錯誤，請稍後再試" : "An error occurred. Please try again."),
            "error"
          );
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            
            // Handle error in stream
            if (parsed.error) {
              showToast(
                parsed.error.message || (language === "zh-TW" ? "發生錯誤" : "An error occurred"),
                "error"
              );
              streamDone = true;
              break;
            }
            
            // Extract content from OpenAI-compatible format
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              updateAssistant(content);
            }
          } catch {
            // Skip invalid JSON
            continue;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.error) {
              showToast(
                parsed.error.message || (language === "zh-TW" ? "發生錯誤" : "An error occurred"),
                "error"
              );
              continue;
            }
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              updateAssistant(content);
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      showToast(
        language === "zh-TW" ? "無法連接 AI 服務" : "Failed to connect to AI service",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, showToast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
};
