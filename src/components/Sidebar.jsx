import { useState, useContext } from 'react'
import toggler from '../assets/Off.svg'
import simpleChatlogo from '../assets/logo-full.svg'
import addround from '../assets/Add_round_fill.svg'
import { ConversationContext } from '../context/ConversationContext'

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const {
        conversations,
        currentConversationId,
        createNewConversation,
        loadConversation,
        deleteConversation
    } = useContext(ConversationContext);

    const handleNewChat = () => {
        createNewConversation("New Chat");
    };

    const handleLoadConversation = (id) => {
        loadConversation(id);
    };

    const handleDeleteConversation = (e, id) => {
        e.stopPropagation();
        deleteConversation(id);
    };

    return (
        <aside className={`
        ${isSidebarOpen ? 'w-[150px] sm:w-[280px] bg-[#141718]' : 'w-[50px] sm:w-[80px] bg-[#141718]'}
         h-screen p-[12px] sm:p-[20px] gap-[12px] sm:gap-[20px] flex flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-[#242627] overflow-hidden`}>
            <div className='flex justify-between items-center h-[30px]'>
                <div className="overflow-hidden">
                    <img src={simpleChatlogo} alt="simplechatlogo" className={`w-auto h-[24px] object-contain
                    ${isSidebarOpen ? 'block' : 'hidden'}`} />
                </div>
                <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`cursor-pointer
                ${isSidebarOpen ? '' : 'bg-[#242627] rounded-[10px] p-[5px]'}`}><img src={toggler} alt="toggler" className='w-[24px] h-[24px] ' /></div>
            </div>

            <div
                onClick={handleNewChat}
                className={`flex items-center gap-[10px] cursor-pointer p-[8px] sm:p-[10px] rounded-xl border border-[#2a2a2a] hover:bg-[#242627] transition-colors text-sm sm:text-base
            ${isSidebarOpen ? 'flex' : 'hidden'}`}>
                <img src={addround} className={`w-[18px] sm:w-[20px] h-[18px] sm:h-[20px]`} alt="addround" /><span className='text-gray-300 text-xs sm:text-sm font-medium'>New Chat</span>
            </div>

            {isSidebarOpen && (
                <div className="flex flex-col mt-2 gap-1 animate-in fade-in duration-300 flex-1 overflow-y-auto">
                    <span className="text-xs font-bold text-gray-100 mb-2 px-1">Conversations</span>
                    
                    {conversations.length === 0 ? (
                        <p className="text-xs text-gray-400 px-1">No conversations yet</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleLoadConversation(conv.id)}
                                className={`group flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                                    currentConversationId === conv.id
                                        ? 'bg-[#242627]'
                                        : 'hover:bg-[#242627]'
                                }`}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                                    <span className="shrink-0 flex items-center justify-center bg-gray-500/20 text-gray-300 rounded-full w-5 h-5 sm:w-6 sm:h-6">
                                        <img src="https://api.iconify.design/lucide:message-square.svg?color=%23d1d5db" alt="chat" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </span>
                                    <span className="text-gray-200 text-[12px] sm:text-[13px] truncate font-medium">{conv.title}</span>
                                </div>
                                {currentConversationId === conv.id && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <img
                                            src="https://api.iconify.design/lucide:trash-2.svg?color=%239ca3af"
                                            alt="delete"
                                            className="w-3 h-3 sm:w-4 sm:h-4 cursor-pointer hover:opacity-80"
                                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </aside>
    )
}

export default Sidebar;