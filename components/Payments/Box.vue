<template>
    <!-- BOX -->
    <div class="h-full w-[250px] rounded-lg overflow-hidden bg-white min-h-[250px] flex flex-col pb-3">
        <div class="w-full bg-green p-3">
            <h3 class="font-bold text-base text-center text-white">RICEVUTO</h3>
        </div>
        <div class="h-full bg-green-opacized
        ">

        </div>
        <div class="rounded-lg bg-green p-2 mx-3">
            <h3 class="font-bold text-xl text-center text-white">70</h3>
        </div>
    </div>
</template>
<script setup>
    /* PROPS */
    const props = defineProps(['paymentInfo'])
</script>
