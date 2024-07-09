"use client";

import Keyboard from "@/app/components/keyboard/keyboard";
import { useToastBarContext } from "@/app/components/toastbar/toastbar";
import { MAX_WORD_LENGTH } from "@/app/constants/word";
import { AttemptedWord } from "@/app/models/word";
import { AttemptedWordRow } from "../play/attempted-word-row";
import { encryptWord } from "@/app/utils/encrytion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchParam } from "@/app/constants/search-params";
import { useValidateWord } from "@/app/utils/use-validate-word";
import { useModalContext } from "@/app/components/modal/modal";

export default function WordCreationModal() {
  const router = useRouter();

  const { closeModal } = useModalContext();
  const { showToastbar } = useToastBarContext();

  // word validation hook
  const { validateWord } = useValidateWord();

  const [word, setWord] = useState<AttemptedWord>("");

  const onPressEnter = async () => {
    if (word.length < MAX_WORD_LENGTH) {
      showToastbar("Not enough letters");
      return;
    }

    const errorMessage = await validateWord(word);
    if (errorMessage) {
      showToastbar(errorMessage);
      return;
    }
    const encryptedWord = encryptWord(word);
    router.push(`play/?${searchParam.CODE}=${encryptedWord}`);
    closeModal();
  };

  const onPressDelete = () => setWord((prevWord) => prevWord.slice(0, -1));

  const onPressKey = (value: string) =>
    setWord((prev) => (prev + value).slice(0, MAX_WORD_LENGTH));

  return (
    <div className="p-10 flex flex-col gap-10">
      <p>Please enter a five-letter word.</p>
      <AttemptedWordRow isCurrentAttempt word={word} />
      <Keyboard
        onPressKey={onPressKey}
        onPressEnter={onPressEnter}
        onPressDelete={onPressDelete}
        keyStatuses={{}}
      />
    </div>
  );
}
