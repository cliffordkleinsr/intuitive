<script lang="ts">
	import type { PageData } from './$types';
	import SettingsBranch from './settingsBranch.svelte';

	let { data }: { data: PageData } = $props();
	const { questions, available_qns } = data;
</script>

<p>{available_qns.question}</p>
<!-- <SettingsBranch /> -->
