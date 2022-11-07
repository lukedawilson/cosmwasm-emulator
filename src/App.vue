<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#">CosmWasm Emulator</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active text-white" aria-current="page" href="#">Home</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container">
    <RouterView />
  </div>
</template>
