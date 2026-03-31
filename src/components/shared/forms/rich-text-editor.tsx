"use client";

import { useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Quote,
  ChevronDown,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import { stripHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

const DEFAULT_MIN_LENGTH = 10;
const DEFAULT_MAX_LENGTH = 10_000;

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  minHeight?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
};

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Describe the experience, highlights, what's included…",
  minLength = DEFAULT_MIN_LENGTH,
  maxLength = DEFAULT_MAX_LENGTH,
  minHeight = "280px",
  className,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      UnderlineExtension,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        ...(ariaInvalid && { "aria-invalid": "true" as const }),
        ...(ariaRequired && { "aria-required": "true" as const }),
        class: "text-sm text-foreground leading-relaxed min-w-0 outline-none",
      },
      handleDOMEvents: {
        blur: () => {
          onBlur?.();
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = value || "<p></p>";
    const current = editor.getHTML();
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  const handleUpdate = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    onChange(html);
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, handleUpdate]);

  if (!editor) return null;

  const charCount = stripHtml(editor.getHTML()).length;

  return (
    <div className={cn("border border-border rounded-lg bg-white overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-1 bg-muted/30 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          aria-label="Underline"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          aria-label="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <button
          type="button"
          className="h-9 px-3 rounded-lg flex items-center gap-2 hover:bg-secondary text-foreground text-sm"
          disabled
          aria-label="Paragraph"
        >
          <span>Paragraph</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          aria-label="Bullet list"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          aria-label="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          aria-label="Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          aria-label="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
      </div>
      {/* Content */}
      <div style={{ minHeight }} className="p-4">
        <EditorContent editor={editor} />
      </div>
      {/* Character count footer */}
      <div className="flex items-center justify-between mt-2 px-4 pb-2">
        <div className="text-xs text-muted-foreground">Min {minLength} characters</div>
        <div className="text-xs text-muted-foreground">
          {charCount}/{maxLength} characters
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  "aria-label": ariaLabel,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  "aria-label": string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-foreground",
        isActive ? "bg-secondary" : "hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}
