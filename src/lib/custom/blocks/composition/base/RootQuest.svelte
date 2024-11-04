<script lang="ts">
    // shadcn
    import { Button } from "$lib/components/ui/button"
    import { Label } from "$lib/components/ui/label"
    import { Input } from "$lib/components/ui/input"
    
    import Portal from "./Portal.svelte";
    // lucide
    import Webcam from 'lucide-svelte/icons/webcam';
	import { enhance } from "$app/forms";
	import { goto, invalidateAll } from "$app/navigation";
	import { toast } from "svelte-sonner";
	import type { Actions } from "@sveltejs/kit";

    let { form } : { form?: any | Actions  | undefined} = $props()

    let singleprops = {
        title: 'Open ended Question',
        description: 'Enter Question (This question will have a single input option)',
    }
    
    let singledialog = $state(false);
	let multidialog = $state(false);
	let optidialog = $state(false);
	let stardialog = $state(false);
	let likertdialog = $state(false);
	let rankdialog = $state(false);
	let sing_loading = $state(false);
	let multi_loading = $state(false);
	let opti_loading = $state(false);
	let starloading = $state(false);
	let likertloading = $state(false);
	let rank_loading = $state(false);
</script>

<!-- Single Question -->
<Portal {...singleprops}>
    {#snippet trigger()}
        <Webcam />
        Add an open ended question
    {/snippet}
        <form
        action="?/addSingleQns"
        method="post"
        class="grid items-start gap-4"
        use:enhance={() => {
            sing_loading = true;
            return async ({ result, update }) => {
                if (result.type === 'redirect') {
                    singledialog = false;
                    await invalidateAll();
                    goto(result.location);
                    sing_loading = false;
                    toast.success('Created Successfully');
                } else {
                    sing_loading = false;
                    await update();
                }
            };
        }}
    >
        <div class="grid gap-2">
            <Label for="question">Question</Label>
            <Input type="text" name="single_question" />
        </div>
        {#if form?.errors?.single_question}
            <p class=" text-sm text-destructive">{form?.errors?.single_question}</p>
        {/if}
        <Button type="submit" class="max-w-sm" disabled={sing_loading}>
            {#if sing_loading}
                <div class="flex gap-2">
                    <span
                        class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                        role="status"
                        aria-label="loading"
                    ></span>
                    Loading...
                </div>
            {:else}
                Save changes
            {/if}
        </Button>
    </form>
</Portal>