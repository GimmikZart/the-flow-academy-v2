<template>
    <div class="rounded-flow p-3 mb-1 px-5 flex flex-col min-h-[300px]">
        <div class="flex items-center">
            <h1 class="text-center font-bold text-2xl ml-auto">{{cardName}}</h1>
            <Button text class="ml-auto">
                <template #icon>
                    <Icon name="zondicons:add-outline" color="green" size="30" @click="emits('add')"></Icon>
                </template>
            </Button>
        </div>
        <div class="h-full py-5 flex gap-3">
            <slot name="cards"></slot>
        </div>
    </div>
</template>
<script setup>

const emits = defineEmits(["add"])
const props = defineProps({
    cardName: {
        type: String,
        required: true
    }
})
</script>