import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import { TOP_PLAYERS } from '../data/players';
import { validateSettings } from '../helpers';
import type {
	DraftedPlayer,
	DraftPickSquare,
	DraftSettings,
	DraftState,
	Player
} from '../types';

// Core stores
export const settings = writable<DraftSettings | null>(null);
export const draftBoard = writable<DraftPickSquare[]>([]);
export const draftedPlayers = writable<DraftedPlayer[]>([]);
export const currentPickIndex = writable<number>(0);
export const isLoading = writable<boolean>(true);
export const recentlyDraftedPlayer = writable<DraftedPlayer | null>(null);

// Derived store that filters available players based drafted status
export const availablePlayers = derived(
	[draftedPlayers],
	([$draftedPlayers]) => {
		// Get IDs of already drafted players
		const draftedIds = new Set($draftedPlayers.map((p) => p.id));

		// Filter out drafted players
		return TOP_PLAYERS.filter((p) => !draftedIds.has(p.id));
	}
);

// Derived store watches the settings and validates them
export const isConfigured = derived(settings, ($settings) => {
	return $settings !== null && validateSettings($settings);
});

// Derived store automatically updates when either draftBoard or currentPickIndex changes
export const currentPick = derived(
	[draftBoard, currentPickIndex], // Dependencies (array of stores)
	([$draftBoard, $currentPickIndex]) => {
		// Function that computes the current pick
		return $draftBoard[$currentPickIndex] || null;
	}
);

// Derived store automatically updates when settings changes
export const totalPicks = derived(settings, ($settings) => {
	return $settings ? $settings.numberOfTeams * $settings.numberOfRounds : 0;
});

// Derived store automatically updates when draftedPlayers or totalPicks changes
export const isComplete = derived(
	[draftedPlayers, totalPicks], // Dependencies (array of stores)
	([$draftedPlayers, $totalPicks]) => {
		// Function that computes if the draft is complete
		return $draftedPlayers.length >= $totalPicks && $totalPicks > 0;
	}
);

