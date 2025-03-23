"use client";
import { formatMarkdown } from "@/utils/markdown.utils";
import Markdown from "markdown-to-jsx";
import { marked } from "marked";
import { useEffect, useState } from "react";

function MarkdownRenderer({ content }: { content: string }) {
  const [contentState, setContentState] = useState<string>("");

  useEffect(() => {
    async function loadContentState(){
      const formattedContentOne = await marked(content);
      const formattedContent = await formatMarkdown(formattedContentOne);
      setContentState(formattedContent);
    }
    loadContentState();
  }, [content]);

  return (
    <div className="prose break-words break-all max-w-full overflow-hidden">
      <Markdown>{contentState}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;
