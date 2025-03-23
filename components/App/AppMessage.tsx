import { memo } from "react";
import { MessageSender } from "@prisma/client";
import { AppMessageProps } from "@/types/app";
import AppAsistantLoadingMessage from "../Common/Loading/AppAssistantLoadingMessage";
import AppAsistantMessage from "./AppAssistantMessage";
import AppUserMessage from "./AppUserMessage";
const AppMessage = memo(
  ({ message, isLastIndex, isPending }: AppMessageProps) => {
    if (message.sender === MessageSender.USER) {
      return <AppUserMessage content={message.content} />;
    }

    if (message.isLoading) {
      return <AppAsistantLoadingMessage />;
    }

    return (
      <AppAsistantMessage
        isLastIndex={isLastIndex}
        isPending={isPending}
        content={message.content}
      />
    );
  }
);

AppMessage.displayName = "AppMessage";

export default AppMessage;
