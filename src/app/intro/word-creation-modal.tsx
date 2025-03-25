"use client";

import Keyboard from "@/components/keyboard/keyboard";
import { useToastBarContext } from "@/components/toastbar/toastbar";
import { MAX_WORD_LENGTH } from "@/constants/word";
import { AttemptedWord } from "@/models/word";
import { AttemptedWordRow } from "../play/attempted-word-row";
import { encryptWord } from "@/lib/encrytion";
import { useState } from "react";
import { searchParam } from "@/constants/search-params";
import { useModalContext } from "@/components/modal/modal";
import { validateWord } from "../../lib/validate-word";
import { useInternalRouter } from "../../hooks/use-internal-router";

export default function WordCreationModal() {
  const { closeModal } = useModalContext();
  const { showToastbar } = useToastBarContext();
  const router = useInternalRouter();

  const [word, setWord] = useState<AttemptedWord>("");

  const onPressEnter = async () => {
    if (word.length < MAX_WORD_LENGTH) {
      showToastbar("Not enough letters");
      return;
    }

    const validationResult = await validateWord(word);
    if (validationResult instanceof Error) {
      showToastbar("No Definitions Found", "error");
      return;
    }
    const encryptedWord = encryptWord(word);
    router.push(`/play/?${searchParam.CODE}=${encryptedWord}`);
    closeModal();
  };

  const onPressDelete = () => setWord((prevWord) => prevWord.slice(0, -1));

  const onPressKey = (value: string) =>
    setWord((prev) => (prev + value).slice(0, MAX_WORD_LENGTH));

  return (
    <div className="border border-black outline outline-[2px] outline-pink-300 rounded-xl bg-[#fff1fb] text-gray-800 font-pixel p-6 w-full mx-auto shadow-[4px_4px_0_#000] flex flex-col gap-6 items-center">
      <p className="text-center text-base font-bold">
        Please enter a five-letter word.
      </p>
      <AttemptedWordRow isCurrentAttempt word={word} />
      <Keyboard
        onPressKey={onPressKey}
        onPressEnter={onPressEnter}
        onPressDelete={onPressDelete}
      />
    </div>
  );
}
