import { KeyStatus } from "@/models/key-status";
import { useEffect } from "react";
import cx from "classnames";

const ENTER = "⏎";
const DELETE = "⌫";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ENTER],
  ["Z", "X", "C", "V", "B", "N", "M", DELETE],
];

const keyStatusColorMap: Map<KeyStatus, string> = new Map([
  ["correct", "bg-green-200 hover:bg-green-600 active:bg-green-700"],
  ["present", "bg-amber-200 hover:bg-amber-600 active:bg-amber-700"],
  ["absent", "bg-gray-200 hover:bg-gray-600 active:bg-gray-700"],
  ["default", "bg-blue-200 hover:bg-blue-300 active:bg-blue-400"],
]);

interface KeyboardProps {
  onPressKey: (key: string) => void;
  onPressEnter: () => void;
  onPressDelete: () => void;
  keyStatuses?: { [key: string]: KeyStatus };
}

export default function Keyboard({
  onPressKey,
  onPressDelete,
  onPressEnter,
  keyStatuses,
}: KeyboardProps) {
  const onClick = (key: string) => {
    if (key === ENTER) {
      onPressEnter();
      return;
    }
    if (key === DELETE) {
      onPressDelete();
      return;
    }
    onPressKey(key);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "Enter") {
        onPressEnter();
        return;
      }
      if (key === "Backspace") {
        onPressDelete();
        return;
      }
      const upperKey = key.toUpperCase();
      if (KEYS.flat().includes(upperKey)) {
        onPressKey(upperKey);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPressDelete, onPressEnter, onPressKey]);

  const getButtonClassName = (key: string) => {
    if (!keyStatuses) {
      return keyStatusColorMap.get("default");
    }
    const status = keyStatuses[key];
    return keyStatusColorMap.get(status) ?? keyStatusColorMap.get("default");
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-md">
      {KEYS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-nowrap justify-center gap-1 md:gap-2"
        >
          {row.map((key) => {
            const backgroundColor = getButtonClassName(key);

            return (
              <button
                key={key}
                type="button"
                className={cx(
                  `rounded-full border-[3px] border-black w-7 h-8 md:w-10 md:h-12 text-[10px] md:text-sm text-black font-bold shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition`,
                  backgroundColor
                )}
                onClick={() => onClick(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
