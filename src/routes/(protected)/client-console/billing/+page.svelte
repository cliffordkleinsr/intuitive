<script lang="ts">
    import type { PageData } from './$types';
    import * as Card from "$lib/components/ui/card"
    import * as InputOTP from "$lib/components/ui/input-otp"
    
    let { data }: { data: PageData } = $props();
    let value =$state("123456")
</script>

<div class="grid gap-2 m-5">
    <Card.Root class="max-w-md mx-auto w-full">
      <Card.Header>
        <Card.Title>M-Pesa Paybill Payment</Card.Title>
        <Card.Description>Enter the following Paybill Number</Card.Description>
      </Card.Header>
      <Card.Content>
        <InputOTP.Root maxlength={6} bind:value disabled>
            {#snippet children({ cells })}
              <InputOTP.Group>
                {#each cells.slice(0,3) as cell}
                  <InputOTP.Slot {cell} />
                {/each}
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                {#each cells.slice(3, 6) as cell}
                  <InputOTP.Slot {cell} class="disabled"/>
                {/each}
              </InputOTP.Group>
            {/snippet}
          </InputOTP.Root>
      </Card.Content>
      <Card.Footer>
        <p>Card Footer</p>
      </Card.Footer>
    </Card.Root>
</div>