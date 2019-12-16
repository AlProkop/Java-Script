console.log("index.js has started");
//Global constants
var CONST = {
NBR_OF_CARDS: 16,
CARDS_PER_ROW: 4,
KEY_MAX_VALUE: 1000,
CARD_STATE_IN_GAME: 0, //playable card
CARD_STATE_PLAYED: 1, // pair found
GAME_STATE_0_TURNED: 0,
GAME_STATE_1_TURNED: 1,
GAME_STATE_OVER: 2,
CARD_FACE_UP_COLOR: "yellow",
CARD_PLAYED_COLOR: "green",
};
//Card object
function MemoryCard(card_id, gameController){
 var that = this;
 this.card_id = card_id;
 this.gameController = gameController;
 this.key = "";
 this.state = CONST.CARD_STATE_IN_GAME;
 this.faceDownBGColor = document.getElementById(card_id).style.background;
 this.faceUpBGColor = CONST.CARD_FACE_UP_COLOR;
 this.playedBGColor = CONST.CARD_PLAYED_COLOR;
 this.onClickhandler = function(){
 var id = that.card_id.substr(5); //card-n => get the n
 console.log("Card "+this.id+" clicked");
 if(that.state == CONST.CARD_STATE_IN_GAME){
 that.gameController.cardClicked(id);
 }

 }
 this.setKey= function(key){
 this.key = key;
 }

 this.getKey= function(){
 return this.key;
 }
 this.setState = function(state){
 this.state = state;
 }
 this.getState = function(){
 return this.state;
 }
 this.turnVisible = function(){
 var e = document.getElementById(this.card_id);
 e.style.backgroundColor = this.faceUpBGColor;
 e.innerHTML = "<p>"+this.key+"</p>";
 }

 this.turnInvisible = function(){
 var e = document.getElementById(this.card_id);
 e.style.backgroundColor = this.faceDownBGColor;
 e.innerHTML = "<p>ø¤°º((¨*•.¸¸.•*¨))°º¤ø</p>";
 }
 this.setPlayedState = function(){
 this.state = CONST.CARD_STATE_PLAYED;
 var e = document.getElementById(this.card_id);
 e.style.background = this.playedBGColor;
 }
};
//Game controller
function MemoryGame(){
 var that;
 that = this;
 this.gameState = CONST.GAME_STATE_0_TURNED;
 this.firstCard = -1;
 this.secondCard = -1;
var f_id=-1; //index of the first card from pair
var s_id=-1; //index of the second card from pair
 this.cards = [];
 this.createDivs = function(){
     var divRows;
 var divCell;
 var p, t, i, j;
 for( i = 0; i< CONST.NBR_OF_CARDS/CONST.CARDS_PER_ROW; i++){
 divRows = document.createElement("div");
 divRows.id = "row-"+i;
 divRows.className = "row";
 for (j = 0; j< CONST.CARDS_PER_ROW; j++){
 divCell = document.createElement("div");
 divCell.id = "card-"+(j+(i*CONST.CARDS_PER_ROW));
 divCell.className = "card";
 p = document.createElement("p");
 t = document.createTextNode("ø¤°º((¨*•.¸¸.•*¨))°º¤ø");
 p.appendChild(t);
 divCell.appendChild(p);
 divRows.appendChild(divCell);
 }
 document.getElementById("gamecontent").appendChild(divRows);
 }
 }

 this.createCards = function(){
 var i;
 var card_id = "";
 for( i = 0; i< CONST.NBR_OF_CARDS; i++){
 card_id = "card-" + i;
 this.cards[i] = new MemoryCard(card_id, this);

 //add click handler
 document.getElementById(card_id).addEventListener("click", this.cards[i].onClickhandler);
 }
 }

 this.getNextUninitializedKeyIndex = function(index){
 var i;
 for(i=0; i<CONST.NBR_OF_CARDS; i++){
 if(this.cards[(i+index)%CONST.NBR_OF_CARDS].getKey()=="")
{return (i+index)%CONST.NBR_OF_CARDS;}
 }
 return 0;
 };
 this.setKeysToCards = function(){
 var i, x, y, key;
 for(i = 0; i<CONST.NBR_OF_CARDS/2; i++){
 key = Math.floor(Math.random()*CONST.KEY_MAX_VALUE);
 x = Math.floor(Math.random()*CONST.NBR_OF_CARDS);
 y = Math.floor(Math.random()*CONST.NBR_OF_CARDS);
 x = this.getNextUninitializedKeyIndex(x);
 this.cards[x].setKey(key);
 y = this.getNextUninitializedKeyIndex(y);
 this.cards[y].setKey(key);
 }
 };
 this.initialize = function(){
 console.log("Initializing MemoryGame...");
 this.createDivs();
 this.createCards();
 this.setKeysToCards();
 }
 this.cardClicked = function (card_id){
 console.log("CardClicked: "+card_id);
 if(that.gameState == CONST.GAME_STATE_0_TURNED){

f_id=card_id; //f_id stores id of 1th card
that.firstCard=that.cards[f_id].key; //firstCard stores key
 that.cards[card_id].turnVisible(); // turn on first card
 that.gameState = CONST.GAME_STATE_1_TURNED;
console.log(that.firstCard);
 }
 else if (that.gameState == CONST.GAME_STATE_1_TURNED){ //check if 1th card was turn on

s_id=card_id; //s_id stores id of second card
that.secondCard=that.cards[s_id].key; //secondCard stores key
that.cards[card_id].turnVisible();
 that.gameState = CONST.GAME_STATE_0_TURNED;
console.log(that.secondCard);
 }
if (f_id!==-1 && s_id!==-1){ // check if both cards were turned on
if(that.firstCard == that.secondCard){ //check if both cards have the same key
that.cards[f_id].setPlayedState(); //set card as a played
that.cards[s_id].setPlayedState(); //set card as a played
f_id=-1; //set default value to f_id for next check
s_id=-1; //set default value to f_id for next check
}
else {
function func(){ //if cards are not the same turn they off
that.cards[f_id].turnInvisible();
that.cards[s_id].turnInvisible();
f_id=-1; //set var to default
s_id=-1;
that.gameState = CONST.GAME_STATE_0_TURNED;
}
setTimeout(func, 750);
}
}
 }
};
var dbg0;
//create a game and initialize it iife
(function (){
var memoryGame = new MemoryGame();
memoryGame.initialize();
dbg0 = memoryGame;
})();


