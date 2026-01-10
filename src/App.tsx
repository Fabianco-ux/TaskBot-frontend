import { useEffect, useRef, useState } from 'react';
// import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator.tsx';
import type { Message } from './types/chat';
import { Bot, ChevronDown, Users, Zap } from 'lucide-react';

// ✅ URL CORRECTA para desarrollo local
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/taskbot';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy TaskBot, tu asistente para elaboración de tareas, ideas y estrategias. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'general'
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [online, setOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Detectar tipo de mensaje (igual que en n8n)
  const detectMessageType = (message: string): Message['type'] => {
    const lowerMessage = message.toLowerCase();
    
    if (/\b(tarea|hacer|completar|terminar|pendiente|lista|checklist|organizar)\b/.test(lowerMessage)) {
      return 'task';
    }
    
    if (/\b(idea|crear|innovar|nuevo|proponer|sugerir|brainstorming)\b/.test(lowerMessage)) {
      return 'idea';
    }
    
    if (/\b(estrategia|plan|mejorar|optimizar|rendimiento|eficiencia|productividad)\b/.test(lowerMessage)) {
      return 'strategy';
    }
    
    return 'general';
  };

  // ✅ Función CORREGIDA para enviar mensajes
  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Enviando a:', N8N_WEBHOOK_URL);
      console.log('Mensaje:', text);
      
      const messageType = detectMessageType(text);
      const sessionId = `session_${Date.now()}`;
      const userId = `user_${sessionId}`;

      // ✅ Payload CORRECTO que espera n8n
      const payload = {
        message: text,
        messageType: messageType,
        userId: userId,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      };

      console.log('Payload:', payload);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || data.message || 'Recibí tu mensaje.',
        sender: 'bot',
        timestamp: new Date(),
        type: messageType,
      };
      
      setMessages(prev => [...prev, botMessage]);
      setOnline(true);
      
    } catch (error) {
      console.error('Error completo:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Verifica: 1) n8n está corriendo, 2) La URL es correcta, 3) No hay errores de CORS.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'general'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      'task': 'Necesito ayuda para crear una tarea efectiva con plazos y responsabilidades claras.',
      'idea': 'Tengo un problema y necesito ideas creativas para resolverlo.',
      'strategy': 'Quiero mejorar el rendimiento de mi equipo, ¿qué estrategias recomiendas?',
      'example': 'Muéstrame un ejemplo de una buena estructura de proyecto.'
    };
    
    handleSendMessage(actions[action as keyof typeof actions] || action);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header personalizado */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">TaskBot</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Asistente para equipos de trabajo
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Consultor 24/7</span>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium
              ${online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {online ? 'Conectado' : 'Desconectado'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('task')}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
          >
            🎯 Crear Tarea
          </button>
          <button
            onClick={() => handleQuickAction('idea')}
            className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
          >
            💡 Generar Idea
          </button>
          <button
            onClick={() => handleQuickAction('strategy')}
            className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm hover:bg-purple-200 transition-colors"
          >
            📈 Estrategia
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <button
        onClick={scrollToBottom}
        className="fixed bottom-24 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading} 
      />
    </div>
  );
}

export default App;