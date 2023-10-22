<template>
    <!-- BOX -->
    <div class="h-full w-[250px] rounded-lg overflow-hidden bg-white flex flex-col">
        <div class="w-full h-full bg-gray">
        <!-- immagine -->
        </div>
        <h3 class="p-3 font-bold text-base w-full min-h-[25%]">{{activityInfo.instances.name}}</h3>
    </div>
</template>
<script setup>
    /* PROPS */
    const props = defineProps(['activityInfo'])
</script>
