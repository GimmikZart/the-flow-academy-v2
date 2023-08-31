<template>
  <div class="card w-full">
    <!-- <Toast /> -->
    <FileUpload name="demo[]" url="../assets/img" @upload="onUploadClick($event)" accept="image/*" :maxFileSize="100000000000000" @select="onSelectedFiles" chooseLabel="Immagine">
        <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
            <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                <div class="flex gap-2">
                    <Button @click="chooseCallback()" rounded outlined class="p-2">
                        <Icon name="ion:image" size="1rem"></Icon>
                    </Button>
                    <Button @click="uploadEvent(uploadCallback)" rounded outlined severity="success" :disabled="!files || files.length === 0" class="p-2">
                        <Icon name="ep:upload-filled" size="1rem"></Icon>
                    </Button>
                    <Button @click="clearCallback()" rounded outlined severity="danger" :disabled="!files || files.length === 0" class="p-2">
                        <Icon name="material-symbols:delete-outline" size="1rem"></Icon>
                    </Button>
                </div>
                <ProgressBar :value="totalSizePercent" :showValue="false">
                    <span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span>
                </ProgressBar>
            </div>
        </template>
        <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
            <div v-if="files.length > 0" class="p-4">
                <h5>Pending</h5>
                <div class="flex flex-wrap p-0 sm:p-3 gap-5">
                    <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                        <div>
                            <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                        </div>
                        <span class="font-semibold">{{ file.name }}</span>
                        <div>{{ formatSize(file.size) }}</div>
                        <Badge value="Pending" severity="warning" />
                        <Button @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded class="p-3"  severity="danger">
                            <Icon name="iwwa:delete" size="1rem"></Icon>
                        </Button>
                    </div>
                </div>
            </div>

            <div v-if="uploadedFiles.length > 0">
                <h5>Completed</h5>
                <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                    <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                        <div>
                            <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                        </div>
                        <span class="font-semibold">{{ file.name }}</span>
                        <div>{{ formatSize(file.size) }}</div>
                        <Badge value="Completed" class="mt-3" severity="success" />
                        <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                    </div>
                </div>
            </div>
        </template>
        <template #empty>
            <div class="flex p-2 items-center justify-center flex-col">
                <Icon name="ep:upload-filled" size="3rem" color="lightgray"/>
                <p class="mt-4 mb-0">Trascina i file qui</p>
            </div>
        </template>
    </FileUpload>
  </div>
</template>

<script lang="ts" setup>
/* import { useToast } from "primevue/usetoast"; */
/* const toast = useToast(); */

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
    totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = (callback) => {
    totalSizePercent.value = totalSize.value / 10;
    callback();
};


const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>