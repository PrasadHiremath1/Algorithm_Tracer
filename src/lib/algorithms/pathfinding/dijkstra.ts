// import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
// import { dropFromQueue, isEqual } from "../../../utils/helpers";
// import { GridType, TileType } from "../../../utils/types";

// export const dijkstra = (
//     grid: GridType,
//     startTile: TileType,
//     endTile: TileType
// ) => {
//     const traversedTiles = []
//     const base = grid[startTile.row][startTile.col]
//     base.distance = 0
//     base.isTraversed = true
//     const untraversedTiles = [base]

//     while(untraversedTiles.length > 0){
//         untraversedTiles.sort((a, b) => a.distance  - b.distance)
//         const currentTile = untraversedTiles.shift()
//         if(currentTile){
//             if(currentTile.isWall) continue
//             if(currentTile.distance == Infinity) break
//             currentTile.isTraversed = true
//             traversedTiles.push(currentTile)
//             if(isEqual(currentTile, endTile)) break
//             const neighbors = getUntraversedNeighbors(grid, currentTile)
//             for(let i = 0; i < neighbors.length; i++){
//                 if(currentTile.distance + 1 < neighbors[i].distance){
//                     dropFromQueue(neighbors[i], untraversedTiles)
//                     neighbors[i].distance = currentTile.distance + 1
//                     neighbors[i].parent = currentTile
//                     untraversedTiles.push(neighbors[i])
//                 }
//             }
//         }
//     }
//     const path = []
//     let current = grid[endTile.row][endTile.col]
//     while(current != null){
//         current.isPath = true
//         path.unshift(current)
//         current = current.parent!
//     }
//     return {traversedTiles, path}
// }

import { getUntraversedNeighbors } from "../../../utils/getUntraversedNeighbors";
import { dropFromQueue2, isEqual } from "../../../utils/helpers";
import { GridType, TileType } from "../../../utils/types";
import PriorityQueue from 'js-priority-queue' 

export const dijkstra = (
    grid: GridType,
    startTile: TileType,
    endTile: TileType
) => {
    const traversedTiles = [];
    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;

    const untraversedTiles = new PriorityQueue<TileType>({
        comparator: (a, b) => a.distance - b.distance,
    });
    untraversedTiles.queue(base);

    while (untraversedTiles.length > 0) {
        const currentTile = untraversedTiles.dequeue();
        
        if (currentTile.isWall) continue;
        if (currentTile.distance === Infinity) break;

        currentTile.isTraversed = true;
        traversedTiles.push(currentTile);

        if (isEqual(currentTile, endTile)) break;

        const neighbors = getUntraversedNeighbors(grid, currentTile);

        for (let i = 0; i < neighbors.length; i++) {
            if (currentTile.distance + 1 < neighbors[i].distance) {
                // dropFromQueue(neighbors[i], untraversedTiles)
                dropFromQueue2(neighbors[i], untraversedTiles);

                neighbors[i].distance = currentTile.distance + 1;
                neighbors[i].parent = currentTile;
                untraversedTiles.queue(neighbors[i]);
            }
        }
    }


    const path = [];
    let current = grid[endTile.row][endTile.col];
    while (current != null) {
        current.isPath = true;
        path.unshift(current);
        current = current.parent!;
    }
    return { traversedTiles, path };
};
