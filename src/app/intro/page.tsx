"use client";

import "@/app/globals.css";
import { useModalContext } from "@/components/modal/modal";
import { searchParam } from "@/constants/search-params";
import { INITIAL_CORRECT_WORD } from "@/constants/word";
import WordCreationModal from "@/app/intro/word-creation-modal";
import { encryptWord } from "@/lib/encrytion";
import { useInternalRouter } from "@/hooks/use-internal-router";
import { localStorageKey } from "@/constants/local-storage";

export default function Intro() {
  const router = useInternalRouter();
  const { openModal } = useModalContext();

  const goToPlayPage = () => {
    clearAttemptedWords();
    router.push(
      `/play?${searchParam.CODE}=${encryptWord(INITIAL_CORRECT_WORD)}`
    );
  };

  const openWordCreationModal = () => {
    clearAttemptedWords();
    openModal(<WordCreationModal />);
  };

  const clearAttemptedWords = () => {
    localStorage.setItem(localStorageKey.ATTEMPTED_WORDS, JSON.stringify([]));
  };

  return (
    <div className="background-stars flex flex-col items-center justify-center gap-8 min-h-screen bg-[#fceaff] p-4 px-4 overflow-hidden">
      <img
        src="/wordle_logo.png"
        alt="logo"
        className="w-full max-w-md mx-auto"
      />
      <main className="w-full flex flex-col items-center justify-center gap-6 text-gray-800 font-pixel p-4 max-w-md mx-auto">
        <button
          onClick={goToPlayPage}
          className="w-full bg-yellow-200 border-[3px] border-black rounded-full w-28 h-14 text-sm text-black font-bold uppercase shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition md:w-40 md:h-20 md:text-xl"
        >
          START
        </button>
        <button
          className="w-full bg-blue-200 border-[3px] border-black rounded-full w-28 h-14 text-sm text-black font-bold uppercase shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition md:w-40 md:h-20 md:text-xl"
          onClick={openWordCreationModal}
        >
          CREATE GAME
        </button>
      </main>
    </div>
  );
}
