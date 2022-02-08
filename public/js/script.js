const express = require("express");


let router = express.Router();
let Director = require (__dirname + '/../models/director');
let directores = document.getElementById("directores");
let director = document.getElementById("director");

function recogerDirectores(){
    console.log("haosefijasñe");
    for(var i = 0; i< directores.length; i++){
        var opcionValor = directores[i];
        var opcionEle = document.createElement("option");
        opcionEle.textContent = opcionValor;
        opcionEle.value = opcionValor;
        director.appendChild(opcionEle.innerText);
    }
}
