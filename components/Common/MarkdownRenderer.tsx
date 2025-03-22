"use client";
import Markdown from "markdown-to-jsx";
function MarkdownRenderer({ content }: { content: string }) {
  return <Markdown>{content}</Markdown>;
}

export default MarkdownRenderer;
