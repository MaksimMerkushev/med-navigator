/*
 * © 2026 MedКарта Казань. Все права защищены.
 * Этот код является интеллектуальной собственностью автора.
 */
import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Loader2 } from 'lucide-react';
import { analyzeSymptoms } from './services/ai';

// Дружелюбные ошибки вместо технических
const friendlyError = (error) => {
  const msg = error?.message || '';
  if (msg.includes('Blocked')) return 'К сожалению, мне не удалось обработать этот запрос. Попробуйте переформулировать его иначе 🙏';
  if (msg.includes('API ключ')) return 'Сервис временно недоступен. Мы работаем над этим!';
  if (msg.includes('Некорректный формат')) return 'Извините, я запутался в данных. Попробуйте отправить запрос еще раз 🔄';
  if (msg.includes('время ожидания') || msg.includes('timeout') || msg.includes('AbortError')) return 'Ответ занял слишком много времени. Попробуйте ещё раз через пару секунд 🔄';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return 'Нет связи с сервером. Проверьте интернет-соединение и попробуйте снова.';
  return 'Что-то пошло не так. Попробуйте ещё раз через пару секунд 🔄';
};

export default function AIAssistant({ isOpen, onClose, onApplyTriage, isMobile }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет! 👋 Я ваш навигатор по МедКарте. Расскажите, какой специалист вам нужен или на что вы жалуетесь, и я помогу найти врача и построить маршрут.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when opening on desktop
  useEffect(() => {
    if (isOpen && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobile]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await analyzeSymptoms(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: result.replyText || 'Готово!' }]);

      // Pass the result back to App.jsx to apply filters and actions
      onApplyTriage(result);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: friendlyError(error) }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Мобильный: полноэкранный режим
  if (isMobile) {
    return (
      <div className="ai-assistant-mobile fixed inset-0 z-[1100] flex flex-col bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-4 py-3 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">
              <Bot size={22} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-800 dark:text-white">AI-Помощник</div>
              <div className="text-[11px] uppercase tracking-wider text-violet-600 dark:text-violet-400">Powered by OpenAI</div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors active:bg-slate-100 dark:active:bg-slate-700">
            <X size={22} />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-messages-area flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700">
                  <Loader2 size={18} className="animate-spin text-violet-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Думаю...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-700" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Опишите симптомы..."
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-14 py-3.5 text-[15px] outline-none transition-all focus:border-violet-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Десктоп/планшет: popup
  return (
    <div className="absolute bottom-20 right-6 z-[1050] w-[350px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-4 py-3 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">
            <Bot size={18} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-slate-800 dark:text-white">AI-Помощник</div>
            <div className="text-[10px] uppercase tracking-wider text-violet-600 dark:text-violet-400">Powered by OpenAI</div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="h-[280px] overflow-y-auto p-4 scrollbar-thin">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700">
                <Loader2 size={16} className="animate-spin text-violet-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Думаю...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-slate-100 p-3 dark:border-slate-700">
        <div className="relative flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Опишите симптомы..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-[13px] outline-none transition-all focus:border-violet-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1.5 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-violet-600 text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
