import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import { messageSync } from "../lib/messageSync";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEmojiClick = (emojiObject) => {
    setText(prevMsg => prevMsg + emojiObject.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      // Send the message
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      
      // Clear the input fields
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full backdrop-blur-sm bg-theme-surface border-t border-theme">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border-2 shadow-md border-theme"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white flex items-center justify-center hover:opacity-80 transition-colors shadow-lg bg-error"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-3">
        <div className="flex-1 flex gap-2">
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center transition-colors z-10 text-theme-primary hover:text-primary-focus"
            >
              <BsEmojiSmile className="w-5 h-5" />
            </button>
            <input
              type="text"
              className="w-full px-12 md:px-14 py-3 md:py-4 border-2 rounded-full focus:outline-none transition-all duration-200 text-sm md:text-base bg-theme-surface border-theme text-theme-primary placeholder-theme-secondary"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-20 shadow-xl rounded-lg overflow-hidden">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={"hidden sm:flex w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 " + (imagePreview ? 'bg-success text-white' : 'bg-theme-surface text-theme-secondary border border-theme')}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <button
          type="submit"
          className={"w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 " + ((!text.trim() && !imagePreview) ? 'bg-theme-surface text-theme-secondary border border-theme cursor-not-allowed' : 'bg-primary text-white border border-primary cursor-pointer')}
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;