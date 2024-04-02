<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { onMounted, ref } from 'vue'

var showWxBtn = ref(false)
const isEnvWeixin = navigator.userAgent
  .toLowerCase()
  .includes('micromessenger')

onMounted(() => {
  showWxBtn.value = true
  showWxBtn.value = isEnvWeixin
})

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>
  <wx-open-launch-app v-if="showWxBtn" id="launch-btn" appid="wxe2f29d15a85badb7" extinfo="">
    <button class="btn">App内查看</button>
  </wx-open-launch-app>
  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.btn {
  padding: 12px
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
