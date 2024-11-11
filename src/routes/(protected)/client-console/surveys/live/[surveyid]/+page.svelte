<script lang="ts">
	import { LiveQuest } from '$lib/custom/blocks/composition';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: any | undefined } = $props();
	const {
		Role: user,
		survey_data: { title, desc },
		features: { gender_active, ages, maxagents: target }
	} = data;
	let rest = {
		age: ages,
		gender: gender_active
	};
</script>

<div class="py-16">
	<div class="grid justify-center gap-2">
		<h1 class="text-3xl font-semibold">Going Live</h1>
		<div class="grid gap-2">
			<h1 class="text-lg font-semibold">{title}</h1>
			<div class="grid gap-2 py-10">
				<img
					class="w-48"
					src="https://res.cloudinary.com/dmy8yp9el/image/upload/v1725974109/anfir41re6vnhxecg52s.png"
					alt="live"
				/>
				<p class="max-w-xs truncate text-muted-foreground">{desc}</p>
			</div>
			<div class="grid max-w-xl gap-2">
				<LiveQuest {target} {user} {form} {...rest} />
			</div>
		</div>
	</div>
</div>
