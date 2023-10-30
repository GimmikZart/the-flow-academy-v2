<template>
    <div class="w-100 h-full flex flex-col justify-between py-3">
        <!-- BOX -->
        <div class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full h-full">
            <h3 class="font-bold text-sm">Status</h3>
            <ClientsStatusLabel :clientStatus="client.status"></ClientsStatusLabel>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Sesso</h3>
            <Icon v-if="client.gender == true" name="icon-park-solid:boy-one" size="30" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red" size="30"></Icon>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Email</h3>
            <span v-if="client.email && client.email != ''">{{ client.email }}</span>
            <span v-else> --- </span>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Telefono</h3>
            <span v-if="client.telephone && client.telephone != ''">{{ client.telephone }}</span>
            <span v-else> --- </span>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Data di nascita</h3>
            <span v-if="client.dateOfBirth && client.dateOfBirth != ''">{{ client.dateOfBirth }}</span>
            <span v-else> --- </span>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Indirizzo</h3>
            <span v-if="client.address && client.address != ''">{{ client.address }}</span>
            <span v-else> --- </span>
        </div>
        <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Primo contatto</h3>
            <span v-if="client.firstContact && client.firstContact != ''">{{ client.firstContact }}</span>
            <span v-else> --- </span>
        </div>
        <div  class="bg-white w-full py-2 px-4 rounded-lg my-1 h-full">
            <h3 class="font-bold text-sm">Misure</h3>
            <div class="flex justify-between items-center gap-2">
                <!-- CAPPELLO -->
                <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                    <Icon name="mingcute:hat-2-line"  size="30" class="mr-2"></Icon>
                    <span v-if="client.sizes.head && client.sizes.head != ''">{{ client.sizes.head }}</span>
                    <span v-else> --- </span>
                </div>
                <!-- T-SHIRT -->
                <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                    <Icon name="ion:shirt-outline"  size="30" class="mr-2"></Icon>
                    <span v-if="client.sizes.shirt && client.sizes.shirt != ''">{{ client.sizes.shirt }}</span>
                    <span v-else> --- </span>
                </div>
                <!-- PANTALONI -->
                <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                    <Icon name="ph:pants-thin"  size="30" class="mr-2"></Icon>
                    <span v-if="client.sizes.pants && client.sizes.pants != ''">{{ client.sizes.pants }}</span>
                    <span v-else> --- </span>
                </div>
                <!-- SCARPE -->
                <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                    <Icon name="mingcute:shoe-line"  size="30" class="mr-2"></Icon>
                    <span v-if="client.sizes.shoes && client.sizes.shoes != ''">{{ client.sizes.shoes }}</span>
                    <span v-else> --- </span>
                </div>
            </div>
        </div>
        <div  class="bg-white w-full py-2 px-4 rounded-lg my-1 h-full">
        <h3 class="font-bold text-sm">Note</h3>
        <Textarea class="w-full" :value="client.notes"></Textarea>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    client: {
        type: Object,
        required: true
    }
})
</script>