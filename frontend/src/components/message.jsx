import React from 'react';

const Message = ({ message, isCurrentUser }) => {
  const messageClass = isCurrentUser
    ? "bg-blue-600 text-white rounded-lg p-3 my-2 self-end"
    : "bg-gray-200 text-gray-800 rounded-lg p-3 my-2 self-start";

  return (
    <div className={messageClass}>
      <p>{message.text}</p>
      <span className="text-xs text-right mt-1 opacity-75 block">
        {new Date(message.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default Message;