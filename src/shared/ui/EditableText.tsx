import { cn } from "@/shared/lib/cn";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

type EditableTextContextValue = {
  value?: string;
  fallback: string;
  commitValue: (nextValue: string) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const EditableTextContext = createContext<EditableTextContextValue | null>(
  null
);

function useEditableTextContext() {
  const context = useContext(EditableTextContext);

  if (!context) {
    throw new Error(
      "EditableText components must be used within <EditableText />"
    );
  }

  return context;
}

type EditableTextProps = {
  value?: string;
  fallback?: string;
  onCommit: (value: string) => void;
  children: React.ReactNode;
};

const EditableTextRoot = memo(function EditableText({
  value,
  fallback = "Label",
  onCommit,
  children,
}: EditableTextProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const commitValue = useCallback(
    (nextValue: string) => {
      const normalizedValue = nextValue.trim() || fallback;
      onCommit(normalizedValue);
    },
    [fallback, onCommit]
  );

  const contextValue = useMemo(
    () => ({
      value,
      fallback,
      commitValue,
      contentRef,
    }),
    [value, fallback, commitValue]
  );

  return (
    <EditableTextContext.Provider value={contextValue}>
      {children}
    </EditableTextContext.Provider>
  );
});

type EditableTextContentProps = {
  className?: string;
};

const EditableTextContent = memo(function EditableTextContent({
  className,
}: EditableTextContentProps) {
  const { value, fallback, commitValue, contentRef } = useEditableTextContext();

  useEffect(() => {
    if (!contentRef.current) return;

    const nextValue = value?.trim() ? value : fallback;

    if (contentRef.current.textContent !== nextValue) {
      contentRef.current.textContent = nextValue;
    }
  }, [value, fallback, contentRef]);

  const handleBlur = useCallback(() => {
    if (!contentRef.current) return;
    commitValue(contentRef.current.textContent || "");
  }, [commitValue, contentRef]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (!contentRef.current) return;

        commitValue(contentRef.current.textContent || "");
        contentRef.current.blur();
      }
    },
    [commitValue, contentRef]
  );

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "nodrag cursor-text text-center wrap-break-word whitespace-pre-wrap outline-none",
        className
      )}
    />
  );
});

export const EditableText = Object.assign(EditableTextRoot, {
  Content: EditableTextContent,
});
