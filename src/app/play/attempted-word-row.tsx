"use client";
import cx from "classnames";
import { decryptWord } from "@/app/utils/encrytion";
import { MAX_WORD_LENGTH } from "@/app/constants/word";
import { localStorageKey } from "@/app/constants/local-storage";
import { AttemptedWord } from "@/app/models/word";

interface AttemptedWordRowProps {
  word: AttemptedWord;
  isCurrentAttempt: boolean;
}

export function AttemptedWordRow({
  word,
  isCurrentAttempt,
}: AttemptedWordRowProps) {
  const correctWord = decryptWord(
    localStorage.getItem(localStorageKey.CORRECT_WORD) ?? ""
  );
  const filledWord = word
    .split("")
    .concat(Array(MAX_WORD_LENGTH - word.length).fill(""));

  const getBackgroundColorClassName = ({
    letter,
    index,
  }: {
    letter: string;
    index: number;
  }) => {
    if (!letter) {
      return "bg-white";
    }
    if (letter === correctWord.at(index)) {
      return "bg-green-200";
    }
    if (correctWord.includes(letter)) {
      return "bg-amber-200";
    }
    return "bg-slate-200";
  };

  return (
    <div className="flex justify-center">
      {filledWord.map((letter, index) => {
        const backgroundColor = getBackgroundColorClassName({ letter, index });
        return (
          <div
            key={index}
            className={cx(
              "w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-2xl font-bold rounded border-slate-200",
              {
                [backgroundColor]: !isCurrentAttempt && !!backgroundColor,
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
