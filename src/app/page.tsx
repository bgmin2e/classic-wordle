"use client";

import { useModalContext } from "@/app/components/modal/modal";
import { searchParam } from "@/app/constants/search-params";
import { INITIAL_CORRECT_WORD } from "@/app/constants/word";
import WordCreationModal from "@/app/intro/word-creation-modal";
import { encryptWord } from "@/app/utils/encrytion";
import { useInternalRouter } from "./hooks/use-internal-router";
import { localStorageKey } from "./constants/local-storage";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-r from-pink-300 to-purple-300 text-gray-800 font-pixel">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl mb-4">WORDLE</h1>
      </div>
      <button
        onClick={goToPlayPage}
        className="bg-yellow-300 border-4 border-black rounded-lg w-40 h-20 text-black text-xl font-bold uppercase shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        START
      </button>
      <button
        className="bg-blue-300 border-4 border-black rounded-lg w-40 h-20 text-black text-xl font-bold uppercase shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={openWordCreationModal}
      >
        CREATE WORDLE
      </button>
    </main>
  );
}