// Actions
export const draftActions = {
	// Initialize draft board
	initializeDraftBoard: (draftSettings: DraftSettings) => {
		const board: DraftPickSquare[] = [];
		let overallPick = 1;

		for (let round = 1; round <= draftSettings.numberOfRounds; round++) {
			for (let pick = 1; pick <= draftSettings.numberOfTeams; pick++) {
				let teamIndex: number;

				if (draftSettings.draftType === 'linear') {
					// Linear draft: same order every round
					teamIndex = pick - 1;
				} else {
					// Snake draft: odd rounds go 1->numTeams, even rounds go numTeams->1
					const isOddRound = round % 2 === 1;
					teamIndex = isOddRound
						? pick - 1
						: draftSettings.numberOfTeams - pick;
				}

				board.push({
					round,
					pick,
					overallPick,
					teamIndex,
					player: undefined
				});

				overallPick++;
			}
		}

		// Mutates the store (triggers reactivity)
		draftBoard.set(board);
		// Mutates the store (triggers reactivity)
		currentPickIndex.set(0);
	},

	// Draft a player
	draftPlayer: (player: Player) => {
		const currentBoard = get(draftBoard); // One-time snapshot
		const currentIndex = get(currentPickIndex); // One-time snapshot
		const currentSettings = get(settings); // One-time snapshot

		if (!currentSettings || currentIndex >= currentBoard.length) {
			return false;
		}

		const square = currentBoard[currentIndex];
		const teamName =
			currentSettings.teamNames[square.teamIndex] ||
			`Team ${square.teamIndex + 1}`;

		// Create drafted player
		const draftedPlayer: DraftedPlayer = {
			...player,
			draftedBy: teamName,
			round: square.round,
			pick: square.pick,
			overallPick: square.overallPick
		};

		// Mutates the store (triggers reactivity)
		draftBoard.update((board) => {
			const newBoard = [...board];
			newBoard[currentIndex] = { ...square, player: draftedPlayer };
			return newBoard;
		});

		// Mutates the store (triggers reactivity)
		draftedPlayers.update((players) => [...players, draftedPlayer]);

		// Set recently drafted player for celebration
		recentlyDraftedPlayer.set(draftedPlayer);

		// Mutates the store (triggers reactivity)
		currentPickIndex.update((index) => index + 1);

		// Save state
		draftActions.saveState();

		return true;
	},

	// Undo last pick
	undoLastPick: () => {
		const drafted = get(draftedPlayers); // One-time snapshot
		const currentBoard = get(draftBoard); // One-time snapshot

		if (drafted.length === 0) return false;

		const lastPlayer = drafted[drafted.length - 1];
		const squareIndex = currentBoard.findIndex(
			(square) => square.overallPick === lastPlayer.overallPick
		);

		if (squareIndex === -1) return false;

		// Mutates the store (triggers reactivity)
		draftBoard.update((board) => {
			const newBoard = [...board];
			newBoard[squareIndex] = { ...board[squareIndex], player: undefined };
			return newBoard;
		});

		// Mutates the store (triggers reactivity)
		draftedPlayers.update((players) => players.slice(0, -1));

		// Mutates the store (triggers reactivity)
		currentPickIndex.set(squareIndex);

		// Save state
		draftActions.saveState();

		return true;
	},

	// Reset entire draft
	resetDraft: () => {
		if (!browser) return;

		// Mutates the store (triggers reactivity)
		draftedPlayers.set([]);
	},

	// Save settings to localStorage
	saveSettings: (draftSettings: DraftSettings) => {
		if (!browser) return false;

		try {
			if (validateSettings(draftSettings)) {
				localStorage.setItem(
					'fanty-draft-settings',
					JSON.stringify(draftSettings)
				);
				// Mutates the store (triggers reactivity)
				settings.set(draftSettings);
				return true;
			}
		} catch {
			// Error saving settings - silently fail
		}
		return false;
	},

	// Load settings from localStorage
	loadSettings: () => {
		if (!browser) {
			isLoading.set(false);
			return;
		}

		try {
			const saved = localStorage.getItem('fanty-draft-settings');
			if (saved) {
				const parsed = JSON.parse(saved) as DraftSettings;
				if (validateSettings(parsed)) {
					// Mutates the store (triggers reactivity)
					settings.set(parsed);

					// Helps with page refresh and no state saved
					draftActions.initializeDraftBoard(parsed);
				}
			}
		} catch {
			// Error loading settings - silently fail
		} finally {
			// Always set loading to false when done
			isLoading.set(false);
		}
	},

	// Clear settings from localStorage and store
	clearSettings: () => {
		if (!browser) return;

		try {
			localStorage.removeItem('fanty-draft-settings');
			// Mutates the store (triggers reactivity)
			settings.set(null);
		} catch {
			// Error clearing settings - silently fail
		}
	},

	// Save current state to localStorage
	saveState: () => {
		if (!browser) return;

		try {
			const state: DraftState = {
				draftBoard: get(draftBoard), // One-time snapshot
				draftedPlayers: get(draftedPlayers), // One-time snapshot
				currentPickIndex: get(currentPickIndex) // One-time snapshot
			};
			localStorage.setItem('fanty-draft-state', JSON.stringify(state));
		} catch {
			// Error saving state - silently fail
		}
	},

	// Load state from localStorage
	loadState: () => {
		if (!browser) return;

		try {
			const saved = localStorage.getItem('fanty-draft-state');
			if (saved) {
				const state = JSON.parse(saved) as DraftState;
				const currentSettings = get(settings); // One-time snapshot

				// Validate state matches current settings
				if (
					currentSettings &&
					state.draftBoard &&
					state.draftBoard.length ===
						currentSettings.numberOfTeams * currentSettings.numberOfRounds
				) {
					// Mutates the store (triggers reactivity)
					draftBoard.set(state.draftBoard);
					// Mutates the store (triggers reactivity)
					draftedPlayers.set(state.draftedPlayers || []);
					// Mutates the store (triggers reactivity)
					currentPickIndex.set(state.currentPickIndex || 0);
				}
			}
		} catch {
			// Error loading state - silently fail
		}
	},

	// Clear draft state from localStorage and store
	clearDraftState: () => {
		if (!browser) return;

		try {
			localStorage.removeItem('fanty-draft-state');
			// Mutates the store (triggers reactivity)
			draftBoard.set([]);
			// Mutates the store (triggers reactivity)
			draftedPlayers.set([]);
			// Mutates the store (triggers reactivity)
			currentPickIndex.set(0);
		} catch {
			// Error clearing settings - silently fail
		}
	},

	// Clear recently drafted player
	clearRecentlyDraftedPlayer: () => {
		recentlyDraftedPlayer.set(null);
	}
};

// Helper derived stores for UI
export const currentPickNumber = derived(currentPick, ($currentPick) => {
	return $currentPick?.overallPick || 1;
});

export const currentTeamName = derived(
	[currentPick, settings],
	([$currentPick, $settings]) => {
		if (!$currentPick || !$settings) return '';
		return (
			$settings.teamNames[$currentPick.teamIndex] ||
			`Team ${$currentPick.teamIndex + 1}`
		);
	}
);

export const draftBoardByRounds = derived(
	[draftBoard, settings],
	([$draftBoard, $settings]) => {
		if (!$settings) return [];

		const rounds = [];
		for (let round = 1; round <= $settings.numberOfRounds; round++) {
			const roundSquares = $draftBoard
				.filter((square) => square.round === round)
				.sort((a, b) => a.teamIndex - b.teamIndex);
			rounds.push(roundSquares);
		}
		return rounds;
	}
);

// Helper function to check if a square is the current clickable pick
export const isSquareClickable = derived(
	[currentPickNumber],
	([$currentPickNumber]) => {
		return (square: DraftPickSquare) => {
			return square.overallPick === $currentPickNumber && !square.player;
		};
	}
);
