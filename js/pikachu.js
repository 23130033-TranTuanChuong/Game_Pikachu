const rows = 9;
const cols = 16;
const totals = rows * cols;
const paddingRows = rows +2;
const paddingCols = cols + 2;
let tilesInput = [];
let selectedIndex= null;
const num_types = 21;
const scoreId = document.getElementById("score");
const timeId = document.getElementById("time_left");
let score = 0;
let total_time;
let time_counting = null;
const boardPikachu = document.getElementById('board');

function genTiles(){
    const tiles = [];
    for(let i = 1; i <= totals / 2; i++) {
        const pokemonId = Math.floor(Math.random() * num_types)+1;
        tiles.push(pokemonId);
        tiles.push(pokemonId);
    }
    tiles.sort(() => Math.random() - 0.5);
    const board = [];
    let tileIndex = 0;
    for (let r = 0; r < paddingRows; r++) {
        for (let c = 0; c < paddingCols; c++) {
            if(r === 0 || r === paddingRows -1 || c ===0 || c === paddingCols -1){
                board.push(0);
            } else {
                board.push(tiles[tileIndex]);
                tileIndex++;
            }
        }
    }
    return board;
}

function handleTileClick(currentTile, currentIndex){
    if(selectedIndex === currentIndex){
        currentTile.classList.remove("active");
        selectedIndex = null;
        return;
    }
    if(selectedIndex === null){
        selectedIndex = currentIndex;
        currentTile.classList.add("active");
        return;
    }
    const firstIndex = selectedIndex;
    if(tilesInput[firstIndex] === tilesInput[currentIndex]){
        if(canRemove(firstIndex, currentIndex)){
            tilesInput[firstIndex] =0;
            tilesInput[currentIndex] = 0;
            selectedIndex = null;
            score +=5;
            currentScore();
            drawTiles();
        } else {
            selectedIndex = currentIndex;
            drawTiles();
        }
    } else {
        selectedIndex = currentIndex;
        drawTiles();
    }
}

function drawTiles(){
    boardPikachu.innerHTML = "";
    boardPikachu.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    for (let i=0; i < paddingRows * paddingCols; i++){
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if (r === 0 || r === paddingRows -1 || c ===0 || c === paddingCols -1){
            continue;
        }
        const value = tilesInput[i];
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (value ===0) {
            tile.classList.add("empty");
        } else {
            tile.dataset.type = value;
            tile.dataset.index = i;
            const img = document.createElement("img");
            img.src = `assets/${value}.png`;
            tile.appendChild(img);
            if (i === selectedIndex){
                tile.classList.add("active");
            }

            tile.addEventListener("click", () => handleTileClick(tile, i));
        }
        boardPikachu.appendChild(tile);
    }
}

function currentScore(){
    scoreId.innerText = `Your score: ${score}`;
}

function currentTime(){
    const minutes = Math.floor(total_time/60);
    const second = total_time % 60;
    timeId.innerText = `Time left: ${minutes}m ${second}s`;
}

function startCounting(){
    if(time_counting){
        clearInterval(time_counting);
    }
    total_time = 600;
    currentTime();
    time_counting = setInterval(() => {
        total_time--;
        currentTime();
    }, 1000)
}

function shuffleGame(){
    let shuffleIndex= [];
    let shuffleValue = [];
    for (let i = 0; i < tilesInput.length; i++) {
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if (r === 0 || r === paddingRows -1 || c ===0 || c === paddingCols -1){
            continue;
        }
        if (tilesInput[i] !== 0){
            shuffleIndex.push(i);
            shuffleValue.push(tilesInput[i]);
        }
    }
    shuffleValue.sort(() => Math.random() - 0.5);
    for (let j = 0; j < shuffleIndex.length; j++){
        const index = shuffleIndex[j];
        tilesInput[index] = shuffleValue[j];
    }
    selectedIndex = null;
    drawTiles();
}

function restartGame() {
    selectedIndex = null;
    score = 0;
    currentScore();
    startCounting();
    tilesInput = genTiles();
    drawTiles();
}

function getTileValue(r, c){
    const index = r*paddingCols+c;
    return tilesInput[index];
}

function checkLine(r1, c1, r2, c2){
    if(r1 !== r2 && c1 !== c2){
        return false;
    }
    if(r1 === r2){
        const minC= Math.min(c1, c2);
        const maxC= Math.max(c1, c2);
        for(let i= minC+1; i < maxC; i++){
            if(getTileValue(r1, i) !== 0){ return false; }
        }
        return true;
    }
    if(c1 === c2){
        const minR = Math.min(r1, r2);
        const maxR = Math.max(r1, r2);
        for(let i= minR+1; i < maxR; i++){
            if(getTileValue(i, c1) !== 0){ return false; }
        }
        return true;
    }
    return false;
}

function checkL(r1, c1, r2, c2){
    if(getTileValue(r1, c2) === 0){
        if(checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)){
            return true;
        }
    }
    if(getTileValue(r2, c1) === 0){
        if(checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)){
            return true;
        }
    }
    return false;
}

function checkZandU(r1, c1, r2, c2){
    for(let c = 0; c < paddingCols; c++){
        if(c === c1 || getTileValue(r1, c) === 0){
            if (checkLine(r1, c1, r1, c) && checkL(r1, c, r2, c2)){
                return true;
            }
        }
    }
    for(let r=0; r < paddingRows; r++){
        if(r === r1 || getTileValue(r, c1) === 0){
            if(checkLine(r1, c1, r, c1) && checkL(r, c1, r2, c2)){
                return true;
            }
        }
    }
    return false;
}

function canRemove(i1, i2){
    const r1 = Math.floor(i1 / paddingCols) ;
    const c1 = i1 % paddingCols ;
    const r2 = Math.floor(i2 / paddingCols);
    const c2 = i2 % paddingCols;
    if (checkLine(r1, c1, r2, c2)) return true;
    if (checkL(r1, c1, r2, c2)) return true;
    if (checkZandU(r1, c1, r2, c2)) return true;
    return false;
}

const restartBt = document.getElementById('restart_bt');
restartBt.addEventListener('click', restartGame);

const shuffleBt = document.getElementById('shuffle_bt');
shuffleBt.addEventListener('click', shuffleGame);

restartGame();