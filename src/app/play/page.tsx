"use client";

import { useCallback, useEffect, useState } from "react";
import { useToastBarContext } from "@/app/components/toastbar/toastbar";
import { useSearchParams } from "next/navigation";
import { decryptWord } from "@/app/utils/encrytion";
import { MAX_ATTEMPTS_COUNT, MAX_WORD_LENGTH } from "@/app/constants/word";
import useLocalStorage from "@/app/hooks/use-local-storage";
import { useModalContext } from "@/app/components/modal/modal";
import GameStatsModal from "@/app/play/game-stats-modal";
import { localStorageKey } from "@/app/constants/local-storage";
import { AttemptedWord } from "@/app/models/word";
import Keyboard from "@/app/components/keyboard/keyboard";
import { AttemptedWordRow } from "./attempted-word-row";
import { searchParam } from "@/app/constants/search-params";
import { validateWord } from "../utils/validate-word";
import { useGameStats } from "../hooks/use-game-stats";
import { KeyStatus } from "../models/key-status";

const INITIAL_ATTEMPTED_WORDS: AttemptedWord[] = [];

export default function Play() {
  const searchParams = useSearchParams();
  const { showToastbar } = useToastBarContext();
  const { openModal } = useModalContext();
  const { updateStats } = useGameStats();

  const [attemptedWords, setAttemptedWords] = useLocalStorage<AttemptedWord[]>({
    key: localStorageKey.ATTEMPTED_WORDS,
    initialValue: INITIAL_ATTEMPTED_WORDS,
  });
  const [currentAttempt, setCurrentAttempt] = useState<AttemptedWord>("");
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: KeyStatus }>(
    {}
  );

  const code = searchParams.get(searchParam.CODE) ?? "";
  const correctWord = decryptWord(code);
  const isFinised =
    attemptedWords.length >= MAX_ATTEMPTS_COUNT ||
    attemptedWords.some((word) => word === correctWord);

  useEffect(() => {
    if (!attemptedWords.length) {
      return;
    }
    const newKeyStatuses = { ...keyStatuses };
    attemptedWords.forEach((word) => {
      for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (correctWord[i] === letter) {
          newKeyStatuses[letter] = "correct";
        } else if (correctWord.includes(letter)) {
          newKeyStatuses[letter] = "present";
        } else {
          newKeyStatuses[letter] = "absent";
        }
      }
    });
    setKeyStatuses(newKeyStatuses);
  }, [attemptedWords]);

  const onPressEnter = useCallback(async () => {
    if (isFinised) return;
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
      updateStats({
        isWin: true,
        attempts: newAttempts.length,
      });
      openModal(<GameStatsModal isWin />);
      return;
    }

    if (newAttempts.length === MAX_ATTEMPTS_COUNT) {
      showToastbar(`Failed.. The answer was ${correctWord}`, "info");
      updateStats({
        isWin: false,
        attempts: newAttempts.length,
      });
      openModal(<GameStatsModal />);
      return;
    }
  }, [
    attemptedWords,
    currentAttempt,
    isFinised,
    openModal,
    setAttemptedWords,
    showToastbar,
    updateStats,
    validateWord,
    keyStatuses,
  ]);

  const onPressDelete = () =>
    setCurrentAttempt((prevWord) => prevWord.slice(0, -1));

  const onPressKey = (value: string) => {
    if (isFinised) return;
    setCurrentAttempt((prev) => (prev + value).slice(0, MAX_WORD_LENGTH));
  };

  const filleAttempts = attemptedWords.concat(
    Array(MAX_ATTEMPTS_COUNT - attemptedWords.length).fill("")
  );

  return (
    <main className="w-screen h-screen p-4 flex flex-col gap-14 justify-center items-center bg-gradient-to-r from-pink-300 to-purple-300 text-gray-800 font-pixel">
      <h1 className="text-4xl">WORDLE</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {filleAttempts.map((attemptedWord, index) => {
          const isCurrentAttempt = index === getCurrentIndex(filleAttempts);
          return (
            <AttemptedWordRow
              key={index}
              isCurrentAttempt={isCurrentAttempt}
              word={isCurrentAttempt ? currentAttempt : attemptedWord}
              keyStatuses={keyStatuses}
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
    </main>
  );
}

const getCurrentIndex = (attemptedWords: AttemptedWord[]) =>
  attemptedWords.findIndex((word) => !word);
