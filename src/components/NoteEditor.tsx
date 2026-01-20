import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Note } from '../types';
import { editorExtensions } from './editor/extensions';
import { EditorToolbar } from './EditorToolbar';

interface NoteEditorProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  disabled?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onContentChange, disabled }) => {
  const isUpdatingFromProps = useRef(false);
  const lastContentRef = useRef<string>('');

  const editor = useEditor({
    extensions: editorExtensions,
    content: '',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      if (isUpdatingFromProps.current) {
        return;
      }
      const html = editor.getHTML();
      if (html !== lastContentRef.current) {
        lastContentRef.current = html;
        onContentChange(html);
      }
    },
  });

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note) {
      const currentContent = editor.getHTML();
      // Check if note content is plain text (no HTML tags) or HTML
      const isHtml = /<[^>]+>/.test(note.content);
      const newContent = isHtml ? note.content : `<p>${note.content || ''}</p>`;

      if (currentContent !== newContent && newContent !== lastContentRef.current) {
        isUpdatingFromProps.current = true;
        lastContentRef.current = newContent;
        editor.commands.setContent(newContent);
        isUpdatingFromProps.current = false;
      }
    }
  }, [editor, note]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  return (
    <div className="editor-container">
      <EditorToolbar editor={editor} />
      <div className="editor-content-wrapper">
        <EditorContent
          editor={editor}
          className="editor-content"
        />
      </div>
    </div>
  );
};
