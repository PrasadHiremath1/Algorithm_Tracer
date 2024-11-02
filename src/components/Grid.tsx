import { twMerge } from "tailwind-merge";
import { usePathFinding } from "../hooks/usePathFinding"
import { MAX_ROWS, MAX_COLS } from "../utils/constants";
import { Tile } from "./Tile";
import { MutableRefObject, useState } from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";


export function Grid({isVisualizationRunningRef}: {isVisualizationRunningRef: MutableRefObject<boolean>}) {
    const {grid, setGrid} = usePathFinding();
    const [isMouseDown,  setIsMouseDown] = useState(false);

    const handleMouseDown = (row: number, col: number) => {
        if(isVisualizationRunningRef.current || checkIfStartOrEnd( row, col)){
            return;
        }

        setIsMouseDown(true);
        const newGrid = createNewGrid(grid, row, col);
        setGrid(newGrid);
    }

    const handleMouseUp = (row: number, col: number) => {
        if(isVisualizationRunningRef.current || checkIfStartOrEnd( row, col)){
            return;
        }

        setIsMouseDown(false);
    }

    const handleMouseEnter =  (row: number, col: number) => {
        if(isVisualizationRunningRef.current || checkIfStartOrEnd( row, col)){
            return;
        }
        if(isMouseDown) {
            const  newGrid = createNewGrid(grid, row, col);
            setGrid(newGrid);
        }
    }



    return(
        <div className={twMerge(
            //base classes
            "flex items-center flex-col justify-center border-sky-300 mt-5",
            //controlling grid heigh
            `lg:min-h-[${MAX_ROWS * 17}px] 
             md:min-h-[${MAX_ROWS * 15}px]
             xs:min-h-[${MAX_ROWS * 8}px]
             min-h-[${MAX_ROWS * 7}px]
            `,
            //controlling grid width
            `lg:w-[${MAX_COLS * 17}px]
             md:w-[${MAX_COLS * 15}px]
             xs:w-[${MAX_COLS * 8}px]
             min-w-[${MAX_COLS * 7}px]
            `
        )}>
            {grid.map((r, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {r.map((tile, tileIndex) =>{
                        const {row, col, isStart, isEnd, isTraversed, isPath, isWall} = tile;

                        return(
                            <Tile 
                                key =  {tileIndex} 
                                row = {tile.row}
                                col = {tile.col}
                                isStart = {isStart}
                                isEnd =  {isEnd}
                                isTraversed = {isTraversed}
                                isPath = {isPath}
                                isWall = {isWall}
                                handleMouseDown = {() =>  handleMouseDown(row, col)}
                                handleMouseUp = {() =>  handleMouseUp(row, col)}
                                handleMouseEnter = {() =>  handleMouseEnter(row, col)}
                            />
                        );
                    })}
                </div>
        ))}

        </div>
    )
}