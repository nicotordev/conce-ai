/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const SyntaxHighlighterAs = SyntaxHighlighter as unknown as (
  props: SyntaxHighlighterProps
) => React.ReactNode;

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-full break-words overflow-hidden dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code(props) {
            const { node, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighterAs
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighterAs>
            ) : (
              <code
                className="rounded px-1.5 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                {...props}
              >
                {children}
              </code>
            );
          },
          a(props) {
            const { node, ...rest } = props;
            return (
              <a
                className="text-blue-600 hover:underline dark:text-blue-400"
                {...rest}
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.children}
              </a>
            );
          },
          blockquote(props) {
            const { node, ...rest } = props;
            return (
              <blockquote
                className="border-l-4 pl-4 italic text-gray-600 dark:text-gray-300"
                {...rest}
              >
                {props.children}
              </blockquote>
            );
          },
          strong(props) {
            const { node, ...rest } = props;
            return (
              <strong className="text-gray-900 dark:text-gray-100" {...rest} />
            );
          },
          p(props) {
            const { node, ...rest } = props;
            return (
              <p
                className="leading-relaxed text-gray-800 dark:text-gray-200"
                {...rest}
              >
                {props.children}
              </p>
            );
          },
          h1(props) {
            const { node, ...rest } = props;
            return (
              <h1
                className="text-3xl font-semibold tracking-tight mb-4"
                {...rest}
              >
                {props.children}
              </h1>
            );
          },
          h2(props) {
            const { node, ...rest } = props;
            return (
              <h2
                className="text-2xl font-semibold tracking-tight mb-3"
                {...rest}
              >
                {props.children}
              </h2>
            );
          },
          h3(props) {
            const { node, ...rest } = props;
            return (
              <h3
                className="text-xl font-semibold tracking-tight mb-2"
                {...rest}
              >
                {props.children}
              </h3>
            );
          },
          ul(props) {
            const { node, ...rest } = props;
            return <ul className="list-disc list-inside" {...rest} />;
          },
          ol(props) {
            const { node, ...rest } = props;
            return <ol className="list-decimal list-inside" {...rest} />;
          },
          li(props) {
            const { node, ...rest } = props;
            return <li className="ml-4" {...rest} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
