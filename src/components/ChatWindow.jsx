import { useState, useRef, useEffect, useContext } from 'react';
import Chat from './modules/chat';
import { ConversationContext } from '../context/ConversationContext';
import bot from '../assets/logo-small.svg';

const ChatWindow = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstMessage, setIsFirstMessage] = useState(true);

    const chatInstance = useRef(new Chat());
    const scrollRef = useRef(null);

    const {
        createNewConversation,
        updateConversationTitle,
        addMessageToConversation,
        loadConversation,
        getCurrentConversation,
        currentConversationId
    } = useContext(ConversationContext);

    useEffect(() => {
        const currentConv = getCurrentConversation();
        if (currentConv) {
            chatInstance.current = new Chat();
            currentConv.messages.forEach(msg => {
                if (msg.tag === 'user') {
                    chatInstance.current.addUserMessage(msg.text);
                } else {
                    chatInstance.current.addApiMessage(msg.text);
                }
            });
            setMessages([...currentConv.messages]);
            setIsFirstMessage(currentConv.messages.length === 0);
        }
    }, [currentConversationId, getCurrentConversation]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        let convId = currentConversationId;
        if (!convId) {
            convId = createNewConversation("New Chat");
        }

        chatInstance.current.addUserMessage(trimmedInput);
        const userMessage = { tag: "user", text: trimmedInput };
        setMessages([...chatInstance.current.getMessages()]);
        addMessageToConversation(convId, userMessage);

        if (isFirstMessage) {
            const title = trimmedInput.substring(0, 30) + (trimmedInput.length > 30 ? "..." : "");
            updateConversationTitle(convId, title);
            setIsFirstMessage(false);
        }

        setInputValue("");
        setIsLoading(true);

        try {
            const history = chatInstance.current.getMessages().map(msg => ({
                role: msg.tag === "user" ? "user" : "assistant",
                content: msg.text
            }));

            const apiMessages = [
                { role: "system", content: "You are a helpful assistant powered by Groq and Llama 3." },
                ...history
            ];

            const apiKey = import.meta.env.VITE_GROK_API_KEY;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: apiMessages,
                    temperature: 0.7,
                    max_tokens: 1024,
                    top_p: 1,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Groq API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            chatInstance.current.addApiMessage(aiText);
            const aiMessage = { tag: "api", text: aiText };
            addMessageToConversation(convId, aiMessage);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = `Error: ${error.message}`;
            chatInstance.current.addApiMessage(errorMsg);
            addMessageToConversation(convId, { tag: "api", text: errorMsg });
        } finally {
            setMessages([...chatInstance.current.getMessages()]);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
       
        <div
            className="flex flex-col h-[95%] sm:h-[80%] w-[95%] lg:w-[80%] min-h-0 min-w-0 max-w-full rounded-[20px] overflow-hidden border border-gray-800 shadow-2xl"
            style={{ backgroundColor: 'var(--color-chat-bg)' }}
        >
            {/* Messages Area — flex-1 + min-h-0 makes it scrollable without overflowing */}
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto flex flex-col p-3 sm:p-4 md:p-6 gap-3 sm:gap-5"
            >
                {messages.length === 0 && !isLoading && (
                    <div className="flex-1 flex items-center justify-center text-center px-4">
                        <p className="text-gray-400 text-sm sm:text-base">hi what do you want to do today</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.tag === "user" ? "justify-end" : "justify-start"} w-full animate-in fade-in slide-in-from-bottom-1 duration-200`}
                    >
                        {msg.tag !== "user" && (
                            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mr-3 mt-1 shadow-md">
                                <img src={bot} alt="Bot" className="w-[25px] h-[25px]" />
                            </div>
                        )}

                        <div
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-[18px] max-w-[90%] sm:max-w-[85%] text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${msg.tag === 'user'
                                    ? 'text-indigo-50 rounded-tr-none'
                                    : 'text-gray-200 rounded-tl-none border border-gray-700'
                                }`}
                            style={{
                                backgroundColor: msg.tag === 'user' ? 'var(--color-user-msg)' : 'var(--color-bot-msg)'
                            }}
                        >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start w-full animate-pulse">
                        <div className="w-8 h-8 rounded-lg shrink-0 bg-indigo-600/40 flex items-center justify-center mr-3 mt-1">
                            <span className="text-white font-bold text-[10px]">..</span>
                        </div>
                        <div className="px-4 py-2 rounded-[18px] bg-[#2d2d2d] text-gray-500 rounded-tl-none text-sm italic">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area — flex-shrink-0 keeps it pinned at the bottom always */}
            <div
                className="flex items-center min-w-0 gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border border-gray-700 rounded-xl sm:rounded-2xl focus-within:border-gray-500 transition-colors shadow-none flex-shrink-0"
                style={{ backgroundColor: 'var(--color-input-bg)' }}
            >
                <input
                    type="text"
                    placeholder="Ask SimpleChat anything..."
                    className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-gray-100 outline-none placeholder-gray-600 font-normal"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex justify-center items-center p-1 hover:bg-indigo-500/20 rounded-full transition-all disabled:opacity-10 cursor-pointer shrink-0"
                >
                    <img
                        src="https://api.iconify.design/lucide:send.svg?color=%236366f1"
                        alt="Send"
                        className="w-5 sm:w-7 h-5 sm:h-7"
                    />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
