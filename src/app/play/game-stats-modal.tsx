import { useModalContext } from "@/components/modal/modal";
import { GameStats } from "../../hooks/use-game-stats";
import { useInternalRouter } from "../../hooks/use-internal-router";
import { useEffect, useState } from "react";
import { localStorageKey } from "../../constants/local-storage";

export default function GameStatsModal({ isWin = false }: { isWin?: boolean }) {
  const [stats, setStats] = useState<GameStats>();

  const { closeModal } = useModalContext();
  const router = useInternalRouter();

  useEffect(() => {
    if (localStorage) {
      const strigStats =
        localStorage.getItem(localStorageKey.GAME_STATS) ?? "{}";
      const stats = JSON.parse(strigStats);
      console.log(stats);
      setStats(stats);
    }
  }, []);

  if (!stats) {
    return (
      <div className="border border-black outline outline-[2px] outline-pink-300 rounded-xl bg-[#fff1fb] text-gray-800 font-pixel p-6 w-full max-w-sm mx-auto shadow-[4px_4px_0_#000] flex flex-col gap-4 items-center">
        <p className="font-bold text-2xl text-center animate-bounce">
          Game stats not found.
        </p>
      </div>
    );
  }

  const { totalAttempts, totalGames, totalWins, startAt, endAt } = stats;
  const playTime = formattedElapsedTime(startAt, endAt);
  const winRate = ((totalWins / totalGames) * 100).toFixed(2);

  const goToHome = () => {
    router.replace("/");
    closeModal();
  };

  return (
    <div className="border border-black outline outline-[2px] outline-pink-300 rounded-xl bg-[#fff1fb] text-gray-800 font-pixel p-6 w-full max-w-sm mx-auto shadow-[4px_4px_0_#000] flex flex-col gap-4 items-center">
      <p className="font-bold text-2xl text-center animate-bounce">
        {isWin ? "SUCCEED!" : "FAILED.."}
      </p>
      <p className="text-center">PLAY TIME: {playTime}</p>
      <p className="text-center">TOTAL WINS: {totalWins}</p>
      <p className="text-center">WIN RATE: {winRate}%</p>
      <p className="text-center">TOTAL ATTEMPTS: {totalAttempts}</p>
      <button
        onClick={goToHome}
        className="bg-yellow-300 border border-black outline outline-[2px] outline-pink-300 rounded-full text-sm text-black font-bold uppercase shadow-[3px_3px_0_#000] active:translate-x-[2px] active:translate-y-[2px] transition px-4 py-2 mt-4"
      >
        GO BACK TO HOME
      </button>
    </div>
  );
}

function formattedElapsedTime(startTime: number, endTime?: number) {
  if (!startTime || !endTime) {
    return "-";
  }
  const timeDiff = endTime - startTime;

  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = 60 * millisecondsPerSecond;
  const millisecondsPerHour = 60 * millisecondsPerMinute;

  const hours = Math.floor(timeDiff / millisecondsPerHour);
  const minutes = Math.floor(
    (timeDiff % millisecondsPerHour) / millisecondsPerMinute
  );
  const seconds = Math.floor(
    (timeDiff % millisecondsPerMinute) / millisecondsPerSecond
  );

  return `${hours} h ${minutes} m ${seconds} s`;
}
