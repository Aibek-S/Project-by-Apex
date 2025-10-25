import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Компонент для красивого отображения markdown сообщений от AI
 */
const MarkdownMessage = ({ content, className = "" }) => {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Кастомные компоненты для элементов markdown
                    p: ({ children }) => (
                        <p className="markdown-p">{children}</p>
                    ),
                    strong: ({ children }) => (
                        <strong className="markdown-strong">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="markdown-em">{children}</em>
                    ),
                    code: ({ inline, children }) =>
                        inline ? (
                            <code className="markdown-code-inline">
                                {children}
                            </code>
                        ) : (
                            <code className="markdown-code-block">
                                {children}
                            </code>
                        ),
                    ul: ({ children }) => (
                        <ul className="markdown-ul">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="markdown-ol">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="markdown-li">{children}</li>
                    ),
                    h1: ({ children }) => (
                        <h1 className="markdown-h1">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="markdown-h2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="markdown-h3">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="markdown-blockquote">
                            {children}
                        </blockquote>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className="markdown-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    pre: ({ children }) => (
                        <pre className="markdown-pre">{children}</pre>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownMessage;

