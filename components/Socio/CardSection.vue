<template>
    <div class="rounded-flow p-3 mb-1 px-5 flex flex-col min-h-[300px]">
        <div class="flex items-center">
            <h1 class="text-center font-bold text-2xl ml-auto mr-auto">{{cardName}}</h1>
            <slot name="button"></slot>
        </div>
        <div class="h-full py-5 flex gap-3">
            <slot name="cards"></slot>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    cardName: {
        type: String,
        required: true
    }
})
</script>