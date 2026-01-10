const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-gray-500 px-3 py-2">
      <span className="sr-only">TaskBot está escribiendo…</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
