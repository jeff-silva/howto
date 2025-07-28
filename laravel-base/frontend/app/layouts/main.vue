<template>
  <div class="d-flex">
    <div
      class="d-none d-md-block h-screen bg-surface"
      style="min-width: 300px; max-width: 300px"
    >
      <v-nav
        :items="[
          { title: 'Home', to: '/' },
          {
            title: 'Auth',
            children: [
              { title: 'Login', to: '/auth' },
              { title: 'Register', to: '/auth/register' },
              { title: 'Password', to: '/auth/password' },
            ],
          },
          {
            title: 'Admin',
            children: [
              { title: 'Usuários', to: '/admin/app_user' },
              { title: 'Resume Profile', to: '/admin/resume_profile' },
            ],
          },
        ]"
      />
    </div>
    <div class="flex-grow-1 overflow-auto pa-3 h-screen">
      <slot></slot>
    </div>
  </div>
</template>
