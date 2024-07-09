import { http } from "./utils/http";

export function getWordValidationResult(word: string) {
  return http.get<Response>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
}
