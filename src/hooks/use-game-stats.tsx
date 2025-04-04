import { localStorageKey } from "@/constants/local-storage";
import useLocalStorage from "./use-local-storage";

export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalAttempts: number;
  startAt: number;
  endAt?: number;
}

export const useGameStats = () => {
  const [stats, setStats] = useLocalStorage<GameStats>({
    key: localStorageKey.GAME_STATS,
    initialValue: {
      totalGames: 0,
      totalWins: 0,
      totalAttempts: 0,
      startAt: Date.now(),
    },
  });

  const updateStats = ({
    isWin,
    attempts,
  }: {
    isWin: boolean;
    attempts: number;
  }) => {
    const updatedStats: GameStats = {
      totalGames: stats.totalGames + 1,
      totalWins: stats.totalWins + (isWin ? 1 : 0),
      totalAttempts: stats.totalAttempts + attempts,
      startAt: stats.startAt,
      endAt: Date.now(),
    };

    setStats(updatedStats);
  };

  return { stats, updateStats };
};
