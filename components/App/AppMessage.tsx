import { memo } from "react";
import MarkdownRenderer from "../Common/MarkdownRenderer";
import { MessageSender } from "@prisma/client";
import { AppConversationMessageType } from "@/types/app";
import { Transition } from "@headlessui/react";

const AppMessage = memo(
  ({ message }: { message: AppConversationMessageType }) => {
    if (message.sender === MessageSender.USER) {
      return (
        <Transition
          as="div"
          show={true} // Siempre visible, pero animamos la entrada
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="flex justify-end px-2">
            <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm max-w-[75%] break-words whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </Transition>
      );
    }

    return (
      <div className="flex justify-start px-2">
        <div className="px-5 py-2.5 max-w-full prose">
          <MarkdownRenderer key={message.content} content={message.content} />
        </div>
      </div>
    );
  }
);

AppMessage.displayName = "AppMessage";

export default AppMessage;
