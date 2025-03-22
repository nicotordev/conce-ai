"use client";
import Markdown from "markdown-to-jsx";
import { useMemo } from "react";

function MarkdownRenderer({ content }: { content: string }) {
  const contentMemo = useMemo(() => content, [content]);
  return (
    <div className="prose break-words break-all max-w-full overflow-hidden">
      <Markdown key={contentMemo}>{contentMemo}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;
