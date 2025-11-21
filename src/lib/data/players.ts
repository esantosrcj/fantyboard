import type { Player } from '../types';
import fantasyPlayersData from './fantasy-players.json';

export const NFL_TEAMS = [
	'ARI', // Cardinals
	'ATL', // Falcons
	'BAL', // Ravens
	'BUF', // Bills
	'CAR', // Panthers
	'CHI', // Bears
	'CIN', // Bengals
	'CLE', // Browns
	'DAL', // Cowboys
	'DEN', // Broncos
	'DET', // Lions
	'GB', // Packers
	'HOU', // Texans
	'IND', // Colts
	'JAC', // Jaguars
	'KC', // Chiefs
	'LAC', // Chargers
	'LAR', // Rams
	'LV', // Raiders
	'MIA', // Dolphins
	'MIN', // Vikings
	'NE', // Patriots
	'NO', // Saints
	'NYG', // Giants
	'NYJ', // Jets
	'PHI', // Eagles
	'PIT', // Steelers
	'SEA', // Seahawks
	'SF', // 49ers
	'TB', // Buccaneers
	'TEN', // Titans
	'WAS' // Commanders
];

export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'] as const;

// Load and filter players from JSON, only keeping those with complete data
export const TOP_PLAYERS: Player[] = (fantasyPlayersData as Player[])
	.filter((player): player is Player => {
		// Only include players that have all required fields
		return !!(
			player.id &&
			player.name &&
			player.position &&
			player.team &&
			typeof player.rank === 'number' &&
			typeof player.byeWeek === 'number' &&
			// Ensure position is valid
			POSITIONS.includes(player.position)
		);
	})
	.sort((a, b) => (a.rank || 999) - (b.rank || 999)); // Sort by rank, putting unranked players at the end
