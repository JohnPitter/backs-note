import { useTranslation } from 'react-i18next';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButton {
  icon: string;
  titleKey: string;
  action: () => void;
  isActive: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) {
    return null;
  }

  const buttons: ToolbarButton[] = [
    {
      icon: 'B',
      titleKey: 'editor.bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: 'I',
      titleKey: 'editor.italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: 'U',
      titleKey: 'editor.underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
  ];

  const listButtons: ToolbarButton[] = [
    {
      icon: '•',
      titleKey: 'editor.bulletList',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: '1.',
      titleKey: 'editor.orderedList',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
  ];

  const historyButtons: ToolbarButton[] = [
    {
      icon: '↩',
      titleKey: 'editor.undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: '↪',
      titleKey: 'editor.redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        {buttons.map((button, index) => (
          <button
            key={index}
            type="button"
            className={`toolbar-btn ${button.isActive ? 'is-active' : ''}`}
            onClick={button.action}
            title={t(button.titleKey)}
            aria-label={t(button.titleKey)}
          >
            <span className={`toolbar-icon toolbar-icon-${button.icon.toLowerCase()}`}>
              {button.icon}
            </span>
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        {listButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            className={`toolbar-btn ${button.isActive ? 'is-active' : ''}`}
            onClick={button.action}
            title={t(button.titleKey)}
            aria-label={t(button.titleKey)}
          >
            <span className="toolbar-icon">{button.icon}</span>
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        {historyButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            className={`toolbar-btn ${button.isActive ? 'is-active' : ''}`}
            onClick={button.action}
            title={t(button.titleKey)}
            aria-label={t(button.titleKey)}
            disabled={
              (button.icon === '↩' && !editor.can().undo()) ||
              (button.icon === '↪' && !editor.can().redo())
            }
          >
            <span className="toolbar-icon">{button.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
