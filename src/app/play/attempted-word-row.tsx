"use client";

import cx from "classnames";
import { MAX_WORD_LENGTH } from "@/app/constants/word";
import { AttemptedWord } from "@/app/models/word";
import { KeyStatus } from "../models/key-status";
import { keyStatusColors } from "../constants/letter-color-map";

interface AttemptedWordRowProps {
  word: AttemptedWord;
  isCurrentAttempt: boolean;
  keyStatuses?: { [key: string]: KeyStatus };
}

export function AttemptedWordRow({
  word,
  isCurrentAttempt,
  keyStatuses,
}: AttemptedWordRowProps) {
  const DEFAULT_BG_COLOR = "white";

  const filledWord = word
    .split("")
    .concat(Array(MAX_WORD_LENGTH - word.length).fill(""));

  const getBackgroundColorClassName = (key: string) => {
    if (!keyStatuses) {
      return `bg-${DEFAULT_BG_COLOR}`;
    }
    const status = keyStatuses[key];
    return `bg-${keyStatusColors.get(status)}-200`;
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
              {
                [backgroundColor]: !isCurrentAttempt && backgroundColor,
              }
            )}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
