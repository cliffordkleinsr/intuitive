<script lang="ts">
	import type { PageData } from './$types';
	import SettingsBranch from './settingsBranch.svelte';

	let { data }: { data: PageData } = $props();
	const { questions, available_qns, selectForm } = data;
</script>

<p>{available_qns.question}</p>
<SettingsBranch data={selectForm} surveyqns={questions} qs={available_qns} />
