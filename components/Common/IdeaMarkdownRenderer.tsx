/* eslint-disable react/no-children-prop */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import remarkGfm from "remark-gfm";

import { IdeaMarkdownRendererProps } from "@/types/auth";
import ReactMarkdown from "react-markdown";
import { BsFillCircleFill } from "react-icons/bs";
export default function IdeaMarkdownRenderer({
  content,
}: IdeaMarkdownRendererProps) {
  return (
    <div className="max-w-full break-words overflow-visible dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml={false}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="!text-4xl font-bold mb-2 !text-primary-500 !font-sans"
            >
              {props.children}
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="relative !text-3xl font-medium mb-3 !text-primary-500 !font-sans inline-flex items-baseline pr-4"
            >
              <span className="inline">
                {props.children}
                <span className="inline-flex items-center">
                  <BsFillCircleFill className="ml-1 w-5 h-5 !text-primary-500 animate-pulse" />
                </span>
              </span>
            </h2>
          ),
          p: ({ node, ...props }) => (
            <p className="text-base mb-2 !font-sans" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="list-disc ml-4 !font-sans" {...props} />
          ),
        }}
        children={content}
      />
    </div>
  );
}
