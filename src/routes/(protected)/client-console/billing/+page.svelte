<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { Input } from '$lib/components/ui/input';
	import Pricer from '$lib/custom/blocks/monet/pricer.svelte';

	let { data }: { data: PageData } = $props();
	const { AuthedUser, otp } = data;
	let value = $state('4826298');
    const pricerprops = {
        onetime:otp,
        Message: 'Select Plan'
    }
</script>

<div class="m-5 flex justify-center">
	<Pricer {...pricerprops}/>
	<!-- <Card.Root class="max-w-sm w-full space-y-2">
    <Card.Header>
      <Card.Title>M-Pesa Paybill Payment</Card.Title>
      <Card.Description>Enter the following Paybill Number</Card.Description>
    </Card.Header>
    <Card.Content>
      <InputOTP.Root
        maxlength={6}
        bind:value
        disabled
        textalign='center'
        class='font-extrabold'
      >
        {#snippet children({ cells })}
          <InputOTP.Group>
            {#each cells.slice(0,3) as cell}
              <InputOTP.Slot {cell} />
            {/each}
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            {#each cells.slice(3, 6) as cell}
              <InputOTP.Slot {cell} class="disabled" />
            {/each}
          </InputOTP.Group>
        {/snippet}
      </InputOTP.Root>
    </Card.Content>
    <Card.Footer class="grid gap-1 max-w-sm">
      <p class='text-sm text-muted-foreground'>Enter account number</p>
      <Input class="font-extrabold" value={AuthedUser.split(' ')[0]} disabled/>
    </Card.Footer>
    <Card.Footer class="grid gap-1 max-w-sm">
      <p class='text-sm text-muted-foreground'>Enter amount</p>
      <Input class="font-extrabold" type='number' value=100 disabled/>
    </Card.Footer>
  </Card.Root> -->
</div>
