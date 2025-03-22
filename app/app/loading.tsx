import AppNewConversationSkeleton from "@/components/Common/Skeletons/AppNewConversationSkeleton";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AppNewConversationSkeleton />
    </div>
  );
}
