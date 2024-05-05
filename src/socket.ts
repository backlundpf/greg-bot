"use client";

import { io } from "socket.io-client";

const URL = process.env.BASE_URL ?? "http://localhost:3000";
console.log("Socket on: ", URL);
export const socket = io();
