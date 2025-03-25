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
    <div className="background-stars flex items-center justify-center min-h-screen bg-[#fceaff] p-4 overflow-hidden">
      <main className="flex flex-col items-center justify-center gap-6 border-[6px] border-black rounded-xl bg-[#fff1fb] text-gray-800 font-pixel p-4 max-w-md mx-auto shadow-[4px_4px_0_#000]">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl mb-2 drop-shadow-[2px_2px_0_#000] text-pink-600">
            WORDLE
          </h1>
        </div>
        <button
          onClick={goToPlayPage}
          className="bg-pink-200 border-[3px] border-black rounded-full w-28 h-14 text-sm text-black font-bold uppercase shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition md:w-40 md:h-20 md:text-xl"
        >
          START
        </button>
        <button
          className="bg-blue-200 border-[3px] border-black rounded-full w-28 h-14 text-sm text-black font-bold uppercase shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition md:w-40 md:h-20 md:text-xl"
          onClick={openWordCreationModal}
        >
          CREATE WORDLE
        </button>
      </main>
    </div>
  );
}
