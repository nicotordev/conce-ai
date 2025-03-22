import AppConversationSkeleton from "@/components/Common/Skeletons/AppConversationSkeleton";
import AppNewConversationSkeleton from "@/components/Common/Skeletons/AppNewConversationSkeleton";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
          {/* Mensajes */}
          <div className="flex-1">
            <AppConversationSkeleton />
          </div>
          <AppNewConversationSkeleton />
        </div>
      </div>
    </div>
  );
}
