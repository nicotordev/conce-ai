const AppConversationSkeleton = () => {
  const bubbles = [
    { sender: "ia", lines: 3 },
    { sender: "user", lines: 1 },
    { sender: "ia", lines: 2 },
    { sender: "user", lines: 2 },
  ];

  return (
    <div className="flex flex-col gap-4 px-2 py-4">
      {bubbles.map((bubble, index) => {
        const isUser = bubble.sender === "user";

        return (
          <div
            key={index}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`${
                isUser
                  ? "bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-2.5"
                  : "prose px-2 py-1"
              } w-fit max-w-[75%] animate-pulse`}
            >
              <div className="flex flex-col gap-2 text-gray-500 blur-xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                omnis neque consequatur ipsum quibusdam corporis architecto
                sapiente dolores vel optio distinctio, reiciendis et
                exercitationem in porro dolorum veniam tenetur maxime?
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppConversationSkeleton;
