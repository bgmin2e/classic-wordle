import axios from "axios";
import { getWordValidationResult } from "../services/api";

export async function validateWord(word: string) {
  try {
    const response = await getWordValidationResult(word);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data);
    }
    throw error;
  }
}
