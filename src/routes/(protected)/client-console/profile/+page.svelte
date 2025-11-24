<script lang="ts">
	import type { PageProps } from './$types';
	import SettingsProfile from './settings-Profile.svelte';

	let { data }: PageProps = $props();
</script>

<SettingsProfile data={data.form} />
