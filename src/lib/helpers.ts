import type { DraftSettings, DraftedPlayer } from './types';

export const DEFAULT_SETTINGS: DraftSettings = {
	leagueName: '',
	numberOfTeams: 8,
	numberOfRounds: 15,
	teamNames: [],
	draftType: 'snake'
};

export function validateSettings(
	settings: Partial<DraftSettings>
): settings is DraftSettings {
	return (
		typeof settings.leagueName === 'string' &&
		typeof settings.numberOfTeams === 'number' &&
		settings.numberOfTeams >= 6 &&
		settings.numberOfTeams <= 8 &&
		typeof settings.numberOfRounds === 'number' &&
		settings.numberOfRounds >= 10 &&
		settings.numberOfRounds <= 15 &&
		Array.isArray(settings.teamNames) &&
		typeof settings.draftType === 'string' &&
		(settings.draftType === 'snake' || settings.draftType === 'linear')
	);
}

export function getDefaultTeamNames(numTeams: number): string[] {
	const defaultNames = [
		'Team 1',
		'Team 2',
		'Team 3',
		'Team 4',
		'Team 5',
		'Team 6',
		'Team 7',
		'Team 8',
		'Team 9',
		'Team 10',
		'Team 11',
		'Team 12',
		'Team 13',
		'Team 14',
		'Team 15',
		'Team 16',
		'Team 17',
		'Team 18',
		'Team 19',
		'Team 20'
	];

	return defaultNames.slice(0, numTeams);
}

export function generateDefaultTeamNames(numberOfTeams: number): string[] {
	return Array.from({ length: numberOfTeams }, (_, i) => `Team ${i + 1}`);
}

export function getPositionColor(position: string): string {
	switch (position) {
		case 'QB':
			return 'bg-red-100 text-red-800 border-red-200';
		case 'RB':
			return 'bg-green-100 text-green-800 border-green-200';
		case 'WR':
			return 'bg-blue-100 text-blue-800 border-blue-200';
		case 'TE':
			return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		case 'K':
			return 'bg-purple-100 text-purple-800 border-purple-200';
		case 'DEF':
			return 'bg-gray-100 text-gray-800 border-gray-200';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200';
	}
}

export function getPositionBackgroundColor(position: string): string {
	switch (position) {
		case 'QB':
			return 'bg-red-200 text-gray-900';
		case 'RB':
			return 'bg-green-200 text-gray-900';
		case 'WR':
			return 'bg-blue-200 text-gray-900';
		case 'TE':
			return 'bg-yellow-200 text-gray-900';
		case 'K':
			return 'bg-purple-200 text-gray-900';
		case 'DEF':
			return 'bg-gray-200 text-gray-900';
		default:
			return 'bg-gray-200 text-gray-900';
	}
}

export function getTeamColor(teamIndex: number): string {
	// Generate consistent colors for teams
	const colors = [
		'bg-blue-100 border-blue-300 text-blue-800',
		'bg-green-100 border-green-300 text-green-800',
		'bg-purple-100 border-purple-300 text-purple-800',
		'bg-red-100 border-red-300 text-red-800',
		'bg-yellow-100 border-yellow-300 text-yellow-800',
		'bg-pink-100 border-pink-300 text-pink-800',
		'bg-indigo-100 border-indigo-300 text-indigo-800',
		'bg-gray-100 border-gray-300 text-gray-800',
		'bg-orange-100 border-orange-300 text-orange-800',
		'bg-teal-100 border-teal-300 text-teal-800',
		'bg-cyan-100 border-cyan-300 text-cyan-800',
		'bg-lime-100 border-lime-300 text-lime-800',
		'bg-emerald-100 border-emerald-300 text-emerald-800',
		'bg-violet-100 border-violet-300 text-violet-800',
		'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
		'bg-rose-100 border-rose-300 text-rose-800',
		'bg-sky-100 border-sky-300 text-sky-800',
		'bg-amber-100 border-amber-300 text-amber-800',
		'bg-stone-100 border-stone-300 text-stone-800',
		'bg-zinc-100 border-zinc-300 text-zinc-800'
	];
	return colors[teamIndex % colors.length];
}

export function formatPickNumber(
	overallPick: number,
	round: number,
	pick: number
): string {
	return `${overallPick} (${round}.${pick})`;
}

export function isDraftComplete(
	draftedPlayers: DraftedPlayer[],
	totalPicks: number
): boolean {
	return draftedPlayers.length >= totalPicks;
}

export function formatPlayerNameDisplay(
	name: string,
	position: string
): { firstName: string; lastName: string } {
	if (position === 'DEF') {
		// For defense, split at last space to get team name (e.g., "San Francisco 49ers" -> "San Francisco", "49ers")
		const parts = name.split(' ');
		const lastName = parts[parts.length - 1];
		return { firstName: '', lastName };
	} else {
		// For players, split at first space to handle multiple last names (e.g., "Julio Jones-Smith" -> "Julio", "Jones-Smith")
		const spaceIndex = name.indexOf(' ');
		if (spaceIndex === -1) {
			return { firstName: '', lastName: name };
		}
		const firstName = name.substring(0, spaceIndex);
		const lastName = name.substring(spaceIndex + 1);
		return { firstName, lastName };
	}
}
