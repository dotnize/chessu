import GameAuthWrapper from "@/components/game/GameAuthWrapper";
import { getGame } from "@/lib/game";
import { notFound } from "next/navigation";

export default async function Game({ params }: { params: { code: string } }) {
  const game = await getGame(params.code);
  if (!game) {
    notFound();
  }

  return <GameAuthWrapper initialLobby={game} />;
}
