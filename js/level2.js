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