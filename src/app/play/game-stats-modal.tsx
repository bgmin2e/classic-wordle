"use client";
import { useModalContext } from "@/app/components/modal/modal";
import { GameStats } from "@/app/utils/use-game-stats";
import { useRouter } from "next/navigation";

export default function GameStatsModal({
  isWin,
  stats,
}: {
  isWin: boolean;
  stats: GameStats;
}) {
  const { closeModal } = useModalContext();
  const router = useRouter();

  const { totalAttempts, totalGames, totalWins, startAt, endAt } = stats;
  const playTime = formattedElapsedTime(startAt, endAt);
  const winRate = ((totalWins / totalGames) * 100).toFixed(2);

  const goToHome = () => {
    router.push("/");
    closeModal();
  };

  return (
    <div className="p-10 flex flex-col gap-4">
      <p className="font-bold text-2xl">{isWin ? "succeed!" : "failed.."}</p>
      <p>playtime: {playTime}</p>
      <p>total wins: {totalWins}</p>
      <p>total win rate: {winRate}</p>
      <p>total attempts: {totalAttempts}</p>
      <button
        onClick={goToHome}
        className="bg-amber-200 w-full h-10 rounded-xl"
      >
        Go back to home
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

  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
}
