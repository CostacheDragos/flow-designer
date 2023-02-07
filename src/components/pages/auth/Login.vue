<template>
  <div class="bg-gray-900 w-screen h-screen flex">
    <div class="mx-auto my-auto border border-gray-500 rounded-xl p-5 w-96 bg-gray-800 shadow">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-white normal-case mb-5">
        Sign in to your account
      </h1>
      <form class="space-y-6" action="#">
        <div>
          <label for="email" class="block mb-2 text-left text-sm font-medium text-white normal-case">Your email</label>
          <input type="email" name="email" id="email" class="border rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required="">
        </div>
        <div>
          <label for="password" class="block mb-2 text-left text-sm font-medium text-white normal-case">Password</label>
          <input type="password" name="password" id="password" placeholder="••••••••" class="border rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required="">
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 rounded text-white py-2">Sign in</button>

        <button type="button" class="rounded-lg text-gray-400 p-2 border border-gray-500 hover:bg-gray-600 flex">
          <img src="src/assets/Google__G__Logo.svg" class="mr-2">
          Sign in with Google
        </button>

        <p class="text-sm font-light text-gray-400 normal-case text-left">
          Don’t have an account yet? <a href="#" class="font-medium hover:underline text-blue-500">Sign up</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
</script>
