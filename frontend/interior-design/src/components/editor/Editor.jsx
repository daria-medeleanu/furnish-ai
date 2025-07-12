import {useState} from 'react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify';
import './editor.css';
import Alert from '../alert/Alert';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faStrikethrough, faParagraph, faTextSlash, faHeading, faListUl, faListOl,faRotateLeft, faRotateRight, faQuoteLeft, faRulerHorizontal, faHand, faPalette } from '@fortawesome/free-solid-svg-icons'

const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTRS: ALLOWED_ATTRIBUTES,
      ALLOWED_CSS: {
        '*': {
          'color': true  
        }
      },
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link'],
      FORBID_ATTR: [
        'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 
        'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown', 
        'onkeyup', 'onkeypress', 'href', 'src', 'action'
      ],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      SANITIZE_DOM: true
    });
};

const validateContentLength = (content) => {
  const textLength = content.replace(/<[^>]*>/g, '').length;  
  const MAX_TEXT_LENGTH = 5000;  
  const MAX_HTML_LENGTH = 15000; 
  
  if (textLength > MAX_TEXT_LENGTH) {
    throw new Error(`Content too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`);
  }
  
  if (content.length > MAX_HTML_LENGTH) {
    throw new Error(`HTML content too long. Maximum ${MAX_HTML_LENGTH} characters allowed.`);
  }
  
  return true;
};

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 's', 'strike', 'del', 'mark',
  'h2', 
  'ul', 'ol', 'li',
  'blockquote', 'hr',
  'span'  
];

const ALLOWED_ATTRIBUTES = {
  'span': ['style'],
  '*': []  
};

const ALLOWED_STYLES = ['color'];

const MenuBar = () => {
    const { editor } = useCurrentEditor()
    const [showColorMenu, setShowColorMenu] = useState(false);


  if (!editor) {
    return null
  }

  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' }
  ];
  const handleColorSelect = (color) => {
    const isValidColor = colorOptions.some(option => option.value === color);
    if (!isValidColor) {
      console.warn('Invalid color attempted:', color);
      return;
    }
    editor.chain().focus().setColor(color).run();
    setShowColorMenu(false);
  };

  const handleColorReset = () => {
    editor.chain().focus().unsetColor().run();
    setShowColorMenu(false);
  };

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={`editor-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={`editor-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic"
        >
            <FontAwesomeIcon icon={faItalic} />        
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={`editor-btn ${editor.isActive('strike') ? 'is-active' : ''} `}
          title="Strikethrough"
        >
            <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button 
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="editor-btn"
          title="Clear format"
        >
            <FontAwesomeIcon icon={faTextSlash} />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`editor-btn ${editor.isActive('paragraph') ? 'is-active' : ''}`}
          title="Paragraph"
        >
          <FontAwesomeIcon icon={faParagraph} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`editor-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          title="Heading"
        >
          <FontAwesomeIcon icon={faHeading} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bullet list"
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Numbered List"
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`editor-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Quote"
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <button 
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="editor-btn"
          title="Horizontal Line"
        >
                
          <FontAwesomeIcon icon={faRulerHorizontal} />
        </button>
        <button 
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="editor-btn"
          title="Hard Break"
        >
          <FontAwesomeIcon icon={faHand} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="editor-btn"
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          title="Undo up until 10 actions"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="editor-btn"
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          title="Redo"
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
        <div className="color-dropdown">
            <button
              onClick={() => setShowColorMenu(!showColorMenu)}
              className={`editor-btn color-trigger ${showColorMenu ? 'is-active' : ''}`}
              title="Color palette"
            >
                <FontAwesomeIcon icon={faPalette} />
            </button>
            {showColorMenu && (
                <div className="color-menu-dropdown">
                <div className="color-options">
                    {colorOptions.map((color) => (
                    <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={`color-option ${editor.isActive('textStyle', { color: color.value }) ? 'is-active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    >
                    </button>
                    ))}
                </div>
                <button
                    onClick={handleColorReset}
                    className="color-reset-btn"
                    title="Remove color"
                >
                    Reset
                </button>
                </div>
            )}
          </div>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: ['textStyle', 'paragraph', 'heading', 'listItem'] }),
  TextStyle.configure({ types: ['paragraph', 'heading', 'listItem'] }),
  StarterKit.configure({
    codeBlock: false,
    code: false,
    bulletList: {
      keepMarks: true,
      keepAttributes: false, 
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    history: {
      depth: 10,
    },
  }),
]


const DescriptionEditor = ({ value, onChange }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const content = value ? sanitizeHTML(value) : '<p>Describe your product here...</p>';

  const handleUpdate = ({ editor }) => {
    try {
      const html = editor.getHTML();
      validateContentLength(html);
      const sanitizedHtml = sanitizeHTML(html);

      if (!sanitizedHtml.trim() || sanitizedHtml === '<p></p>') {
        onChange && onChange('');
        return;
      }
      onChange && onChange(sanitizedHtml);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertOpen(true);
      console.error('Content validation failed:', error);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertMessage('');
  };

  return (
    <div className="description-editor-wrapper">
      <EditorProvider 
        slotBefore={<MenuBar />} 
        extensions={extensions} 
        content={content}
        onUpdate={handleUpdate}
      >
      </EditorProvider>
      <Alert
        open={alertOpen}
        onClose={handleAlertClose}
        title="Content Validation Error"
        message={alertMessage}
        cancelText="OK"
        confirmText={null} 
      />
    </div>
  );
};

export default DescriptionEditor;