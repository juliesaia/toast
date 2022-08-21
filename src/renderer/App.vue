<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { watch } from 'vue';

import { ipcRenderer } from './electron'


// hmm maybe these keys shouldve been ararys instead oops
// there we go thats better

var timer = $ref(5)

function timer_func(action){
  ipcRenderer.send('timer', {'timer': timer, "action": action});
}

var data = $ref({
  "player": [
    {
      "sponsor": "SNT",
      "tag": "CheesyPotato",
      "score": [true, false, false]
    },
    {
      "sponsor": "AZ",
      "tag": "Plastic Dinos",
      "score": [true, false, false]
    }
  ],
  "comm": [
    {
      "sponsor": "Daniel Fornaniel",
      "tag": "GPik",
      "twitter": "GPik"
    },
    {
      "sponsor": "Daniel Fornaniel",
      "tag": "Brosa",
      "twitter": "Brosa"
    }
  ],
  "upnext": [
    {
      "sponsor": "PINK",
      "tag": "Darai",
    },
    {
      "sponsor": "AZ",
      "tag": "SBS",
    }
  ],
  "round": "Winner's Finals"
})

var saved_data = JSON.stringify(data)

var dirty = $ref(false)

var mode = $ref(0)

var title = $computed(() => {
  switch (mode) {
    case 0:
      return "Player"
    case 1:
      return "Commentator"
    case 2:
      return "Up Next"
    default:
      return "broke"
  }
})

var key = $computed(() => {
  switch (mode) {
    case 0:
      return "player"
    case 1:
      return "comm"
    case 2:
      return "upnext"
    default:
      return "broke"
  }
})

watch($$(data), (newData) => {

  let output = JSON.stringify(newData)
  // ipcRenderer.send('data', output);
  // console.log(output);
  if (output != saved_data){
    dirty = true;
  }
  else{
    dirty = false;
  }


},
  { deep: true })

function swap() {
  if (mode == 0) {
    [data.player[0], data.player[1]] = [data.player[1], data.player[0]]
  }
  else if (mode == 1) {
    [data.comm[0], data.comm[1]] = [data.comm[1], data.comm[0]]
  }
  else {
    [data.upnext[0], data.upnext[1]] = [data.upnext[1], data.upnext[0]]
  }
}

function submit(){
  saved_data = JSON.stringify(data)
  ipcRenderer.send('data', saved_data);
  dirty = false;
}

document.addEventListener("keyup", function(event) {
    // @ts-ignore
    if (event.code === 'Enter' && event.target.nodeName == "INPUT") {
        submit()
    }
});


function checkbox_fix(i, j){
  
  if (j == 0){
    if (data["player"][i]["score"][j] == true){
      data["player"][i]["score"][1] = false;
      data["player"][i]["score"][2] = false;
    }
  }
  if (j == 1){
    if (data["player"][i]["score"][j] == true){
      data["player"][i]["score"][2] = false;
    }
    if (data["player"][i]["score"][j] == false){
      data["player"][i]["score"][0] = true;
    }
  }
  if (j == 2){
    if (data["player"][i]["score"][j] == false){
      data["player"][i]["score"][0] = true;
      data["player"][i]["score"][1] = true;
    }
  }
}

// ipcRenderer.on('requestData', () => {
//     let output = JSON.stringify(data)
//     ipcRenderer.send('data', output);
//     console.log(output);
// })

</script>

