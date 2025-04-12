
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, X, Minimize2, Maximize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={cn(
      "chatbot-message",
      message.sender === 'user' ? "chatbot-user" : "chatbot-bot"
    )}>
      <p>{message.content}</p>
      <p className="text-xs opacity-70 mt-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi there! I'm your social media assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you schedule posts across multiple platforms.",
        "Would you like me to show you how to analyze your social media performance?",
        "I can assist you with content creation and optimization.",
        "Let me help you set up automated responses for comments.",
        "I can guide you through setting up your social media accounts."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Bot size={24} />
        </Button>
      )}
      
      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed right-6 bottom-6 bg-background border border-border rounded-lg shadow-xl transition-all duration-300 overflow-hidden",
            isMinimized ? "w-72 h-14" : "w-80 h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center">
              <Bot size={18} className="mr-2" />
              <h3 className="font-medium">Social Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-110px)] overflow-y-auto p-3">
              {messages.map(message => (
                <ChatbotMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Input */}
          {!isMinimized && (
            <div className="p-3 border-t border-border mt-auto">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                >
                  <SendHorizontal size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
