import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical"
import { $setBlocksType } from "@lexical/selection"
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text"
import { $createParagraphNode } from "lexical"
import { useCallback, useEffect, useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from "lucide-react"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [blockType, setBlockType] = useState("paragraph")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
    setBlockType("paragraph")
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
    setBlockType(headingSize)
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
    setBlockType("quote")
  }

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
  }

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#e2e6f1] bg-gray-50">
      {/* Block Type */}
      <select
        className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        value={blockType}
        onChange={(e) => {
          const value = e.target.value
          if (value === "paragraph") formatParagraph()
          else if (value === "h1") formatHeading("h1")
          else if (value === "h2") formatHeading("h2")
          else if (value === "h3") formatHeading("h3")
          else if (value === "quote") formatQuote()
        }}
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote</option>
      </select>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          isBold ? "bg-gray-300" : ""
        }`}
        aria-label="Format Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          isItalic ? "bg-gray-300" : ""
        }`}
        aria-label="Format Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          isUnderline ? "bg-gray-300" : ""
        }`}
        aria-label="Format Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Left Align"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Center Align"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Right Align"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Justify Align"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={formatBulletList}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={formatNumberedList}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  )
}