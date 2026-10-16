let lockedTiles = [];
let lockTimer = null;
let lockCooldown = false;
let lastLockType = null;

function logicLevel5() {
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
    let hasLocked = false;
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
            if (currentLevel === 5){
                lockedTiles.fill(false);
                drawTiles();
            }
        }, 15000);
        drawTiles();
    }
}