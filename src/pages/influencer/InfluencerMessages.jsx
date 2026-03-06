import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import { MOCK_INFLUENCER_DATA } from '../../data/mockData';

const InfluencerMessages = () => {
    const { messages } = MOCK_INFLUENCER_DATA;
    const [selectedConversation, setSelectedConversation] = useState(messages[0]?.id || null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMessages = messages.filter(m =>
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedMessage = messages.find(m => m.id === selectedConversation);

    // Mock conversation messages
    const conversationMessages = selectedMessage ? [
        { id: 1, sender: 'brand', text: 'Hi! We love your content and would like to collaborate.', timestamp: '2025-11-28T10:00:00' },
        { id: 2, sender: 'influencer', text: 'Thank you! I\'d be interested to hear more about the collaboration.', timestamp: '2025-11-28T10:15:00' },
        { id: 3, sender: 'brand', text: 'We\'re launching a new sustainable fashion line and think you\'d be perfect for it.', timestamp: '2025-11-28T14:30:00' },
        { id: 4, sender: 'influencer', text: 'That sounds amazing! What are the details?', timestamp: '2025-11-28T15:00:00' },
        { id: 5, sender: 'brand', text: selectedMessage.lastMessage, timestamp: selectedMessage.timestamp },
    ] : [];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim()) {
            console.log('Sending message:', messageText);
            setMessageText('');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Messages</h1>
                <p className="text-gray-600 text-sm mt-1">Chat with brands</p>
            </div>

            <Card className="h-[calc(100vh-200px)] md:h-[600px] flex overflow-hidden">
                {/* Conversations List */}
                <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConversation && 'hidden md:flex'}`}>
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((message) => (
                                <button
                                    key={message.id}
                                    onClick={() => setSelectedConversation(message.id)}
                                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${selectedConversation === message.id ? 'bg-purple-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-deep-black text-sm truncate">
                                                    {message.brandName}
                                                </h4>
                                                {message.unread && (
                                                    <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>No conversations found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedMessage ? (
                    <div className={`flex-1 flex flex-col ${!selectedConversation && 'hidden md:flex'}`}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="md:hidden text-gray-600 hover:text-gray-900"
                                >
                                    ←
                                </button>
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div>
                                    <h3 className="font-semibold text-deep-black">{selectedMessage.brandName}</h3>
                                    <p className="text-xs text-gray-500">Active now</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {conversationMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'influencer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'influencer'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === 'influencer' ? 'text-purple-200' : 'text-gray-500'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Paperclip size={20} className="text-gray-600" />
                                </button>
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <Button type="submit" disabled={!messageText.trim()}>
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                            <p className="text-lg font-semibold mb-2">No conversation selected</p>
                            <p className="text-sm">Choose a conversation from the list to start chatting</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <p className="font-semibold mb-1">💡 Note:</p>
                <p>You can only view and reply to messages from brands who have contacted you. You cannot initiate new conversations.</p>
            </div>
        </div>
    );
};

export default InfluencerMessages;
