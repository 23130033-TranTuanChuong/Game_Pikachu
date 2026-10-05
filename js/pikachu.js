const rows = 9;
const cols = 16;
const totals = rows * cols;
let tilesInput = [];
let selectedIndex= null;
const boardPikachu = document.getElementById('board');

function genTiles(){
    const tiles = [];
    for(let i = 1; i <= totals / 2; i++) {
        tiles.push(i);
        tiles.push(i);
    }
    tiles.sort(() => Math.random() - 0.5);
    return tiles;
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
        tilesInput[firstIndex] =0;
        tilesInput[currentIndex] = 0;
        selectedIndex = null;
        drawTiles();
    } else {
        selectedIndex = currentIndex;
        drawTiles();
    }
}

function drawTiles(){
    boardPikachu.innerHTML = "";
    boardPikachu.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    for (let i=0; i < totals; i++){
        const value = tilesInput[i];
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if (value ===0) {
            tile.classList.add("empty");
        } else {
            tile.dataset.type = value;
            tile.dataset.index = i;
            tile.innerText = value;
            if (i === selectedIndex){
                tile.classList.add("active");
            }

            tile.addEventListener("click", () => handleTileClick(tile, i));
        }
        boardPikachu.appendChild(tile);
    }
}

function restartGame() {
    selectedIndex = null;
    tilesInput = genTiles();
    drawTiles();
}

const restartBt = document.getElementById('restart_bt');
restartBt.addEventListener('click', restartGame);

restartGame();