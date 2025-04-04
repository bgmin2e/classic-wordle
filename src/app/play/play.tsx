"use client";

import { useCallback, useEffect, useState } from "react";
import { useToastBarContext } from "@/components/toastbar/toastbar";
import { useSearchParams } from "next/navigation";
import { decryptWord } from "@/lib/encrytion";
import { MAX_ATTEMPTS_COUNT, MAX_WORD_LENGTH } from "@/constants/word";
import useLocalStorage from "@/hooks/use-local-storage";
import { useModalContext } from "@/components/modal/modal";
import GameStatsModal from "@/app/play/game-stats-modal";
import { localStorageKey } from "@/constants/local-storage";
import { AttemptedWord } from "@/models/word";
import Keyboard from "@/components/keyboard/keyboard";
import { AttemptedWordRow } from "./attempted-word-row";
import { searchParam } from "@/constants/search-params";
import { validateWord } from "../../lib/validate-word";
import { useGameStats } from "../../hooks/use-game-stats";
import { KeyStatus } from "../../models/key-status";

// Constants
const INITIAL_ATTEMPTED_WORDS: AttemptedWord[] = [];

const getCurrentIndex = (attemptedWords: AttemptedWord[]) =>
  attemptedWords.findIndex((word) => !word);

const generateKeyStatuses = (
  attemptedWords: AttemptedWord[],
  correctWord: string
) => {
  const newKeyStatuses: { [key: string]: KeyStatus } = {};
  attemptedWords.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      if (correctWord[i] === letter) {
        newKeyStatuses[letter] = "correct";
      } else if (correctWord.includes(letter)) {
        if (newKeyStatuses[letter] !== "correct") {
          newKeyStatuses[letter] = "present";
        }
      } else {
        if (!newKeyStatuses[letter]) {
          newKeyStatuses[letter] = "absent";
        }
      }
    }
  });
  return newKeyStatuses;
};

export default function Play({ code }: { code: string }) {
  const { showToastbar } = useToastBarContext();
  const { openModal } = useModalContext();
  const { updateStats } = useGameStats();

  // State
  const [attemptedWords, setAttemptedWords] = useLocalStorage<AttemptedWord[]>({
    key: localStorageKey.ATTEMPTED_WORDS,
    initialValue: INITIAL_ATTEMPTED_WORDS,
  });
  const [currentAttempt, setCurrentAttempt] = useState<AttemptedWord>("");
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: KeyStatus }>(
    {}
  );

  // Constants
  const correctWord = decryptWord(code);
  const isFinised =
    attemptedWords.length >= MAX_ATTEMPTS_COUNT ||
    attemptedWords.some((word) => word === correctWord);

  // Effects
  useEffect(() => {
    if (attemptedWords.length === 0) return;
    setKeyStatuses(generateKeyStatuses(attemptedWords, correctWord));
  }, [attemptedWords, correctWord]);

  const handleAttemptSubmission = async () => {
    const newAttempts = [...attemptedWords, currentAttempt];

    if (currentAttempt.length < MAX_WORD_LENGTH) {
      showToastbar("Not enough letters", "error");
      return;
    }

    const validationResult = await validateWord(currentAttempt);
    if (validationResult instanceof Error) {
      showToastbar("No Definitions Found", "error");
      return;
    }

    setAttemptedWords(newAttempts);
    setCurrentAttempt("");

    if (currentAttempt === correctWord) {
      showToastbar("Correct!", "success");
      updateStats({ isWin: true, attempts: newAttempts.length });
      openModal(<GameStatsModal isWin />);
    } else if (newAttempts.length === MAX_ATTEMPTS_COUNT) {
      showToastbar(`Failed. The answer was ${correctWord}`, "info");
      updateStats({ isWin: false, attempts: newAttempts.length });
      openModal(<GameStatsModal />);
    }
  };

  const onPressEnter = useCallback(() => {
    if (!isFinised) handleAttemptSubmission();
  }, [currentAttempt, attemptedWords, correctWord]);

  const onPressDelete = () => {
    setCurrentAttempt((prev) => prev.slice(0, -1));
  };

  const onPressKey = (value: string) => {
    if (isFinised) return;
    setCurrentAttempt((prev) => (prev + value).slice(0, MAX_WORD_LENGTH));
  };

  const filleAttempts = attemptedWords.concat(
    Array(MAX_ATTEMPTS_COUNT - attemptedWords.length).fill("")
  );

  return (
    <main className="flex flex-col gap-6 background-stars flex items-center justify-center min-h-screen bg-[#fceaff] p-4 px-4 overflow-hidden">
      <img src="/wordle_logo.png" alt="Wordle Logo" className="w-full max-w-md mx-auto" />
      <div className="flex flex-col items-center justify-center gap-6 border-[6px] border-black rounded-xl bg-[#fff1fb] text-gray-800 font-pixel p-4 max-w-md mx-auto shadow-[4px_4px_0_#000] w-full">
        <div className="flex flex-col gap-4 w-full">
          {filleAttempts.map((attemptedWord, index) => {
            const isCurrentAttempt = index === getCurrentIndex(filleAttempts);
            return (
              <AttemptedWordRow
                key={index}
                isCurrentAttempt={isCurrentAttempt}
                word={isCurrentAttempt ? currentAttempt : attemptedWord}
                correctWord={correctWord}
              />
            );
          })}
        </div>
        <Keyboard
          onPressKey={onPressKey}
          onPressEnter={onPressEnter}
          onPressDelete={onPressDelete}
          keyStatuses={keyStatuses}
        />
      </div>
    </main>
  );
}
