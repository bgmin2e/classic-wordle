"use client";

import { useModalContext } from "@/app/components/modal/modal";
import { localStorageKey } from "@/app/constants/local-storage";
import { searchParam } from "@/app/constants/search-params";
import { INITIAL_CORRECT_WORD } from "@/app/constants/word";
import WordCreationModal from "@/app/intro/word-creation-modal";
import { encryptWord } from "@/app/utils/encrytion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Intro() {
  const router = useRouter();
  const { openModal } = useModalContext();

  const goToPlayPage = () => {
    router.push(
      `play?${searchParam.CODE}=${encryptWord(INITIAL_CORRECT_WORD)}`
    );
  };
  const openWordCreationModal = () => {
    openModal(<WordCreationModal />);
  };

  useEffect(() => {
    localStorage.setItem(localStorageKey.ATTEMPTED_WORDS, JSON.stringify([]));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <button
        onClick={goToPlayPage}
        className="bg-amber-200 rounded-lg w-40 h-20"
      >
        시작하기
      </button>
      <button
        className="bg-green-200 rounded-lg w-40 h-20"
        onClick={openWordCreationModal}
      >
        워들 생성하기
      </button>
    </main>
  );
}
