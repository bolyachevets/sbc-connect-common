<template>
  <div class="app-container" data-testid="connect-default-layout">
    <ConnectHeader />
    <ConnectSystemBanner />
    <ConnectBreadcrumb />
    <main class="app-inner-container app-body">
      <slot />
    </main>
    <ConnectFooter />
  </div>
</template>
