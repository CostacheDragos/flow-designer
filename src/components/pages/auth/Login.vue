<template>
  <div class="bg-gray-900 w-screen h-screen flex">
    <div class="mx-auto my-auto border border-gray-500 rounded-xl p-5 w-96 bg-gray-800 shadow">
      <div class="flex mb-5 h-14">
        <h1 class="flex flex-grow text-xl font-bold leading-tight tracking-tight text-white normal-case">
          <span class="mx-auto my-auto"> Sign into your account </span>
        </h1>
        <Transition>
          <div v-if="errorBox.display" class="bg-rose-600 rounded-lg w-fit h-fit mx-auto my-auto p-2 text-white">
            <span>{{ errorBox.text }}</span>
          </div>
        </Transition>
      </div>
      <form class="space-y-6" action="#" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="block mb-2 text-left text-sm font-medium text-white normal-case">Your email</label>
          <input type="email" name="email" id="email" v-model="credentials.email.value"
                 :class="credentials.email.displayError ? 'border-rose-600 focus:outline-rose-600 focus:border-rose-600' : 'border-gray-600 focus:outline-blue-500'"
                 class="border rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:outline focus:outline-2"
                 placeholder="name@company.com" required @input="onEmailInput($event)" @invalid="onEmailInput($event)">
        </div>
        <div>
          <label for="password" class="block mb-2 text-left text-sm font-medium text-white normal-case">Password</label>
          <input type="password" name="password" id="password" placeholder="••••••••"  v-model="credentials.password.value"
                 :class="credentials.password.displayError ? 'border-rose-600 focus:outline-rose-600 focus:border-rose-600' : 'border-gray-600 focus:outline-blue-500'"
                 class="border rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:outline focus:outline-2"
                 required minlength="6" @input="onPasswordInput($event)" @invalid="onPasswordInput($event)">
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 rounded text-white py-2">Sign in</button>

        <button type="button" class="rounded-lg text-gray-400 p-2 border border-gray-500 hover:bg-gray-600 flex" @click="loginWithGoogle">
          <img src="src/assets/Google__G__Logo.svg" class="mr-2">
          Sign in with Google
        </button>

        <p class="text-sm font-light text-gray-400 normal-case text-left">
          Don’t have an account yet?
          <router-link to="/register" class="font-medium hover:underline text-blue-500">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/user.js";
import {reactive} from "vue";

const {loginWithEmailAndPassword, loginWithGoogle} = useUserStore();

const credentials = reactive({
  email: {
    value: "",
    displayError: false,
  },
  password: {
    value: "",
    displayError: false,
  },
});
const errorBox = reactive({
  text: "Invalid credentials",
  display: false,
})

async function onSubmit() {
  const result = await loginWithEmailAndPassword(credentials.email.value, credentials.password.value);

  if(result === "Invalid credentials") {
    errorBox.display = true;
    setTimeout(() => errorBox.display = false, 2000);
  }
}

// When the input changes, we check the contents in order
// to provide visual feedback
function onEmailInput(event) {
  credentials.email.displayError = !event.target.validity.valid;
}
function onPasswordInput(event) {
  credentials.password.displayError = !event.target.validity.valid;
}

</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>