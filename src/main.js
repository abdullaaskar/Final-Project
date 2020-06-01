/*
Main Programmer:          
Abudula Aisikaer
Zihan Guo

Art and a little Program: 
Logan Park 
*/

"use strict";

// global variables
let cursors;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 21;

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Load, Level1, Level2, Level3, Level4, Level5, EndLevel]
};
// reserve keyboard vars
let keyRIGHT,keyR;

let game = new Phaser.Game(config);