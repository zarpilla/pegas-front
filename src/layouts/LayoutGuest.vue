<script setup lang="ts">
import { ref } from "vue";
</script>

<template>
  <div class="layout-wrapper">
    <header class="pb-4">
      <div class="container">
        <!-- <div class="logo-outter mt-3">
          <div class="d-flex align-items-center">
            <div class="col-6 col-md-2">
              <RouterLink to="/" class="logo">
                <img src="@/assets/logo-color.svg" alt="" />
              </RouterLink>
            </div>

            <div class="col-6 col-md-10 ms-auto">
              <div class="auth-wrapper mt-2 d-flex ms-auto">
                <div class="d-flex flex-wrap ms-auto d-none d-md-flex">
                  <RouterLink
                    to="/login"
                    class="btn btn-tertiary me-5 mb-4 mb-md-0"
                  >
                    Accedeix
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div class="d-flex flex-wrap ms-auto d-flex d-md-none">
          <RouterLink to="/login" class="btn btn-tertiary me-5 mb-4 mb-md-0">
            Accedeix
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="slot-inner">
      <slot />
    </div>
  </div>
</template>
<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.flex-grow-1 {
  flex: 1 1 auto;
}
.slot {
  display: flex;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.zplace-items-center .slot {
  place-items: center;
}

.slot-inner {
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  width: 100%;
}

.logo-outter {
  color: #000000;
  font-size: 18px;
  font-family: Inter;
  font-weight: 700;
  line-height: 24px;
}

.logo-outter img {
  height: 80px;
}

@media (min-width: 1024px) and (max-height: 700px) {
  .slot {
    height: auto;
  }
}

.router-link-exact-active svg path,
.router-link-exact-active:hover svg path,
.router-link-exact-active:focus svg path {
  fill: #fff;
}

.the-content {
  background-color: #d4edda;
  border-radius: 19px;
  padding: 50px 0px;
  margin-bottom: 100px;
}

@media screen {
  .the-content {
    margin: 0 10px;
    margin-bottom: 100px;
  }
}
</style>