<template>

  <div class="flex flex-col h-100vh">

    <div class="grid grid-cols-3">
      <div class="flex">
        <button v-if="dirty" @click="submit"
          class="mx-auto my-auto py-1.5 block px-4  w-32 bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
        Update</button>
      </div>
      <span class="my-8 text-center font-bold text-size-2em text-sunnyshore-pink-dark"> SunnyShore Stream App </span>
    </div>
    <div class="flex-grow bg-sunnyshore-beach-primary rounded-xl mx-4 grid grid-cols-3 gap-4 p-6 shadow-xl">
      <div class="p-4 bg-sunnyshore-beach-secondary  rounded-xl shadow-md">
        <p class="text-center font-bold">{{ title }} 1</p>
        <div class="mb-6 mt-4">
          <label for="player1sponsor" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Sponsor </label>
          <input v-model="data[key][0]['sponsor']" type="text" name="player1sponsor" id="player1sponsor"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Sponsor...">
        </div>
        <div class="mb-6">
          <label for="player1tag" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Tag </label>
          <input v-model="data[key][0]['tag']" type="text" name="player1tag" id="player1tag"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Tag...">
        </div>
        <div class="mb-6">
          <div v-if="key == 'player'">
            <label for="player1score" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Score </label>
            <input @click="checkbox_fix(0,0)" v-model="data.player[0].score[0]" type="checkbox" name="player1score" id="player1score"
              class="w-5 h-5 mx-4"
              placeholder="Score...">
            <input @click="checkbox_fix(0,1)" v-model="data.player[0].score[1]" type="checkbox" name="player1score" id="player1score"
              class="mx-4 w-5 h-5"
              placeholder="Score...">
            <input @click="checkbox_fix(0,2)" v-model="data.player[0].score[2]" type="checkbox" name="player1score" id="player1score"
              class="mx-4 w-5 h-5"
              placeholder="Score...">
          </div>
        </div>
        <div v-if="key == 'comm'" class="mb-6">
          <label for="player1tag" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Twitter </label>
          <input v-model="data[key][0]['twitter']" type="text" name="player1tag" id="player1tag"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Twitter...">
        </div>
      </div>

      <div class="p-4 bg-sunnyshore-beach-secondary  rounded-xl shadow-md">
        <p class="text-center font-bold">Miscellaneous</p>
        <div class="mb-6 mt-4">
          <label for="round" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Round </label>
          <input v-model="data.round" type="text" name="round" id="round"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Round...">
        </div>
        <div class="mb-6 mt-8">

          <button @click="swap"
            class="py-1.5 block px-4  w-full bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Swap</button>

        </div>

        <div class="mb-2 mt-10">

          <button @click="mode = 0"
            :class="mode == 0 ? 'hover:bg-gray-400 bg-gray-400 cursor-default border-gray-400' : ''"
            class="py-1.5 block px-4  w-full bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Players</button>

        </div>

        <div class="my-2">

          <button @click="mode = 1"
            :class="mode == 1 ? 'hover:bg-gray-400 bg-gray-400 cursor-default border-gray-400' : ''"
            class="py-1.5 block px-4  w-full bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Commentators</button>

        </div>

        <div class="my-2">

          <button @click="mode = 2"
            :class="mode == 2 ? 'hover:bg-gray-400 bg-gray-400 cursor-default border-gray-400' : ''"
            class="py-1.5 block px-4  w-full bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Up Next</button>

        </div>
        
        
          <label for="player1sponsor" class=" text-sm text-gray-700 block mb-1 font-medium"> Timer (minutes) </label>
          <div class="flex flex-row justify-between h-12">
          <input v-model="timer" type="number" name="player1sponsor" id="player1sponsor"
            class="inline m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-15 block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Minutes...">
          <button @click="timer_func('play')"
            
            class="inline  block mx-2   w-10 bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >
              <path d="M16 37.85V9.85L38 23.85ZM19 23.85ZM19 32.4 32.45 23.85 19 15.3Z"/>

              </svg>
            
            </button>
          
          <button @click="timer_func('pause')"

            class="inline block px-2 mx-2   w-10 bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" ><path d="M28.25 38V10H36V38ZM12 38V10H19.75V38Z"/></svg>
            
            </button>

            <button @click="timer_func('replay')"
            
            class="inline  block  mx-2   w-10 bg-gray-50 border active:bg-gray-400 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" ><path d="M24 44Q20.25 44 16.975 42.6Q13.7 41.2 11.25 38.75Q8.8 36.3 7.4 33.025Q6 29.75 6 26H9Q9 32.25 13.375 36.625Q17.75 41 24 41Q30.25 41 34.625 36.625Q39 32.25 39 26Q39 19.75 34.75 15.375Q30.5 11 24.25 11H23.1L26.75 14.65L24.7 16.75L17.35 9.4L24.7 2.05L26.75 4.1L22.85 8H24Q27.75 8 31.025 9.4Q34.3 10.8 36.75 13.25Q39.2 15.7 40.6 18.975Q42 22.25 42 26Q42 29.75 40.6 33.025Q39.2 36.3 36.75 38.75Q34.3 41.2 31.025 42.6Q27.75 44 24 44Z"/></svg>
            
            </button>

            <!-- <img/> -->
          </div>

          <!-- <button id="search-button" class="w-8 bg-red-500">
    <svg id="search-icon" class="search-icon" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
 </button> -->
          
      </div>

      <div class="p-4 bg-sunnyshore-beach-secondary  rounded-xl shadow-md">
        <p class="text-center font-bold">{{ title }} 2</p>
        <div class="mb-6 mt-4">
          <label for="player2sponsor" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Sponsor </label>
          <input v-model="data[key][1]['sponsor']" type="text" name="player2sponsor" id="player2sponsor"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Sponsor...">
        </div>
        <div class="mb-6">
          <label for="player2tag" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Tag </label>
          <input v-model="data[key][1]['tag']" type="text" name="player2tag" id="player2tag"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Tag...">
        </div>
        <div class="mb-6">
          <!-- <div v-if="key == 'player'">
            <label for="player2score" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Score </label>
            <input v-model="data.player[1].score" type="number" name="player2score" id="player1score"
              class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
              placeholder="Score...">
          </div> -->
          <div v-if="key == 'player'">
            <label for="player1score" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Score </label>
            <input @click="checkbox_fix(1,0)" v-model="data.player[1].score[0]" type="checkbox" name="player1score" id="player1score"
              class="w-5 h-5 mx-4"
              placeholder="Score...">
            <input @click="checkbox_fix(1,1)" v-model="data.player[1].score[1]" type="checkbox" name="player1score" id="player1score"
              class="mx-4 w-5 h-5"
              placeholder="Score...">
            <input @click="checkbox_fix(1,2)" v-model="data.player[1].score[2]" type="checkbox" name="player1score" id="player1score"
              class="mx-4 w-5 h-5"
              placeholder="Score...">
          </div>
          <div v-if="key == 'comm'" class="mb-6">
          <label for="player1tag" class="ml-3 text-sm text-gray-700 block mb-1 font-medium"> Twitter </label>
          <input v-model="data[key][1]['twitter']" type="text" name="player1tag" id="player1tag"
            class="m-0 bg-gray-100 border border-gray-200 rounded py-1 px-3 w-full block focus:ring-2 focus:outline-none focus:ring-sunnyshore-pink-light focus:border-sunnyshore-pink-light text-gray-700"
            placeholder="Twitter...">
        </div>
        </div>
      </div>
    </div>
    <div class="h-4"></div>

  </div>
</template>

<style>
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #ff4c4c; */
  /* background-color: #6eb6d8; */
  /* background-image: url("assets/sunnyshore_promo_bg.png"); */
  /* background-size: cover; */
  background-color: #8ccfec;
  user-select: none;
}

</style>
