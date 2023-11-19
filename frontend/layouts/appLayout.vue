
<template>
  <section class="w-screen h-screen px-2 py-6 flex bg-light-gray">
    <!-- NAVBAR -->
    <Navbar></Navbar>
    <!-- MAIN -->
    <div class="h-full flex flex-col flex-grow p-3">
      <!-- CONTENT -->
      <slot />

      <!-- PILL -->
      <ThePill></ThePill>

    </div>
    
  </section>
</template>

<script setup>
</script>