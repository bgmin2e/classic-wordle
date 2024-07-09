"use client";

import Keyboard from "@/app/components/keyboard/keyboard";
import { useToastBarContext } from "@/app/components/toastbar/toastbar";
import { MAX_WORD_LENGTH } from "@/app/constants/word";
import { AttemptedWord } from "@/app/models/word";
import { AttemptedWordRow } from "../play/attempted-word-row";
import { encryptWord } from "@/app/utils/encrytion";
import { useState } from "react";
import { searchParam } from "@/app/constants/search-params";
import { useModalContext } from "@/app/components/modal/modal";
import { validateWord } from "../utils/validate-word";
import { useInternalRouter } from "../hooks/use-internal-router";

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
    <div className="font-pixel p-6 flex flex-col gap-10 bg-yellow-200 rounded-lg shadow-lg">
      <p className="text-center text-xl">Please enter a five-letter word.</p>
      <AttemptedWordRow isCurrentAttempt word={word} />
      <Keyboard
        onPressKey={onPressKey}
        onPressEnter={onPressEnter}
        onPressDelete={onPressDelete}
      />
    </div>
  );
}
