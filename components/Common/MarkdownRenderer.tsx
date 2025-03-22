"use client";
import Markdown from "markdown-to-jsx";
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose break-words break-all max-w-full overflow-hidden">
      <Markdown>{content}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;
