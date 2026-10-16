let markedTiles = [];
let markedTimer = null;

function logicLevel4() {
    markedTiles = new Array(paddingRows*paddingCols).fill(0);
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