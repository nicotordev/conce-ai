import AppChatFormSkeleton from "@/components/Common/Skeletons/AppChatFormSkeleton";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AppChatFormSkeleton isInitialChat={true} />
    </div>
  );
}
