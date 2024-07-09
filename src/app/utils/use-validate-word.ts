export const useValidateWord = () => {
  const validateWord = async (word: string) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        return "Not in word list";
      }
    } catch (error) {
      return "Failed to check word validation";
    }
  };
  return { validateWord };
};
