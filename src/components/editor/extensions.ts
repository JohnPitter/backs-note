import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export const editorExtensions = [
  StarterKit.configure({
    // Disable features we don't need
    code: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    heading: false,
    // These are enabled by default, just documenting what we use:
    // bold, italic, bulletList, orderedList, listItem, history, paragraph, hardBreak
  }),
  Underline,
];
