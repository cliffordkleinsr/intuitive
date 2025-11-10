<script lang="ts">
	import { CopyButton } from '$lib/components/ui/copy-button';
	import type { PasswordCopyButtonProps } from './types.js';
	import { cn } from '$lib/blocks/utils/utils.js';
	import { usePasswordCopy } from './password.svelte.js';

	let { ref = $bindable(null), class: className, ...rest }: PasswordCopyButtonProps = $props();

	const state = usePasswordCopy();
</script>

<CopyButton
	{...rest}
	bind:ref
	text={state.root.passwordState.value}
	tabindex={-1}
	class={cn(
		'absolute right-0 top-1/2 size-9 min-w-0 -translate-y-1/2 text-muted-foreground hover:!bg-transparent',
		className
	)}
/>
