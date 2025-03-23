import AppChatFormSkeleton from "@/components/Common/Skeletons/AppChatFormSkeleton";
import AppConversationSkeleton from "@/components/Common/Skeletons/AppConversationSkeleton";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
          {/* Mensajes */}
          <div className="flex-1">
            <AppConversationSkeleton />
          </div>
          <AppChatFormSkeleton isInitialChat={false} />
        </div>
      </div>
    </div>
  );
}
