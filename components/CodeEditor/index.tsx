"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { type EditorDidMount } from "react-monaco-editor";
import { useEvent } from "react-use";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), {
  ssr: false,
});

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const handleChange = useCallback(
    (v: string) => {
      onChange(v);
    },
    [onChange]
  );

  const handleDidMount: EditorDidMount = useCallback((editor, monaco) => {
    editor.focus();
    const model = editor.getModel();
    if (!model) return;
    const lastLineNumber = model.getLineCount();
    const lastColumn = model.getLineMaxColumn(lastLineNumber);
    editor.setPosition({ lineNumber: lastLineNumber, column: lastColumn });
  }, []);

  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={code}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: "line",
        automaticLayout: false,
      }}
      onChange={handleChange}
      editorDidMount={handleDidMount}
    />
  );
}
