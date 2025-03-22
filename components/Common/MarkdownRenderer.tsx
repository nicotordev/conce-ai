"use server";
import { marked } from "marked";
// Importa un tema de highlight.js
async function MarkdownRenderer({ content }: { content: string }) {
  const html = await marked(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default MarkdownRenderer;
