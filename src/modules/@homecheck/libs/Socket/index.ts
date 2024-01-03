import { io } from 'socket.io-client'



export const socket = io(
  "https://homecheck.kr", {
    path: "/socket_/v2/"
  });
