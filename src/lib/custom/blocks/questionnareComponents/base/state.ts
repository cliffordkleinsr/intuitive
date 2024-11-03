// store.ts
import { writable, derived } from 'svelte/store';

function createOptionStore(maxLength: number) {
	const getInitialState = () => [{ option: '' }];
	const { subscribe, update, set } = writable(getInitialState());

	return {
		subscribe,
		add: () =>
			update((options) => (options.length < maxLength ? [...options, { option: '' }] : options)),
		remove: () => update((options) => (options.length > 1 ? options.slice(0, -1) : options)),
		reset: () => {
			set(getInitialState());
		},
		set
	};
}

export const multiples = createOptionStore(5);
export const options = createOptionStore(5);
export const rankers = createOptionStore(5);

export const multiplesDisabled = derived(multiples, ($multiples) => $multiples.length >= 5);
export const multiplesOther = derived(multiples, ($multiples) => $multiples.length <= 1);
export const optionsDisabled = derived(options, ($options) => $options.length >= 5);
export const optionsOther = derived(options, ($options) => $options.length <= 1);
export const rankersDisabled = derived(rankers, ($rankers) => $rankers.length >= 5);
export const rankersOther = derived(rankers, ($rankers) => $rankers.length <= 1);
