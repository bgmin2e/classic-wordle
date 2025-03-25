"use client";

import cx from "classnames";
import { MAX_WORD_LENGTH } from "@/constants/word";
import { AttemptedWord } from "@/models/word";
import { KeyStatus } from "../../models/key-status";

interface AttemptedWordRowProps {
  word: AttemptedWord;
  isCurrentAttempt: boolean;
  correctWord?: string;
}

const keyStatusColorMap: Map<KeyStatus, string> = new Map([
  ["correct", "bg-green-200"],
  ["present", "bg-amber-200"],
  ["absent", "bg-gray-200"],
  ["default", "bg-white"],
]);

const getBackgroundColorClassName = ({
  letter,
  index,
  correctWord,
}: {
  letter: string;
  index: number;
  correctWord?: string;
}) => {
  if (!letter || !correctWord) return keyStatusColorMap.get("default");
  if (letter === correctWord[index]) return keyStatusColorMap.get("correct");
  if (correctWord.includes(letter)) return keyStatusColorMap.get("present");
  return keyStatusColorMap.get("absent");
};

export function AttemptedWordRow({
  word,
  isCurrentAttempt,
  correctWord,
}: AttemptedWordRowProps) {
  const filledWord = word
    .split("")
    .concat(Array(MAX_WORD_LENGTH - word.length).fill(""));

  return (
    <div className="flex justify-center">
      {filledWord.map((letter, index) => {
        const backgroundColor = getBackgroundColorClassName({ letter, index, correctWord });
        return (
          <div
            key={index}
            className={cx(
              `w-10 h-10 md:w-12 md:h-12 border-[2px] flex items-center justify-center mx-0.5 text-sm md:text-lg font-bold rounded-md border-black shadow-inner`,
              isCurrentAttempt ? "bg-white" : backgroundColor
            )}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
