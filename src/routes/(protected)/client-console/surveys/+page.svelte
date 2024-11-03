<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/client-dash');
	});
</script>

<div class="m-4 mx-auto animate-bounce">🤡</div>
