const rows = 4;
const cols = 6;
const totals = rows * cols;
const boardPikachu = document.getElementById('board');

function genTiles(){
    const tiles = [];
    for(let i = 0; i < totals / 2; i++) {
        tiles.push(i);
        tiles.push(i);
    }
    tiles.sort(() => Math.random() - 0.5);
    return tiles;
}

function drawTiles(){
    boardPikachu.innerHTML = "";
    boardPikachu.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    const tilesInput = genTiles();
    for (let i=0; i < totals; i++){
        const value = tilesInput[i];
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.type = value;
        boardPikachu.appendChild(tile);
    }
}

drawTiles();