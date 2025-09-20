const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => {
        const isMyMessage = idx % 2 === 1;
        
        return (
          <div key={idx} className={`flex gap-3 ${
            isMyMessage ? "flex-row-reverse" : "flex-row"
          }`}>
            {/* Avatar Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-base-300 animate-pulse" />
            </div>
            
            {/* Message Content Skeleton */}
            <div className={`flex flex-col max-w-xs md:max-w-md ${
              isMyMessage ? "items-end" : "items-start"
            }`}>
              {/* Username and Time Skeleton */}
              <div className={`flex items-center gap-2 mb-1 ${
                isMyMessage ? "flex-row-reverse" : "flex-row"
              }`}>
                <div className="h-3 w-16 bg-base-300 rounded animate-pulse" />
                <div className="h-3 w-12 bg-base-300 rounded animate-pulse" />
              </div>
              
              {/* Message Bubble Skeleton */}
              <div className={`relative rounded-2xl p-4 ${
                isMyMessage 
                  ? "rounded-tr-md bg-base-300" 
                  : "rounded-tl-md bg-base-300"
              } animate-pulse`}>
                <div className="h-4 w-32 md:w-48 bg-base-200 rounded" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;