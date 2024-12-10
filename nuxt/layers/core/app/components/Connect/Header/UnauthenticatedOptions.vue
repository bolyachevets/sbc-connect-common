<template>
  <div
    id="connect-header-unauth-options"
    class="flex gap-1"
  >
    <!-- TODO: implement whats new -->
    <!-- whats new slideover -->
    <ConnectHeaderWhatsNew class="hidden lg:flex" />
    <!-- login options dropdown or main menu on small screens -->
    <ConnectHeaderLoginOptionsDropdown />
    <!-- create account button, hidden on small screens -->
    <ConnectHeaderCreateAccountBtn class="hidden lg:flex" />
  </div>
</template>
