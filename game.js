const rows = 9;
const cols = 16;
const totals = rows * cols;
const paddingRows = rows +2;
const paddingCols = cols + 2;
let tilesInput = [];
let selectedIndex= null;
const num_types = 21;
let score = 0;
let total_time;
let numberShuffle = 0;
let time_counting = null;
let currentLevel =1;
const levelId = document.getElementById("level_option");
const scoreId = document.getElementById("score");
const timeId = document.getElementById("time_left");
const music = document.getElementById("bgMusic");
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

function drawTiles() {
    boardPikachu.innerHTML = "";
    boardPikachu.classList.remove("result_display", "start_mode");
    boardPikachu.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    for (let i = 0; i < paddingRows * paddingCols; i++) {
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if (r === 0 || r === paddingRows - 1 || c === 0 || c === paddingCols - 1) {
            continue;
        }
        const value = tilesInput[i];
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (value === 0) {
            tile.classList.add("empty");
        } else {
            tile.dataset.type = value;
            tile.dataset.index = i;
            tile.style.backgroundImage = `url('img/${value}.png')`;

            if (currentLevel === 2 && frozenTiles[i]) {
                tile.classList.add("frozen");
            } else if (currentLevel === 3 && hiddenTiles[i]) {
                tile.classList.add("hidden");
            } else if (currentLevel === 4 && lockedTiles[i]) {
                tile.classList.add("locked");
            } else if (currentLevel === 5 && markedTiles[i]) {
                if (markedTiles[i] === 1){
                    tile.classList.add("marked_1");
                } else if (markedTiles[i] === 2) {
                    tile.classList.add("marked_2");
                }
            } else if (currentLevel === 6 && curseTiles[i]) {
                tile.classList.add("curse");
            }

            if (i === selectedIndex) {
                tile.classList.add("active");
            }

            tile.addEventListener("click", () => handleTileClick(tile, i));
        }
        boardPikachu.appendChild(tile);
    }
}

