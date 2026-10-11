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