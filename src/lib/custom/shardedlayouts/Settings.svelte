<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getInitials } from '../functions/helpers';
	import { enhance } from '$app/forms';
	// forms
	import * as Form from '$lib/components/ui/form';
	let { name, action } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			<Avatar.Image src="" alt="@shadcn" />
			<Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
		</Avatar.Root>
		<span class="sr-only">Toggle user menu</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Profile</DropdownMenu.Item>
			<DropdownMenu.Item>Billing</DropdownMenu.Item>
			<DropdownMenu.Item>Team</DropdownMenu.Item>
			<DropdownMenu.Item>Subscription</DropdownMenu.Item>
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
