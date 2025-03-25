export function encryptWord(word: string) {
  return btoa(word);
}

export function decryptWord(encryptedWord: string) {
  return atob(encryptedWord);
}
