<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		type ColorMode,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	// 👇 always import the styles
	import '@xyflow/svelte/dist/style.css';
	import { writable, type Writable } from 'svelte/store';
	import { mode } from 'mode-watcher';

	let {
		nodes,
		edges
	}: {
		nodes: Writable<Node[]>;
		edges: Writable<Edge[]>;
	} = $props();

	let colorMode: ColorMode = $mode || 'dark';
</script>

<main class="h-[70vh]">
	<SvelteFlow
		{nodes}
		{edges}
		{colorMode}
		minZoom={1}
		maxZoom={10}
		initialViewport={{ x: 650, y: 100, zoom: 1 }}
	>
		<Background />
		<Controls />
	</SvelteFlow>
</main>
