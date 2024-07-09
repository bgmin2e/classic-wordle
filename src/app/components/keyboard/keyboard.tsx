import { useEffect } from "react";

const ENTER = "ENTER";
const DELETE = "DEL";

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  [ENTER, "Z", "X", "C", "V", "B", "N", "M", DELETE],
];

interface KeyboardProps {
  onPressKey: (key: string) => void;
  onPressEnter: () => void;
  onPressDelete: () => void;
  keyStatuses: { [key: string]: string };
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
    const status = keyStatuses[key];
    if (status === "correct") {
      return "bg-green-200 hover:bg-green-600 active:bg-green-700";
    }
    if (status === "present") {
      return "bg-amber-200 hover:bg-yellow-600 active:bg-yellow-700";
    }
    if (status === "absent") {
      return "bg-slate-200 hover:bg-gray-600 active:bg-gray-700";
    }
    return "bg-slate-200 hover:bg-slate-300 active:bg-slate-400";
  };

  return (
    <div>
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-5">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              className={`min-w-10 w-fit px-2 h-10 flex items-center justify-center rounded mx-0.5 text-base font-bold cursor-pointer select-none ${getButtonClassName(
                key
              )}`}
              onClick={() => onClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
