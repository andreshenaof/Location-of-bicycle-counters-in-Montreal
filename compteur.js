// API Key for Mapbox. Get one here:
// https://www.mapbox.com/studio/account/tokens/
//if you want to use mapbox and your own map, activate the next line and introduce your key.
//const key ='key_here'


// Options for map
const options = {
  lat: 45.55,
  lng: -73.70,
  zoom: 11,
  studio: true, // false to use non studio styles
  //style: 'mapbox.dark' //streets, outdoors, light, dark, satellite (for nonstudio)
  //style:'mapbox://styles/mapbox/dark-v9'
  //for Leaflet basic style
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}


// Données de la ville
var web_data = `https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?resource_id=c7d0546a-a218-479e-bc9f-ce8f13ca972c`;

// Create an instance of Mapbox
//const mappa = new Mappa('MapboxGL', key);

// Create an instance of Leaflet
const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let pos;
let compteur2;
var color_actif = 'rgb(0, 255, 0)';
var color_inactif = 'rgb(220,20,60)';
var color_maintenance = 'rgb(255,165,0)';
let Pos_X = [];
let Pos_Y = [];
let Nom = [];
var x, y;
var radius = 13;


function preload(){
  loadJSON(web_data, gotData);
}

function gotData(data) {
  compteur2=data;
  //print(compteur2.result.records.length);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  //loadJSON(web_data, gotData);
  
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  
  // Load the data
  //myMap.onChange(drawPoint);
  
}

function draw(){
  clear();
  cursor(CROSS);

  drawPoint()
  // boite de text inferieur 
  stroke(0);
  textSize(18);
  fill(20)
  rect (10,windowHeight-72,440,30)
  fill(50)
  rect (10,windowHeight-35,530,30)
  fill(255)
  text('Compteurs de cyclistes de la ville de Montréal', 20, windowHeight-50);
  text("Cliquez sur le compteur pour obtenir plus d'informations", 20, windowHeight-15);
  
  
  // boite de text superieur
  textSize(15);
  fill(20)
  stroke(0)
  rect (50,10,160,90)
  fill(255)
  text('Actif', 70, 30);
  text('Inactif', 70, 60);
  text('En maintenance', 70, 90);
  
  
  stroke(0);
  fill(color_actif);
  let actif = ellipse(60,25,radius,radius);
  //print(actif)
  
  fill(color_inactif);
  ellipse(60,55,radius,radius);
  
  fill(color_maintenance);
  ellipse(60,85,radius,radius);
  
  //info bulle
  for (let i=0; i<Pos_X.length;i++){
    var d = dist(mouseX, mouseY, Pos_X[i], Pos_Y[i]);
    //print(d)
    if (d < radius) {
    texto_bullet(Pos_X[i],Pos_Y[i],Nom[i])
    } 
  }
       
}

function texto_bullet(Pos_X,Pos_Y,Nom){
  fill(255);
  rect (Pos_X-100,Pos_Y,300,50,10);
  fill(0);
  stroke(255)
  text(Nom,Pos_X-90,Pos_Y+22);
}

function drawPoint(){
  //clear();
  
  stroke(0);
  for (let i=0; i<compteur2.result.records.length;i++){
    const latitude = Number(compteur2.result.records[i].Latitude);
    const longitude = Number(compteur2.result.records[i].Longitude);
    const statut = compteur2.result.records[i].Statut;
    const name = compteur2.result.records[i].Nom;
    
    if (statut=='Actif'){
      fill(color_actif)
    }else if (statut == 'Inactif' || statut == 'Inactif_Déplacé'){
      fill(color_inactif)
    }else if (statut == 'En maintenance' || statut == 'Enmaintenance'){
      fill(color_maintenance) 
    }
    pos = myMap.latLngToPixel(latitude, longitude);
    ellipse(pos.x, pos.y, radius, radius);
    Pos_X[i]=pos.x;
    Pos_Y[i]=pos.y;
    Nom[i]=name;
  }
}
