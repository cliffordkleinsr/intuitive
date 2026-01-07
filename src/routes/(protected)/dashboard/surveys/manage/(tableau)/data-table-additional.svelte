<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	// lucide
	import Trash2 from 'lucide-svelte/icons/trash-2';

	let { id, status }: { id: string; status: string } = $props();
</script>

<AlertDialog.Root>
	<!-- <AlertDialog.Trigger
		class={[buttonVariants({ variant: 'destructive', size: 'icon' })]}
		disabled={status === 'Closed'}
	> -->
	<AlertDialog.Trigger class={[buttonVariants({ variant: 'destructive', size: 'icon' })]} disabled>
		<Trash2 class="size-4" />
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this survey and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form action="?/deleteSurvey" method="post">
				<Input type="text" value={id} class="hidden" name="id" />
				<Button type="submit" disabled={status === 'Closed'}>Delete Survey</Button>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
