"use client";

import Markdown from "markdown-to-jsx";

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="
        prose max-w-full break-words break-all overflow-hidden
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-h1:mb-4 prose-h2:mb-3 prose-h3:mb-2
        prose-p:leading-relaxed prose-p:text-[--color-dark-text-secondary]
        prose-a:text-primary hover:prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
        prose-blockquote:text-muted-foreground
        prose-code:before:content-none prose-code:after:content-none
        prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-muted prose-code:text-[--color-dark-text-accent]
        prose-pre:rounded-lg prose-pre:bg-shark-900 prose-pre:text-white prose-pre:px-4 prose-pre:py-3
        prose-strong:text-foreground
        dark:prose-invert
        dark:prose-p:text-gray-300
        dark:prose-a:text-primary
        dark:prose-blockquote:text-gray-400
        dark:prose-code:bg-shark-800 dark:prose-code:text-white
        dark:prose-pre:bg-shark-900 dark:prose-pre:text-white
      "
    >
      <Markdown>{content}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;
