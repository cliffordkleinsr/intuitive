<script lang="ts">
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import Target from 'lucide-svelte/icons/target';
	import Webcam from 'lucide-svelte/icons/webcam';
	import Star from 'lucide-svelte/icons/star';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import BarChart4 from 'lucide-svelte/icons/chart-column-increasing';
</script>

<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-black">
		<Webcam class="size-6 text-primary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Open-Ended</h4>
		<p class="text-sm text-muted-foreground">Allows for free-form responses from the user.</p>
	</div>
</div>
<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-secondary">
		<CheckCheck class="size-6 text-secondary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Multiple Selection</h4>
		<p class="text-sm text-muted-foreground">
			Presents the user with a set of options to choose from.
		</p>
	</div>
</div>
<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-secondary">
		<Target class="size-6 text-secondary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Single Selection</h4>
		<p class="text-sm text-muted-foreground">
			Presents the user with a set of options where respondents can choose only one option.
		</p>
	</div>
</div>
<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-secondary">
		<Star class="size-6 text-secondary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Rating</h4>
		<p class="text-sm text-muted-foreground">
			A type of closed-ended question that asks respondents to evaluate something on a scale.
		</p>
	</div>
</div>
<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-secondary">
		<SlidersHorizontal class="size-6 text-secondary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Likert</h4>
		<p class="text-sm text-muted-foreground">
			Presents the user with a psychometric scale used to measure attitudes, opinions, or beliefs.
		</p>
	</div>
</div>
<div class="flex items-center gap-4">
	<div class="flex aspect-square w-12 items-center justify-center rounded-md bg-secondary">
		<BarChart4 class="size-6 text-secondary-foreground" />
	</div>
	<div class="grid gap-1">
		<h4 class="font-semibold">Ranking</h4>
		<p class="text-sm text-muted-foreground">
			Presents the user with a list of items where respondents can compare and order these items
			based on a specific criterion.
		</p>
	</div>
</div>
