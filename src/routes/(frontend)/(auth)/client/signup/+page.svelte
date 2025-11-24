<script lang="ts">
	import type { PageProps } from './$types';
	import SettingsSignup from './settings-Signup.svelte';
	let { data }: PageProps = $props();
</script>

<div class="h-screen">
	<SettingsSignup data={data.form} />
</div>
