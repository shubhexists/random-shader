"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

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

  const handleEditorWillMount = (monacoInstance: typeof monaco) => {
    if (!monacoInstance.languages.getLanguages().some((l) => l.id === "glsl")) {
      monacoInstance.languages.register({ id: "glsl" });

      monacoInstance.languages.setMonarchTokensProvider("glsl", {
        keywords: [
          "attribute",
          "const",
          "uniform",
          "varying",
          "break",
          "continue",
          "do",
          "for",
          "while",
          "if",
          "else",
          "in",
          "out",
          "inout",
          "float",
          "int",
          "void",
          "bool",
          "true",
          "false",
          "lowp",
          "mediump",
          "highp",
          "precision",
          "invariant",
          "discard",
          "return",
          "mat2",
          "mat3",
          "mat4",
          "vec2",
          "vec3",
          "vec4",
          "ivec2",
          "ivec3",
          "ivec4",
          "bvec2",
          "bvec3",
          "bvec4",
          "sampler2D",
          "samplerCube",
          "struct",
        ],
        operators: [
          "=",
          "+",
          "-",
          "*",
          "/",
          "%",
          "++",
          "--",
          "==",
          "!=",
          ">",
          "<",
          ">=",
          "<=",
          "&&",
          "||",
          "!",
          "~",
          "&",
          "|",
          "^",
          "<<",
          ">>",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
            { include: "@whitespace" },
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],
            [/\d*\.\d+([eE][\-+]?\d+)?[fF]?/, "number.float"],
            [/0[xX][0-9a-fA-F]+/, "number.hex"],
            [/\d+/, "number"],
            [/[;,.]/, "delimiter"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          ],
          whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*\*(?!\/)/, "comment.doc", "@doccomment"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
          ],
          comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
          ],
          doccomment: [
            [/[^\/*]+/, "comment.doc"],
            [/\*\//, "comment.doc", "@pop"],
            [/[\/*]/, "comment.doc"],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape.invalid"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
        },
      });

      monacoInstance.languages.setLanguageConfiguration("glsl", {
        comments: {
          lineComment: "//",
          blockComment: ["/*", "*/"],
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
        ],
      });
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
      beforeMount={handleEditorWillMount}
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
    />
  );
}
