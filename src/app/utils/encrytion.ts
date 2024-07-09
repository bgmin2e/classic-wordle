// 단어를 암호화하는 함수
export function encryptWord(word: string) {
  return btoa(word);
}

// 암호화된 값을 해독하여 단어로 반환하는 함수
export function decryptWord(encryptedWord: string) {
  return atob(encryptedWord);
}
