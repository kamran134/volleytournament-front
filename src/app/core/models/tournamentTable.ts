import { Game } from "./game.model";
import { TeamStats } from "./team.model";
import { Tournament } from "./tournament.model";

export interface TournamentTable {
    tournament: Tournament;
    teams: TeamStats[];
    games: Game[];
}