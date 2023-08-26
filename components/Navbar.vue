<template>
  <div class="h-full w-[300px] p-3">
    <section class="w-full h-full bg-white flex flex-col rounded-flow py-3 px-6">
      <!-- logo -->
      <div class="h-[80px] w-full">
        <div class="h-[10px] w-full bg-flow-brown rounded-flow "></div>
        <h3 class="text-center text-xl font-bold">The Flow</h3>
        <h3 class="text-center text-xl font-bold tracking-widest">Academy</h3>
        <div class="h-[10px] w-full bg-flow-brown rounded-flow "></div>
      </div>
      <div class="flex-grow flex flex-col justify-around">
        <NuxtLink to="/dashboard" class="p-2">
          <div class="flex items-center">
            <Icon name="material-symbols:dashboard" color="black" size="2rem" class="mr-3"/>
            <span>DASHBOARD</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/soci" class="p-2">
          <div class="flex items-center">
            <Icon name="raphael:people" color="black" size="2rem" class="mr-3"/>
            <span>SOCI</span>
          </div> 
        </NuxtLink>
        <NuxtLink to="/collaboratori" class="p-2">
          <div class="flex items-center">
            <Icon name="ic:baseline-work" color="black" size="2rem" class="mr-3"/>
            <span>COLLABORATORI</span> 
          </div>
        </NuxtLink>
        <NuxtLink to="/attivita" class="p-2">
          <div class="flex items-center">
            <Icon name="material-symbols:sports-gymnastics-rounded" color="black" size="2rem" class="mr-3"/>
            <span>ATTIVITA</span> 
          </div>
        </NuxtLink>
        <NuxtLink to="/eventi" class="p-2">
          <div class="flex items-center">
            <Icon name="mdi:events" color="black" size="2rem" class="mr-3"/>
            <span>EVENTI</span> 
          </div>
        </NuxtLink>
        <NuxtLink to="/gestionale-sito" class="p-2">
          <div class="flex items-center">
            <Icon name="mdi:web" color="black" size="2rem" class="mr-3"/>
            <span>SITO WEB</span> 
          </div>
        </NuxtLink>
      </div>
      <div class="h-[80px]">

      </div>
    </section>
  </div>
</template>