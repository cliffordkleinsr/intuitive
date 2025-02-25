<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getInitials } from '../functions/helpers';
	import { enhance } from '$app/forms';
	// forms
	import * as Form from '$lib/components/ui/form';

	interface dropdownItems {
		label: string;
		href?: string;
	}
	let {
		name,
		action,
		items,
		profile
	}: {
		name: string;
		action: string;
		items: dropdownItems[];
		profile?: string;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			<Avatar.Image src={profile} alt="@shadcn" />
			<Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
		</Avatar.Root>
		<span class="sr-only">Toggle user menu</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each items as { label, href }}
				<DropdownMenu.Item>
					<a {href}>{label}</a>
				</DropdownMenu.Item>
			{/each}
			<DropdownMenu.Separator />
			<form {action} method="post" use:enhance>
				<DropdownMenu.Item class="w-full justify-start">
					{#snippet child({ props })}
						<Form.Button variant="ghost" size="sm" {...props}>Sign out</Form.Button>
					{/snippet}
				</DropdownMenu.Item>
			</form>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
