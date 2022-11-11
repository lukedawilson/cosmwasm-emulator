<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand text-white">CosmWasm Emulator</router-link>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/"  class="nav-link active text-white" aria-current="page">Home</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <RouterView />
  </div>
</template>
