<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import OnePagerQuestion from './OnePagerQuestion.svelte';

	let { data }: { data: PageData } = $props();
	const { questionsWithForms } = data;
</script>

<div class="mx-auto max-w-2xl px-4 py-10">
	<div class="mb-8 space-y-1 text-center">
		<h1 class="text-2xl font-semibold">{data.title}</h1>
		<p class="text-sm text-muted-foreground">
			Answer each question below. Your responses are completely anonymous.
		</p>
		<p class="font-mono text-xs text-muted-foreground">{questionsWithForms.length} questions</p>
	</div>

	<div class="space-y-6">
		{#each questionsWithForms as q, i (q.id)}
			<OnePagerQuestion question_data={q} index={i + 1} />
		{/each}
	</div>

	<div class="mt-10 flex justify-center">
		<Button variant="outline" href="/">Go Home</Button>
	</div>
</div>
