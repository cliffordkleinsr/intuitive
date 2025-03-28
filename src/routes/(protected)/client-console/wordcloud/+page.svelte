<script lang="ts">
	import WordCloud from '$lib/custom/blocks/wordcloud/WordCloud.svelte';
	import type { PageData } from './$types';
	import nlp from 'compromise';
	// import plugin from 'compromise-stats'
	import stats, { type StatsMethods } from 'compromise-stats';
	import { descending, rollups } from 'd3-array';

	// nlp.plugin(stats);
	// nlp.extend(stats)

	let { data }: { data: PageData } = $props();
	const text = `
				Who controls the British crown? 
				Who keeps the metric system down? 
				We do, we do! 

				Who leaves Atlantis off the maps? 
				Who keeps the Martians under wraps? 
				We do, we do! 

				Who holds back the electric car? 
				Who makes Steve Guttenberg a star? 
				We do, we do! 

				Who robs cavefish of their sight? 
				Who rigs every Oscar night? 
				We do! 
				We do! 
		`;
	// const tokens = text.trim().split(/\s+/g);

	// const freq = rollups(
	// tokens,
	// (g) => g.length,
	// (w) => w.toLowerCase()
	// )
	// .sort(([, a], [, b]) => descending(a, b))
	// .map(([key, size]) => ({ text: key, size }));
	// let doc = nlp<StatsMethods>(text.toLowerCase()).unigrams(); //
	// interface WordFrequency {
	// 	word: string;
	// 	freq: number;
	// 	rank: number;
	// 	zipfExpected: number;
	// }
	// // Convert to a frequency map
	// const wordCounts: Record<string, number> = doc.reduce((acc: Record<string, number>, { normal, count }) => {
	// 	acc[normal] = (acc[normal] || 0) + count;
	// 	return acc;
	// }, {});
	// // Sort words by frequency (highest to lowest)
	// const sortedWords: [string, number][] = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
	// const zipfDistribution:WordFrequency[] = sortedWords.map(([word, freq], index) => ({
	// 	word,
	// 	freq,
	// 	rank: index + 1, // Rank starts at 1
	// 	zipfExpected: sortedWords[0][1] / (index + 1), // Expected frequency
	// }));
	// // $inspect(zipfDistribution);
</script>

<div class="place-items-center py-10">
	<div class="">
		<!-- <PhoneInput /> -->
		<WordCloud {text} />
	</div>
</div>
