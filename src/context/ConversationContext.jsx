import { createContext, useState, useCallback } from 'react';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    const createNewConversation = useCallback((title = "New Chat") => {
        const newId = Date.now().toString();
        const newConversation = {
            id: newId,
            title,
            messages: [],
            createdAt: new Date()
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newId);
        return newId;
    }, []);

    const updateConversationTitle = useCallback((conversationId, title) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId ? { ...conv, title } : conv
            )
        );
    }, []);

    const addMessageToConversation = useCallback((conversationId, message) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, messages: [...conv.messages, message] }
                    : conv
            )
        );
    }, []);

    const loadConversation = useCallback((conversationId) => {
        setCurrentConversationId(conversationId);
    }, []);

    const deleteConversation = useCallback((conversationId) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentConversationId === conversationId) {
            setCurrentConversationId(
                conversations.length > 1
                    ? conversations[0].id
                    : null
            );
        }
    }, [conversations, currentConversationId]);

    const getCurrentConversation = () => {
        return conversations.find(conv => conv.id === currentConversationId);
    };

    const value = {
        conversations,
        currentConversationId,
        createNewConversation,
        updateConversationTitle,
        addMessageToConversation,
        loadConversation,
        deleteConversation,
        getCurrentConversation
    };

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
};
