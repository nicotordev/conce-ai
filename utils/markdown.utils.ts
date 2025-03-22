import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';

const formatMarkdown = async (markdownText: string) => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm) // soporta tablas, listas de tareas, etc.
    .use(remarkStringify, {
      bullet: '*', // puedes usar '-', '+', etc.
      fences: true,
      incrementListMarker: true,
      listItemIndent: 'one', // 'one' | 'tab' | 'mixed'
    })
    .process(markdownText);

  return String(file);
};



export { formatMarkdown };