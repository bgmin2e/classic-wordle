"use client";

import { useCallback, useEffect, useState } from "react";
import { useToastBarContext } from "@/app/components/toastbar/toastbar";
import { useSearchParams } from "next/navigation";
import { decryptWord } from "@/app/utils/encrytion";
import { MAX_ATTEMPTS_COUNT, MAX_WORD_LENGTH } from "@/app/constants/word";
import useLocalStorage from "@/app/utils/use-local-storage";
import { useModalContext } from "@/app/components/modal/modal";
import { useGameStats } from "@/app/utils/use-game-stats";
import GameStatsModal from "@/app/play/game-stats-modal";
import { localStorageKey } from "@/app/constants/local-storage";
import { AttemptedWord } from "@/app/models/word";
import Keyboard from "@/app/components/keyboard/keyboard";
import { AttemptedWordRow } from "./attempted-word-row";
import { searchParam } from "@/app/constants/search-params";
import { useValidateWord } from "@/app/utils/use-validate-word";

const INITIAL_ATTEMPTED_WORDS: AttemptedWord[] = [];

export default function Play() {
  const correctWord = decryptWord(
    localStorage.getItem(localStorageKey.CORRECT_WORD) ?? ""
  );
  const searchParams = useSearchParams();

  // 디자인 컴포넌트를 불러오는 hooks
  const { showToastbar } = useToastBarContext();
  const { openModal } = useModalContext();

  // local storage 에 저장된 game stats를 관리하는 hook
  const { updateStats } = useGameStats();

  // word validation hook
  const { validateWord } = useValidateWord();

  const [currentAttempt, setCurrentAttempt] = useState<AttemptedWord>("");
  const [attemptedWords, setAttemptedWords] = useLocalStorage<AttemptedWord[]>({
    key: localStorageKey.ATTEMPTED_WORDS,
    initialValue: INITIAL_ATTEMPTED_WORDS,
  });

  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const code = searchParams.get(searchParam.CODE) ?? "";

    localStorage.setItem(localStorageKey.CORRECT_WORD, code);
  }, [searchParams]);

  const isFinised =
    attemptedWords.length >= MAX_ATTEMPTS_COUNT ||
    attemptedWords.some((word) => word === correctWord);

  const onPressEnter = useCallback(async () => {
    // 이미 종료된 라운드인지 확인
    if (isFinised) {
      return;
    }
    const newAttempts = [...attemptedWords, currentAttempt];

    // 글자수가 부족하면 error toastbar 를 보여준다.
    if (currentAttempt.length < MAX_WORD_LENGTH) {
      showToastbar("Not enough letters", "error");
      return;
    }

    // inValid 한 단어면 error toastbar 를 보여준다.
    const errorMessage = await validateWord(currentAttempt);
    if (errorMessage) {
      showToastbar(errorMessage, "error");
      return;
    }

    // valid 한 단어인 경우 attemptedWords 리스트에 저장한다.
    setAttemptedWords(newAttempts);
    setCurrentAttempt("");

    const newKeyStatuses = { ...keyStatuses };
    for (let i = 0; i < currentAttempt.length; i++) {
      const letter = currentAttempt[i];
      if (correctWord[i] === letter) {
        newKeyStatuses[letter] = "correct";
      } else if (correctWord.includes(letter)) {
        newKeyStatuses[letter] = "present";
      } else {
        newKeyStatuses[letter] = "absent";
      }
    }
    setKeyStatuses(newKeyStatuses);

    // 정답인 경우 성공 모달을 보여준다.
    if (currentAttempt === correctWord) {
      showToastbar("Correct!", "success");
      const updatedStats = updateStats({
        isWin: true,
        attempts: newAttempts.length,
      });
      openModal(<GameStatsModal isWin={true} stats={updatedStats} />);
      return;
    }

    // 실패인 경우 실패 모달을 보여준다.
    if (newAttempts.length === MAX_ATTEMPTS_COUNT) {
      showToastbar(`Failed.. The answer was ${correctWord}`, "info");
      const updatedStats = updateStats({
        isWin: false,
        attempts: newAttempts.length,
      });
      openModal(<GameStatsModal isWin={false} stats={updatedStats} />);
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
    if (isFinised) {
      return;
    }
    setCurrentAttempt((prev) => (prev + value).slice(0, MAX_WORD_LENGTH));
  };

  // 빈 칸을 보여줘야 하기 때문에 시도한 단어가 없더라도 emtpy string 을 채워준다.
  const filleAttempts = attemptedWords.concat(
    Array(MAX_ATTEMPTS_COUNT - attemptedWords.length).fill("")
  );

  return (
    <main className="p-12 flex flex-col gap-10 justify-center items-center">
      <h1 className="text-6xl font-bold">WORDLE</h1>
      <div className="flex flex-col gap-4">
        {filleAttempts.map((attemptedWord, index) => {
          const isCurrentAttempt = index === getCurrentIndex(filleAttempts);
          return (
            <AttemptedWordRow
              key={index}
              isCurrentAttempt={isCurrentAttempt}
              word={isCurrentAttempt ? currentAttempt : attemptedWord}
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
