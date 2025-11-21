export interface Player {
	id: string;
	name: string;
	position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
	team: string;
	byeWeek?: number;
	rank?: number;
	adp?: number; // Average Draft Position
}

export interface DraftedPlayer extends Player {
	round: number;
	pick: number;
	overallPick: number;
	draftedBy: string; // Team
}

export interface DraftSettings {
	leagueName: string;
	numberOfTeams: number;
	numberOfRounds: number;
	teamNames: string[];
	draftType: 'snake' | 'linear';
}

export interface DraftPickSquare {
	round: number;
	pick: number;
	overallPick: number;
	teamIndex: number;
	team?: string;
	player?: DraftedPlayer;
}

export interface DraftState {
	draftBoard: DraftPickSquare[];
	draftedPlayers: DraftedPlayer[];
	currentPickIndex: number;
}

export interface ConfettiParticle {
	id: number;
	color: string;
	left: number;
	top: number;
	delay: number;
	duration: number;
	size: number;
	rotation: number;
}
