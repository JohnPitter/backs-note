import StarterKit from '@tiptap/starter-kit';

export const editorExtensions = [
  StarterKit.configure({
    // Disable features we don't need
    code: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    heading: false,
    // These are enabled by default in StarterKit 3.16+:
    // bold, italic, underline, bulletList, orderedList, listItem, history, paragraph, hardBreak
  }),
];
