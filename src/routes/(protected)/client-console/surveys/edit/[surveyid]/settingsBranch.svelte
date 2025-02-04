<script lang="ts">
	import { enumBuilder, type OptionalSchema } from '$lib/custom/blocks/reader/super_schema';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data, options }: { data: SuperValidated<Infer<OptionalSchema>>; options: string[] } =
		$props();
	const optionalSchema = enumBuilder(options);
	const form = superForm(data, {
		validators: zodClient(optionalSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.success(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<!-- <form method="POST" action="?/radioGroup" class="grid gap-2" use:enhance>
    {#each qs.options as option, optionIndex}
        <div class="flex max-w-sm gap-1">
            <p>If answer at Q{index + 1}</p>
            <span> = </span>
            <p>{option}</p>
        </div>
        <div class="flex max-w-sm gap-1">
            <p>Then go to</p>
            <Select.Root type="single" bind:value={optionValues[index][optionIndex]}>
                <Select.Trigger>
                    {triggerContent(index, optionIndex)}
                </Select.Trigger>
                <Select.Content>
                    {#each surveyqns as qns}
                        {#if new Date(qns.created_at) > new Date(qs.created_at)}
                            <Select.Item value={qns.question}>{qns.question}</Select.Item>
                        {/if}
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
    {/each}
</form> -->
