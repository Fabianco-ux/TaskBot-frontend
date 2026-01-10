import type { Message } from '../types/chat';
import { FaUser } from 'react-icons/fa';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
      {message.sender === 'bot' && (
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TaskBot" className="w-full h-full object-cover" />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content ?? message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {message.sender === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <FaUser className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
