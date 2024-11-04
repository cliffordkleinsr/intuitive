<script lang="ts">
    import Portal from "./Portal.svelte";
    // lucide
    import Webcam from 'lucide-svelte/icons/webcam';

    let singleprops = {
        triggerText:'Add an open ended question',
        triggerIcon: Webcam,
        title: 'Open ended Question',
        description: 'Enter Question (This question will have a single input option)',
    }
</script>

<!-- Single Question -->
<Portal {...singleprops}>
    
</Portal>