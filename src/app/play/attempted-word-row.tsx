"use client";

import cx from "classnames";
import { MAX_WORD_LENGTH } from "@/app/constants/word";
import { AttemptedWord } from "@/app/models/word";
import { KeyStatus } from "../models/key-status";

interface AttemptedWordRowProps {
  word: AttemptedWord;
  isCurrentAttempt: boolean;
  keyStatuses?: { [key: string]: KeyStatus };
}

const keyStatusColorMap: Map<KeyStatus, string> = new Map([
  ["correct", "bg-green-200"],
  ["present", "bg-amber-200"],
  ["absent", "bg-gray-200"],
  ["default", "bg-white"],
]);

export function AttemptedWordRow({
  word,
  isCurrentAttempt,
  keyStatuses,
}: AttemptedWordRowProps) {
  const filledWord = word
    .split("")
    .concat(Array(MAX_WORD_LENGTH - word.length).fill(""));

  const getBackgroundColorClassName = (key: string) => {
    if (!keyStatuses) {
      return keyStatusColorMap.get("default");
    }
    const status = keyStatuses[key];
    return keyStatusColorMap.get(status) ?? keyStatusColorMap.get("default");
  };

  return (
    <div className="flex justify-center">
      {filledWord.map((letter, index) => {
        const backgroundColor = getBackgroundColorClassName(letter);
        return (
          <div
            key={index}
            className={cx(
              `bg-white w-12 h-12 md:w-16 md:h-16 border-solid border-2 flex items-center justify-center mx-0.5 text-lg md:text-2xl font-bold rounded border-black`,
              backgroundColor
            )}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
