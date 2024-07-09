import { useState, useEffect } from "react";

export default function useLocalStorage<T>({
  key,
  initialValue,
}: {
  key: string;
  initialValue: T;
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const isBrowser = typeof window !== "undefined";

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (isBrowser) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue, isBrowser]);

  return [storedValue, setStoredValue];
}
