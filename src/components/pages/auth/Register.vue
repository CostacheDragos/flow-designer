<template>
  <div class="bg-gray-900 w-screen h-screen flex">
    <div class="mx-auto my-auto border border-gray-500 rounded-xl p-5 w-96 bg-gray-800 shadow">
      <h1 class="text-xl font-bold leading-tight tracking-tight text-white normal-case mb-5">
        Sign up
      </h1>
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
          <input type="password" name="password" id="password" placeholder="••••••••" v-model="credentials.password.value"
                 :class="credentials.password.displayError ? 'border-rose-600 focus:outline-rose-600 focus:border-rose-600' : 'border-gray-600 focus:outline-blue-500'"
                 class="border rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:outline focus:outline-2"
                 required minlength="6" @input="onPasswordInput($event)" @invalid="onPasswordInput($event)">
        </div>
        <div>
          <label for="confirm-password" class="block mb-2 text-left text-sm font-medium text-white normal-case">Confirm Password</label>
          <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" v-model="credentials.confirmPassword.value"
                 :class="credentials.confirmPassword.displayError ? 'border-rose-600 focus:outline-rose-600 focus:border-rose-600' : 'border-gray-600 focus:outline-blue-500'"
                 class="border rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:outline focus:outline-2"
                 required @input="onConfirmPasswordInput($event)" @invalid="onConfirmPasswordInput($event)">
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 rounded text-white py-2">Sign up</button>

        <button type="button" class="rounded-lg text-gray-400 p-2 border border-gray-500 hover:bg-gray-600 flex" @click="loginWithGoogle">
          <img src="src/assets/Google__G__Logo.svg" class="mr-2">
          Sign in with Google
        </button>

        <p class="text-sm font-light text-gray-400 normal-case text-left">
          Already have an account?
          <router-link to="/login" class="font-medium hover:underline text-blue-500">Sign in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/user.js";
import {reactive} from "vue";

const { registerWithEmailAndPassword, loginWithGoogle } = useUserStore();

const credentials = reactive({
  email: {
    value: "",
    displayError: false,
  },
  password: {
    value: "",
    displayError: false,
  },
  confirmPassword: {
    value: "",
    displayError: false,
  },
});

function onSubmit() {
  registerWithEmailAndPassword(credentials.email, credentials.password);
}

// When the input changes, we check the contents in order
// to provide visual feedback
function onEmailInput(event) {
  credentials.email.displayError = !event.target.validity.valid;
}
function onPasswordInput(event) {
  credentials.password.displayError = !event.target.validity.valid;
}
function onConfirmPasswordInput(event) {
  credentials.confirmPassword.displayError = credentials.password.value !== credentials.confirmPassword.value;

  //The password confirmation input is invalid only if empty or not matching the password
  if(credentials.confirmPassword.value === "")
    event.target.setCustomValidity("");
  else
    event.target.setCustomValidity("Must match the password.");
}
</script>