function handleTileClick(currentTile, currentIndex){
    if (currentIndex === selectedIndex) {
        return;
    }
    if(selectedIndex === null){
        selectedIndex = currentIndex;
        currentTile.classList.add("active");
        if(currentLevel === 4){
            lockedTilesLogic(currentIndex);
        }
        return;
    }
    const firstIndex = selectedIndex;
    if(tilesInput[firstIndex] === tilesInput[currentIndex]){
        if(canRemove(firstIndex, currentIndex)){
            tilesInput[firstIndex] =0;
            tilesInput[currentIndex] = 0;

            if(currentLevel === 2){
                unFreezeLogic(firstIndex);
                unFreezeLogic(currentIndex);
            } else if(currentLevel === 3){
                unHiddenLogic(firstIndex);
                unHiddenLogic(currentIndex);
            } else if(currentLevel === 5){
                markTilesLogic(firstIndex, currentIndex);
            }

            selectedIndex = null;
            score +=5;
            currentScore();
            if (checkWin()){
                showGameResult(`You Win! Your score: ${score}<br>Shuffle used: ${numberShuffle}`, true);
                music.pause();
                music.currentTime = 0;
                return;
            }
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
    total_time = 480;
    currentTime();
    time_counting = setInterval(() => {
        total_time--;
        currentTime();
        if(total_time <= 0){
            showGameResult(`You lost! Out of time. Your score: ${score}<br>Shuffle used: ${numberShuffle}`, false);
            music.pause();
            music.currentTime = 0;
        }
    }, 1000)
}

function shuffleGame(){
    total_time -=20;
    currentTime();
    numberShuffle++;
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
    numberShuffle = 0;
    music.pause();
    music.currentTime = 0;
    showGameResult("Choose your level and press Start", false, true)
}

if (levelId){
    levelId.addEventListener("change", (e) => {
        currentLevel = parseInt(e.target.value);
        restartGame();
    });
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

function showGameResult(text, win, start = false){
    if(time_counting){
        clearInterval(time_counting);
        time_counting = null;
    }
    boardPikachu.innerHTML = "";
    boardPikachu.classList.add("result_display");
    if(start){
        boardPikachu.classList.add("start_mode");
        const titleDiv = document.createElement("div");
        titleDiv.id = "title";
        titleDiv.innerText = "PIKACHU CONNECT";
        boardPikachu.appendChild(titleDiv);
    } else {
        boardPikachu.classList.remove("start_mode");
    }
    const resultText = document.createElement("p");
    resultText.innerHTML = text;
    if(!start){
        if(win){
            resultText.classList.add("display_win");
        } else {
            resultText.classList.add("display_loss");
        }
    }
    boardPikachu.appendChild(resultText);
    if(start){
        const startBt = document.createElement("button");
        startBt.innerText = "Start";
        startBt.classList.add("bt_start");
        startBt.onclick = () => {
            boardPikachu.classList.remove("result_display", "start_mode");
            tilesInput = genTiles();
            score = 0;
            currentScore();
            startCounting();
            music.play();
            if (currentLevel === 2) logicLevel2();
            else if (currentLevel === 3) logicLevel3();
            else if (currentLevel === 4) logicLevel4();
            else if (currentLevel === 5) logicLevel5();
            else if (currentLevel === 6) logicLevel6();

            drawTiles();
        }
        boardPikachu.appendChild(startBt);
    }
}

function checkWin(){
    for (let i=0; i < tilesInput.length; i++){
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if(r === 0 || r === paddingRows -1 || c === 0 || c === paddingCols - 1) {
            continue;
        }
        if (tilesInput[i] !== 0){
            return false;
        }
    }
    return true;
}

restartGame();

//level2
let frozenTiles = []

function logicLevel2(){
    frozenTiles = new Array(paddingRows*paddingCols).fill(false);
    for(let i=0;i<frozenTiles.length;i++){
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if(r === 0 || r === paddingRows -1 || c === 0 || c === paddingCols - 1) {
            continue;
        }
        if(Math.random() < 0.4){
            frozenTiles[i] = true;
        }
    }
}

function unFreezeLogic(index){
    if(!frozenTiles || frozenTiles.length === 0){
        return;
    }
    const r = Math.floor(index / paddingCols);
    const c = index % paddingCols;
    const nearby = [
        (r-1)*paddingCols+c,
        (r+1)*paddingCols+c,
        r*paddingCols+(c-1),
        r*paddingCols+(c+1)
    ]
    for (let i=0;i<nearby.length;i++){
        const nIndex = nearby[i];
        if(nIndex >= 0 && nIndex < frozenTiles.length){
            frozenTiles[nIndex] = false;
        }
    }
}

//level3
let hiddenTiles = [];
let hiddenTimer = null;

function logicLevel3() {
    hiddenTiles = new Array(paddingRows*paddingCols).fill(false);
    for (let i=0; i < hiddenTiles.length; i++){
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if(r === 0 || r === paddingRows-1 || c === 0 || c === paddingCols-1){
            continue;
        }
        if(Math.random() < 0.25){
            hiddenTiles[i] = true;
        }
    }
    if(hiddenTimer){
        clearInterval(hiddenTimer);
    }
    hiddenTimer = setInterval(() =>{
        let availableTiles = [];
        for (let i=0; i < tilesInput.length; i++){
            const r = Math.floor(i / paddingCols);
            const c = i % paddingCols;
            if(r === 0 || r === paddingRows-1 || c === 0 || c === paddingCols-1){
                continue;
            }
            if(tilesInput[i]!==0 && !hiddenTiles[i]){
                const nearby = [
                    (r-1)*paddingCols+c,
                    (r+1)*paddingCols+c,
                    r*paddingCols+(c-1),
                    r*paddingCols+(c+1)
                ];
                let countNearby = 0;
                for (let j=0; j < nearby.length; j++){
                    const cIndex = nearby[j];
                    if(cIndex >= 0 && cIndex < tilesInput.length ){
                        if (tilesInput[cIndex] !== 0){
                            countNearby++;
                        }
                    }
                }
                if (countNearby >= 3){
                    availableTiles.push(i);
                }
            }
        }
        if(availableTiles.length > 0){
            const rdTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
            hiddenTiles[rdTile] = true;
            drawTiles();
        }
    }, 20000)
}

function unHiddenLogic(index){
    if(!hiddenTiles || hiddenTiles.length === 0){
        return;
    }
    const r = Math.floor(index / paddingCols);
    const c = index % paddingCols;
    const nearby = [
        (r-1)*paddingCols+c,
        (r+1)*paddingCols+c,
        r*paddingCols+(c-1),
        r*paddingCols+(c+1)
    ];
    for (let i=0; i < nearby.length; i++){
        const nIndex = nearby[i];
        if(nIndex >= 0 && nIndex < hiddenTiles.length ){
            if (hiddenTiles[nIndex]){
                const nr = Math.floor(nIndex / paddingCols);
                const nc = nIndex % paddingCols;
                const checkNearby = [
                    (nr-1)*paddingCols+nc,
                    (nr+1)*paddingCols+nc,
                    nr*paddingCols+(nc-1),
                    nr*paddingCols+(nc+1)
                ];
                let emptyTiles = 0;
                for (let j=0; j < checkNearby.length; j++){
                    const cIndex = checkNearby[j];
                    if(cIndex >= 0 && cIndex < tilesInput.length ){
                        if (tilesInput[cIndex] === 0){
                            emptyTiles++;
                        }
                    }
                }
                if (emptyTiles >= 2){
                    hiddenTiles[nIndex] = false;
                }
            }
        }
    }
}

//level4
let lockedTiles = [];
let lockTimer = null;
let lockCooldown = false;
let lastLockType = null;

function logicLevel4() {
    lockedTiles = new Array(paddingRows*paddingCols).fill(false);
    lockCooldown = false;
    lastLockType = null;
    if (lockCooldown) {
        clearTimeout(lockTimer);
        lockTimer =null;
    }
}

function lockedTilesLogic(currentIndex) {
    if (lockCooldown){
        return;
    }
    if(!lockedTiles || lockedTiles.length === 0){
        lockedTiles = new Array(paddingRows*paddingCols).fill(false);
    }
    const targetType = tilesInput[currentIndex];
    if (targetType === 0 || targetType === lastLockType) {
        return;
    }
    lockedTiles[currentIndex] = true;
    let hasLocked = true;
    for (let i = 0; i < tilesInput.length; i++) {
        const r = Math.floor(i / paddingCols);
        const c = i % paddingCols;
        if(r === 0 || r === paddingRows-1 || c === 0 || c === paddingCols-1){
            continue;
        }
        if(i !== currentIndex && tilesInput[i] === targetType){
            if (canRemove(currentIndex, i)){
                lockedTiles[i] = true;
                hasLocked = true;
            }
        }
    }

    if(hasLocked){
        lastLockType = targetType;
        lockCooldown = true;
        setTimeout(() => {
            lockCooldown = false;
        }, 10000);
        if(lockTimer){
            clearTimeout(lockTimer);
        }
        lockTimer = setTimeout(() => {
            if (currentLevel === 4){
                lockedTiles.fill(false);
                drawTiles();
            }
        }, 15000);
        drawTiles();
    }
}

//level5
let markedTiles = [];
let markedTimer = null;

function logicLevel5() {
    markedTiles = new Array(paddingRows*paddingCols).fill(0);
    if(markedTimer){
        clearInterval(markedTimer);
    }
    markedTimer = setInterval(() => {
        if(currentLevel !==5){
            return;
        }
        let hasMarked = false;
        for(let i=0; i<markedTiles.length; i++){
            if (markedTiles[i]){
                hasMarked = true;
                break;
            }
        }
        if(hasMarked){
            for (let i=0; i<markedTiles.length; i++){
                if (markedTiles[i] === 2){
                    markedTiles[i] = 1;
                } else if (markedTiles[i] === 1){
                    markedTiles[i] = 0;
                }
            }
            drawTiles();
        }
    }, 30000);
}

function markTilesLogic(i1, i2){
    if(!markedTiles || markedTiles.length === 0){
        return;
    }
    const indexCheck = [i1, i2];
    for (let i=0; i<indexCheck.length; i++){
        const idx = indexCheck[i];
        const r = Math.floor(idx / paddingCols);
        const c = idx % paddingCols;
        const nearby = [
            (r-1)*paddingCols+c,
            (r+1)*paddingCols+c,
            r*paddingCols+(c-1),
            r*paddingCols+(c+1)
        ];
        for (let j=0; j<nearby.length; j++){
            const nIndex = nearby[j];
            if(nIndex >= 0 && nIndex < markedTiles.length){
                const nr = Math.floor(nIndex / paddingCols);
                const nc = nIndex % paddingCols;
                if(nr === 0 || nr === paddingRows-1 || nc === 0 || nc === paddingCols-1){
                    continue;
                }
                if (tilesInput[nIndex] !== 0){
                    if (markedTiles[nIndex] === 1){
                        markedTiles[nIndex] = 2;
                    } else if (markedTiles[nIndex] === 0){
                        markedTiles[nIndex] = 1;
                    }
                }
            }
        }
    }
}

//level6
let curseTiles = [];
let curseTimer = null;

function logicLevel6() {
    curseTiles = new Array(paddingRows*paddingCols).fill(false);
    let validTiles = [];
    for (let i=0; i<tilesInput.length; i++){
        if (tilesInput[i] !== 0){
            validTiles.push(i);
        }
    }
    validTiles.sort(() => Math.random() - 0.5);
    let initialCount = 2;
    if (validTiles.length < 2){
        initialCount = validTiles.length;
    }
    for (let i=0; i<initialCount; i++){
        curseTiles[validTiles[i]] = true;
    }
    if(curseTimer){
        clearInterval(curseTimer);
    }
    curseTimer = setInterval(() => {
        if(currentLevel !==6){
            return;
        }
        let arrSpread = new Array(paddingRows*paddingCols).fill(false);
        for (let i=0; i<curseTiles.length; i++){
            arrSpread[i] = curseTiles[i];
        }
        for (let i=0; i<tilesInput.length; i++){
            if (tilesInput[i] !== 0 && curseTiles[i]){
                const r = Math.floor(i / paddingCols);
                const c = i % paddingCols;
                const nearby = [
                    r*paddingCols+(c+1)
                ];
                for (let j=0; j<nearby.length; j++){
                    const nIndex = nearby[j];
                    if(nIndex >= 0 && nIndex < tilesInput.length ){
                        if (tilesInput[nIndex] !== 0 && !curseTiles[nIndex]){
                            arrSpread[nIndex] = true;
                        }
                    }
                }
            }
        }
        for (let i=0; i<curseTiles.length; i++){
            curseTiles[i] = arrSpread[i];
        }
        let totalCurse = 0;
        let totalNormal = 0;
        for (let i=0; i<tilesInput.length; i++){
            if (tilesInput[i] !== 0){
                if (curseTiles[i]){
                    totalCurse++;
                } else {
                    totalNormal++;
                }
            }
        }
        if(totalCurse < totalNormal){
            let spawnTiles = [];
            for (let i=0; i<tilesInput.length; i++){
                if(tilesInput[i] !== 0  && !curseTiles[i]){
                    spawnTiles.push(i);
                }
            }
            if(spawnTiles.length > 0){
                spawnTiles.sort(() => Math.random() - 0.5);
                let numberSpawn = 2;
                if(spawnTiles.length < 2){
                    numberSpawn = spawnTiles.length;
                }
                for (let i=0; i<numberSpawn; i++){
                    curseTiles[spawnTiles[i]] = true;
                }
            }
        }
        if(totalCurse >= totalNormal * 0.8){
            showGameResult(`You lost due to Curse Tiles! Your score: ${score}<br>Shuffle used: ${numberShuffle}`, false);
            music.pause();
            music.currentTime = 0;
            return;
        }
        drawTiles();
    }, 20000)
}
