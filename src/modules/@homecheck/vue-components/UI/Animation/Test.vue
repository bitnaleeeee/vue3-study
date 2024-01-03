<template>
    <div class="base">
    <div class="hole"></div>
    <div class="plate"></div>
    <div class="plate"></div>
    <div class="plate"></div>
    <div class="plate"></div>
    <div class="plate"></div>
</div>
</template>
<style scoped>
* {
  border: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.base {
  display: flex;
  scale: 0.5;
}

body {
  background: #d9d9d9;
  font-size: calc(16px + (20 - 16) * (100vw - 320px)/(1024 - 320));
  height: 100vh;
  overflow-x: hidden;
}

.base:before, .base:after, .hole:before, .hole:after, .plate, .plate:before, .plate:after {
  position: absolute;
}

.base, .hole, .plate {
  margin: auto;
}
.base, .base:before, .base:after, .hole, .hole:before, .hole:after, .plate, .plate:before, .plate:after {
  border-radius: 25%;
}
.base:before, .base:after, .hole:before, .hole:after, .plate:before, .plate:after {
  content: "";
  display: block;
}

.base:before, .hole {
  background: radial-gradient(100% 100% at bottom left, gray, rgba(128, 128, 128, 0) 50%), radial-gradient(100% 100% at bottom right, gray, rgba(128, 128, 128, 0) 50%), linear-gradient(#333333, #4d4d4d);
}

.base:after, .hole:before {
  background-image: url(https://i.ibb.co/2YmnnBT/plastic-grain-texture.jpg);
  background-color: #262626;
  background-blend-mode: luminosity;
}

.base:before, .base:after, .plate:before, .plate:after {
  width: 100%;
  height: 100%;
}
.base:before, .plate:before {
  transform: translate(-5%, -5%);
}
.base:after, .plate:after {
  transform: translate(-6%, -6%);
}

.base {
  background: #262626;
  position: relative;
  width: 15em;
  height: 15em;
  transform: rotateX(30deg) rotateZ(45deg);
  z-index: 0;
}
.base:after {
  background-size: 100% 100%;
  box-shadow: 0.1em 0.1em 0 #262626 inset;
}

.hole {
  box-shadow: 0 0 0.1em 0.1em rgba(0, 0, 0, 0.5) inset, 0.1em 0.1em 0.2em 0.2em rgba(0, 0, 0, 0.5);
  width: 70%;
  height: 70%;
  transform: translate(-0.9em, -0.9em);
  z-index: 1;
}
.hole:before, .hole:after {
  top: 2%;
  left: 2%;
  width: 96%;
  height: 96%;
}
.hole:before {
  background-size: 143% 143%;
  box-shadow: 0.3em 0.3em 0.1em 0.1em rgba(0, 0, 0, 0.7) inset, -0.1em -0.1em 0.1em 0.1em rgba(0, 0, 0, 0.7) inset;
}
.hole:after {
  animation: blurOutIn 2s ease-out infinite;
  background: black;
}

.plate {
  background-image: radial-gradient(8% 10% at 18% 102%, #ebd4ad 33%, rgba(235, 212, 173, 0)), radial-gradient(16% 8% at 106% 10%, #ebd4ad 50%, rgba(235, 212, 173, 0)), linear-gradient(45deg, #7b591e 8%, #b9852d 16% 43%, #ebd4ad 46% 50%, #b9852d 53% 56%, #7b591e 60% 62%, #cd9432 65% 87%, #7b591e 92%);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 65%;
  height: 65%;
  transform: translate(-0.9em, -0.9em);
  z-index: 2;
}
.plate:before {
  background: radial-gradient(100% 100% at bottom left, #ebd4ad, rgba(235, 212, 173, 0) 50%), radial-gradient(100% 100% at bottom right, #ebd4ad, rgba(235, 212, 173, 0) 50%), linear-gradient(#b9852d, #cd9432);
}
.plate:after {
  background: #d7aa5b;
  box-shadow: 0 0.1em 0 #7b591e inset, 0 0 0 0.1em #ebd4ad inset;
}
.plate:nth-child(2) {
  animation: jump1 2s ease-out infinite;
  background-image: linear-gradient(45deg, #523b14 8%, #7b591e 12% 30%, #b9852d 50%, #7b591e 70% 88%, #523b14 92%);
}
.plate:nth-child(3), .plate:nth-child(4) {
  width: 50%;
  height: 50%;
}
.plate:nth-child(3), .plate:nth-child(5) {
  filter: blur(1px);
  opacity: 0.7;
}
.plate:nth-child(3):after, .plate:nth-child(5):after {
  background: #523b14;
  box-shadow: 1.5em 1.5em 0.3em #7b591e inset;
}
.plate:nth-child(3) {
  animation: jump2 2s ease-out infinite;
  transform: translate(-1.4em, -1.4em);
  z-index: 3;
}
.plate:nth-child(4) {
  animation: jump3 2s ease-out infinite;
  transform: translate(-1.9em, -1.9em);
  z-index: 4;
}
.plate:nth-child(5), .plate:nth-child(6) {
  width: 35%;
  height: 35%;
}
.plate:nth-child(5) {
  animation: jump4 2s ease-out infinite;
  transform: translate(-2.4em, -2.4em);
  z-index: 5;
}
.plate:nth-child(6) {
  animation: jump5 2s ease-out infinite;
  transform: translate(-2.8em, -2.8em);
  z-index: 6;
}

/* Animations */
@keyframes blurOutIn {
  from, 40%, to {
    filter: blur(0px);
    opacity: 1;
  }
  10%, 30% {
    filter: blur(3px);
    opacity: 0.5;
  }
}
@keyframes jump1 {
  from, 40%, to {
    transform: translate(-0.9em, -0.9em);
  }
  10%, 30% {
    transform: translate(-1.9em, -1.9em);
  }
}
@keyframes jump2 {
  from, 50%, to {
    filter: blur(1px);
    transform: translate(-1.4em, -1.4em);
  }
  10% {
    filter: blur(1px);
    transform: translate(-2.4em, -2.4em);
  }
  20%, 30% {
    filter: blur(4px);
    transform: translate(-1.9em, -1.9em);
  }
  40% {
    filter: blur(7px);
    transform: translate(-0.4em, -0.4em);
  }
}
@keyframes jump3 {
  from, 50%, to {
    transform: translate(-1.9em, -1.9em);
  }
  10% {
    transform: translate(-2.9em, -2.9em);
  }
  20%, 40% {
    transform: translate(-3.9em, -3.9em);
  }
}
@keyframes jump4 {
  from, 60%, to {
    filter: blur(1px);
    transform: translate(-2.4em, -2.4em);
  }
  10% {
    transform: translate(-3.4em, -3.4em);
  }
  20% {
    filter: blur(1px);
    transform: translate(-4.4em, -4.4em);
  }
  30%, 40% {
    filter: blur(4px);
    transform: translate(-3.9em, -3.9em);
  }
  50% {
    filter: blur(7px);
    transform: translate(-1.4em, -1.4em);
  }
}
@keyframes jump5 {
  from, 60%, to {
    transform: translate(-2.8em, -2.8em);
  }
  10% {
    transform: translate(-3.8em, -3.8em);
  }
  20% {
    transform: translate(-4.8em, -4.8em);
  }
  30%, 50% {
    transform: translate(-5.8em, -5.8em);
  }
}
</style>