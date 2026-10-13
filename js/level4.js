let markedTiles = [];
let markedTimer = null;

function logicLevel4() {
    markedTiles = new Array(paddingRows*paddingCols).fill(false);
    if(markedTimer){
        clearInterval(markedTimer);
    }
    markedTimer = setInterval(() => {
        if(currentLevel !==4){
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
            markedTiles.fill(false);
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
        for (let i=0; i<nearby.length; i++){
            const nIndex = nearby[i];
            if(nIndex >= 0 && nIndex < markedTiles.length){
                const nr = Math.floor(nIndex / paddingCols);
                const nc = nIndex % paddingCols;
                if(nr === 0 || nr === paddingRows-1 || nc === 0 || nc === paddingCols-1){
                    continue;
                }
                if (tilesInput[nIndex] !== 0){
                    markedTiles[nIndex] = true;
                }
            }
        }
    }
}