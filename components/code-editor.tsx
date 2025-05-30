"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "glsl",
  height = "400px",
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  if (!mounted) {
    return (
      <div
        className="border rounded-md bg-muted p-4 text-muted-foreground font-mono text-sm overflow-auto"
        style={{ height }}
      >
        {value}
      </div>
    );
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
      }}
      className="border-0"
    />
  );
}
