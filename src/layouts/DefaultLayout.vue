<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="layout">
    <Header></Header>
    <div class="content">
      <RouterView></RouterView>
    </div>
    <Footer></Footer>
  </div>
</template>


<style scoped>
.content {
  margin-left: 170px;

}

@media screen and (max-width: 768px) {
  .content {
    margin-left: 20px;
  }
}
</style>