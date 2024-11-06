<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from '../$types';

	let { data }: { data: PageData } = $props();

	let payment_plan: any | { plan: string; price: string } = $state();
	$effect(() => {
		const plan = localStorage.getItem('aurium');
		plan && (payment_plan = JSON.parse(plan));
	});
</script>

<div class="m-4 mx-auto">
	<p>{payment_plan?.plan}</p>
</div>
