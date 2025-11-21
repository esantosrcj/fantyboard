import { writable } from 'svelte/store';

export interface ToastMessage {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	duration?: number;
	timeoutId?: NodeJS.Timeout;
}

export const toasts = writable<ToastMessage[]>([]);

export const addToast = (
	message: string,
	type: 'success' | 'error' | 'info' = 'success',
	duration = 3000
) => {
	const id = Date.now().toString();
	const toast: ToastMessage = { id, message, type, duration };

	// Add the toast to the store
	toasts.update((messages) => [...messages, toast]);

	// Set up automatic removal if duration is provided
	if (duration > 0) {
		const timeoutId = setTimeout(() => {
			removeToast(id);
		}, duration);

		// Store the timeout ID for potential cancellation
		toasts.update((messages) =>
			messages.map((msg) => (msg.id === id ? { ...msg, timeoutId } : msg))
		);
	}

	return id;
};

export const removeToast = (id: string) => {
	toasts.update((messages) => {
		const messageToRemove = messages.find((m) => m.id === id);

		// Clear any existing timeout
		if (messageToRemove?.timeoutId) {
			clearTimeout(messageToRemove.timeoutId);
		}

		return messages.filter((m) => m.id !== id);
	});
};

export const clearAllToasts = () => {
	toasts.update((messages) => {
		// Clear all timeouts
		messages.forEach((msg) => {
			if (msg.timeoutId) {
				clearTimeout(msg.timeoutId);
			}
		});

		return [];
	});
};
