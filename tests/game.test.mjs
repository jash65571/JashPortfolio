import test from 'node:test';
import assert from 'node:assert/strict';
import {boards,initial,trade,won,solve} from '../assets/game.mjs';

test('each original starter board has its expected shortest solution length',()=>{
  boards.forEach((board,i)=>{
    const path=solve(board,initial(board));
    assert.equal(path.length,[1,2,3][i]);
    const end=path.reduce((state,index)=>trade(board,state,index),initial(board));
    assert.ok(won(board,end));
  });
});
test('invalid trades do not mutate the board or holdings',()=>{
  const board=boards[1],state=initial(board),before=structuredClone(state);
  assert.equal(trade(board,state,1),null);
  assert.deepEqual(state,before);
  assert.equal(trade(board,state,99),null);
});
test('having the player goal is not enough to win the circular puzzle',()=>{
  const board=boards[2],state=initial(board);
  assert.equal(state.hand,board.goal);
  assert.equal(won(board,state),false);
  const path=[0,1,0];
  assert.equal(won(board,path.reduce((s,i)=>trade(board,s,i),state)),true);
});
test('hints find a solution from every reachable state, including detours',()=>{
  for(const board of boards){
    const queue=[initial(board)],seen=new Set();
    for(let head=0;head<queue.length;head++){
      const state=queue[head],key=JSON.stringify(state);
      if(seen.has(key))continue;
      seen.add(key);
      const path=solve(board,state);
      assert.notEqual(path,null);
      assert.ok(won(board,path.reduce((s,i)=>trade(board,s,i),state)));
      board.neighbors.forEach((n,i)=>{const next=trade(board,state,i);if(next)queue.push(next)});
    }
  }
});
test('trade snapshots preserve item counts and prior states for undo',()=>{
  const board=boards[2],state=initial(board),before=structuredClone(state);
  const next=trade(board,state,0);
  assert.deepEqual(state,before);
  assert.deepEqual([state.hand,...state.neighbors].sort(),[next.hand,...next.neighbors].sort());
  assert.notEqual(state.neighbors,next.neighbors);
});
