class Options {
	// Main reactive state managed by $state
	options = $state([{ option: '' }]);
	maxLength = $state(0);
	disabled = $derived(this.options.length >= this.maxLength);
	other = $derived(this.options.length <= 1);

	constructor(maxLength: number) {
		this.maxLength = maxLength;
	}

	add() {
		if (this.options.length < this.maxLength) {
			this.options.push({ option: '' });
		} else {
			this.options;
		}
	}

	remove() {
		if (this.options.length > 1) {
			this.options.pop();
		} else {
			this.options;
		}
	}

	reset() {
		this.options = [{ option: '' }];
	}
}

const multiples = new Options(5);
const selection = new Options(5);
const rankers = new Options(5);

export { multiples, selection, rankers };
