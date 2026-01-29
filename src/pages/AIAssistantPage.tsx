import { useState, useRef, useEffect } from "react";
import { 
  Send, Trash2, BookOpen, Calculator, Code, FlaskConical,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Layout } from "../components/layout/Layout";
import { useAIChat, Message } from "../hooks/useAIChat";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const suggestedQuestions = {
  en: [
    { icon: Calculator, text: "Explain quadratic equations step by step", category: "Math", color: "from-orange-400 to-yellow-400" },
    { icon: FlaskConical, text: "How does photosynthesis work?", category: "Science", color: "from-green-400 to-emerald-400" },
    { icon: Code, text: "Help me understand JavaScript arrays", category: "Programming", color: "from-purple-400 to-pink-400" },
    { icon: BookOpen, text: "Summarize the causes of World War I", category: "History", color: "from-blue-400 to-cyan-400" },
  ],
  "zh-TW": [
    { icon: Calculator, text: "請解釋一元二次方程式的解法", category: "數學", color: "from-orange-400 to-yellow-400" },
    { icon: FlaskConical, text: "光合作用是如何運作的？", category: "科學", color: "from-green-400 to-emerald-400" },
    { icon: Code, text: "幫我理解 JavaScript 陣列", category: "程式設計", color: "from-purple-400 to-pink-400" },
    { icon: BookOpen, text: "請總結第一次世界大戰的起因", category: "歷史", color: "from-blue-400 to-cyan-400" },
  ],
};

const MessageBubble = ({ message, isLast }: { message: Message; isLast: boolean }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-lg font-bold">🦉</span>
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? "bg-gradient-to-br from-orange-400 to-yellow-400 text-white"
            : "bg-white border-2 border-yellow-200 text-gray-800"
        }`}
      >
        {isUser ? (
          <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm">👤</span>
        </div>
      )}
    </div>
  );
};

export const AIAssistantPage = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === "zh-TW" ? "zh-TW" : "en";
  const questions = suggestedQuestions[language];
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input, language);
      setInput("");
    }
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text, language);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const translations = {
    en: {
      title: "AI Tutor",
      subtitle: "Your friendly learning buddy! 🎓",
      placeholder: "Ask me anything! I'm here to help you learn~ ✨",
      send: "Send",
      clear: "Clear Chat",
      thinking: "Thinking...",
      welcome: "Hi there! 👋 I'm Oliver the Owl, your AI Tutor buddy!",
      suggestions: "✨ Try asking about:",
      funFact: "Fun fact: Learning is more fun with a friend!",
    },
    "zh-TW": {
      title: "AI 助教🦉 貓頭鷹小奧",
      subtitle: "你的學習好夥伴！🎓",
      placeholder: "問我任何問題吧！我會幫助你學習~ ✨",
      send: "發送",
      clear: "清除對話",
      thinking: "思考中...",
      welcome: "嗨！👋 我是貓頭鷹小奧，你的 AI 助教小夥伴！",
      suggestions: "✨ 試試問我：",
      funFact: "小知識：跟朋友一起學習更有趣！",
    },
  };

  const t = translations[language];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>

          {/* Main Chat Container */}
          <Card className="border-4 border-yellow-300 overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-b from-white to-yellow-50 flex flex-col min-h-[600px]">
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 min-h-[400px] p-6 overflow-y-auto" ref={scrollRef}>
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-20 h-20 mx-auto mb-4">
                        <span className="text-6xl">🦉</span>
                      </div>
                      <p className="text-xl text-gray-700 mb-2 font-bold">
                        {t.welcome}
                      </p>
                      <p className="text-sm text-orange-500 mb-6">
                        {t.funFact}
                      </p>

                      <div className="text-left">
                        <p className="text-lg font-bold text-gray-700 mb-4">
                          {t.suggestions}
                        </p>
                        <div className="grid gap-3">
                          {questions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(q.text)}
                              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white hover:border-yellow-300 transition-all text-left group shadow-md hover:shadow-xl"
                            >
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${q.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <q.icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <Badge className="mb-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                                  {q.category}
                                </Badge>
                                <p className="text-sm text-gray-600 font-medium">
                                  {q.text}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble
                          key={i}
                          message={msg}
                          isLast={i === messages.length - 1}
                        />
                      ))}

                      {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🦉</span>
                          </div>
                          <div className="bg-white border-2 border-yellow-200 rounded-3xl rounded-tl-lg px-5 py-4 shadow-md">
                            <div className="flex gap-2">
                              <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                              <span className="text-sm text-gray-600">{t.thinking}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t-4 border-yellow-200 p-5 bg-gradient-to-r from-yellow-100 to-orange-100">
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t.placeholder}
                      className="min-h-[70px] max-h-[150px] resize-none pr-4 rounded-2xl border-2 border-yellow-300 focus:border-orange-400 bg-white text-lg font-medium shadow-inner py-3 px-4"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-[70px] w-[70px] rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 shadow-lg border-0 p-0"
                  >
                    <Send className="w-7 h-7" />
                  </Button>
                </form>
                {messages.length > 0 && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearMessages}
                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-100 font-bold rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.clear}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
