<script lang="ts">
	import SettingsForm from './settings-loginc.svelte';

	// const to = $page.url.searchParams.get('redirectTo')
	// console.log(to?.slice(1))
	export let data;
</script>

<SettingsForm data={data.form} />
