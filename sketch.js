//Create variables here
var dog, dogImg1, happyDogImg, database, foodS, foodStock, readStock;
var foodObj, feedTime, lastFed, feed, addFoods, feedDog;
var bedroomImg, gardenImg, washroomImg, garden, gameState;

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/happydogImg.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(800, 500);
  database = firebase.database();
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  //read gameState from database
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  fedTime = database.ref('FeedTime');
fedTime.on("value", function(data){
  lastFed = data.val();
})
  

  dog = createSprite(650,150,10,60);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700,70);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,70);
  addFood.mousePressed(addFoods);
}


function draw() { 
  background("green");
  
 
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}




fill(225,225,254);
textSize(15);
if(lastFed >= 12){
  text("Last Feed: " + lastFed%12 + "PM", 200, 30);
}
else if(lastFed==0){
  text("Last Feed: 12AM ", 350, 30);
}
else{
  text("Last Feed: " + lastFed + "AM", 350, 30);
}

  drawSprites();
  //add styles here
  }



function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//function in update gamestates in database
function update(state){
  database.ref('/').update({
    gameState: state
  });
}