import { useRef, useImperativeHandle, forwardRef } from "react";

export interface TerminalScreenHandle {
  typeToTerminal: (text: string, delay?: number) => void;
}

const TerminalScreen = forwardRef<TerminalScreenHandle>((_props, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalQueue = useRef<string[]>([]);
  const typing = useRef(false);

  const processQueue = (delay: number) => {
    if (typing.current) return;
    if (terminalQueue.current.length === 0) return;

    typing.current = true;
    const terminalScreen = terminalRef.current;
    if (!terminalScreen) {
      typing.current = false;
      return;
    }
    const text = terminalQueue.current.shift()!;
    let index = 0;
    function addCharacter() {
      if (!terminalRef.current) {
        typing.current = false;
        return;
      }
      if (index < text.length) {
        terminalRef.current.textContent += text.charAt(index);
        index++;
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        setTimeout(addCharacter, delay);
      } else {
        typing.current = false;
        processQueue(delay); // Process next item in the queue
      }
    }
    addCharacter();
  };

  const typeToTerminal = (text: string, delay: number = 50) => {
    terminalQueue.current.push(text.endsWith("\n") ? text : text + "\n");
    processQueue(delay);
  };

  useImperativeHandle(ref, () => ({
    typeToTerminal,
  }));

  return <div id="terminalScreen" ref={terminalRef}></div>;
});

export default TerminalScreen;
