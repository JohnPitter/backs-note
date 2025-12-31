import { useEffect, useRef } from 'react';
import type { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  disabled?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onContentChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && note) {
      textareaRef.current.value = note.content;
    }
  }, [note]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div className="editor-container">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        placeholder="Comece a escrever suas notas aqui..."
        onChange={handleChange}
        disabled={disabled}
        spellCheck="false"
        aria-label="Editor de notas"
      />
    </div>
  );
};
