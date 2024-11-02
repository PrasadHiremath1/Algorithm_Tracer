import { MutableRefObject, useState } from 'react'
import { Select } from './Select'
import { usePathFinding } from '../hooks/usePathFinding'
import { EXTENDED_SLEEP_TIME, MAZES, PATHFINDING_ALGORITHMS, SLEEP_TIME, SPEEDS } from '../utils/constants';
import { AlgorithmType, MazeType, SpeedType } from '../utils/types';
import { resetGrid } from '../utils/resetGrid';
import { useTile } from '../hooks/useTile';
import { runMazeAlgorithm } from '../utils/runMazeAlgorithm';
import { useSpeed } from '../hooks/useSpeed';
import { PlayButton } from './PlayButton';
import { runPathfindingAlgorithm } from '../utils/runPathfindingAlgorithm';
import { animatePath } from '../utils/animatePath';

const Nav = ({isVisualizationRunningRef}: {isVisualizationRunningRef: MutableRefObject<boolean>}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const {maze, setMaze, grid, setGrid,isGraphVisualized, setIsGraphVisualized, algorithm, setAlgorithm} = usePathFinding();
  const {startTile, endTile} = useTile()
  const {speed, setSpeed} = useSpeed();


  const handleRunVisualizer = () => {
    if(isGraphVisualized){
      setIsGraphVisualized(false);
      resetGrid({grid: grid.slice(), startTile, endTile})
      return 
    }

    //run the algorithm
    const {traversedTiles, path} = runPathfindingAlgorithm({
      algorithm, 
      grid, 
      startTile, 
      endTile
    })

    // console.log('traversed tiles', traversedTiles)
    // console.log('path', path)
    animatePath(traversedTiles, path, startTile, endTile, speed)
    setIsDisabled(true);
    isVisualizationRunningRef.current = true;
    setTimeout(()=>{
      const newGrid = grid.slice();
      setGrid(newGrid)
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisualizationRunningRef.current = false;
    }, (SLEEP_TIME * (traversedTiles.length + SLEEP_TIME * 2) + EXTENDED_SLEEP_TIME * (path.length + 60) * SPEEDS.find((s)=> s.value  === speed)!.value))

  } 

  const handleGenerateMaze = (maze: MazeType) => {
    if(maze === "NONE"){
      setMaze(maze)
      // reset grid
      resetGrid({grid, startTile, endTile})
      return;
    }
    
    setMaze(maze);
    setIsDisabled(true)
    runMazeAlgorithm({
      maze, grid, startTile, endTile, setIsDisabled, speed
    })
    const newGrid = grid.slice();
    setGrid(newGrid)
    setIsGraphVisualized(false);
  }

  return (
    <div className='flex items-center justify-center min-h-[4.5rem] border-b shadow-gray-600 sm:px-5 px-0 '>
        <div className='flex items-center lg:justify-between justify-center w-full sm:w-[52rem]' >
            <h1 className='lg:flex hidden w-[40%] text-2xl pl-1'>
              ALGORITHM TRACER 
            </h1>
            <div className='flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4'>
              <Select 
                label="Maze"
                value={maze}
                options={MAZES}
                onChange={(e)=>{
                  //handle generating maze
                  handleGenerateMaze(e.target.value as MazeType)
                }}
                isDisabled={isDisabled}
              />
              <Select
                label='Graph'
                value={algorithm}
                options={PATHFINDING_ALGORITHMS}
                onChange={(e)=>{
                  setAlgorithm(e.target.value as AlgorithmType)
                }}
                isDisabled={isDisabled}

              />
              <Select 
                label="Speed"
                value={speed}
                options={SPEEDS}
                onChange={(e)=> {
                  setSpeed(parseInt(e.target.value) as SpeedType)
                }}
                isDisabled={isDisabled}

              />
              <PlayButton 
                isDisabled = {isDisabled}
                isGraphVisualized = {isGraphVisualized}
                handleRunVisualizer= {handleRunVisualizer}
              />
            </div>
        </div>
    </div>
  )
}

export default Nav