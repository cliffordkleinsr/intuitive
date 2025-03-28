<script lang="ts">
	import d3Cloud from 'd3-cloud';
	import nlp from 'compromise';
	import stats, { type StatsMethods } from 'compromise-stats';
	import { extent } from 'd3-array';

	nlp.plugin(stats);
	interface WordFrequency {
		word: string;
		freq: number;
		rank: number;
		zipfExpected: number;
	}
	let { text = '' }: { text: string } = $props();

	const tokens = nlp(text.toLowerCase()).nouns().trim().text();
	const grams = nlp<StatsMethods>(tokens).unigrams();
	// Convert to a frequency map
	const wordCounts: Record<string, number> = grams.reduce(
		(acc: Record<string, number>, { normal, count }) => {
			acc[normal] = (acc[normal] || 0) + count;
			return acc;
		},
		{}
	);
	// Sort words by frequency (highest to lowest)
	const sortedWords: [string, number][] = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
	// create zipfsdistribution
	const zipfDistribution = sortedWords.map(([word, freq], index) => ({
		text: word,
		size: sortedWords[0][1] / (index + 1) // Expected frequency
	}));

	const dimensions = {
		width: 800,
		height: 500,
		margin: {
			top: 24,
			right: 0,
			bottom: 0,
			left: 0
		}
	};
	const wordPadding = 5;
	const cloudWords: {
		size: number | undefined;
		x: number | undefined;
		y: number | undefined;
		rotate: number | undefined;
		text: string | undefined;
	}[] = [];

	$effect.pre(() => {
		// $inspect(zipfDistribution)
		const cloud = d3Cloud()
			.size([
				dimensions.width - dimensions.margin.left - dimensions.margin.right,
				dimensions.height - dimensions.margin.top - dimensions.margin.bottom
			])
			.words(zipfDistribution)
			.padding(wordPadding)
			.rotate(0)
			.font('Helvetica')
			.spiral('archimedean')
			.fontSize((d) => Math.sqrt(d.size as number) * 20)
			.on('word', ({ size, x, y, rotate, text }) => {
				cloudWords.push({ size, x, y, rotate, text });
			});

		cloud.start();
		return () => {
			cloud.stop();
		};
	});

	const [, maxFrequency] = extent(cloudWords, (d) => d.size);
</script>

<svg
	{...dimensions}
	viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
	text-anchor="middle"
	font-family="Helvetica"
>
	<g transform={`translate(0 ${dimensions.margin.top})`}>
		{#each cloudWords as word}
			<text
				font-size={word.size}
				transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
				fill="#f54b02"
				opacity={word.size! / maxFrequency!}
			>
				{word.text}
			</text>
		{/each}
	</g>
</svg>
