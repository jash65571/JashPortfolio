// A small, public portfolio adaptation of three ONE FAVOR starter boards.
// The full game's rules and campaign remain in their own repository.
export const boards = [
  { title: 'Hello, Neighbor', instruction: 'Give Bread. Get Key.', start: 'bread', goal: 'key', neighbors: [{id:'ada',name:'Ada',start:'key',goal:'bread',accepts:['bread']}] },
  { title: 'Pass It On', instruction: 'Each trade gives you something new.', start: 'key', goal: 'mug', neighbors: [{id:'ada',name:'Ada',start:'bread',goal:'key',accepts:['key']},{id:'bo',name:'Bo',start:'mug',goal:'bread',accepts:['bread']}] },
  { title: 'A Small Circle', instruction: 'You have your Plant. Lend it to help your neighbors, then bring it home.', start: 'plant', goal: 'plant', neighbors: [{id:'ada',name:'Ada',start:'coin',goal:'mug',accepts:['coin','mug','plant']},{id:'bo',name:'Bo',start:'mug',goal:'coin',accepts:['mug','plant','coin']}] },
];
export const items = {bread:{name:'Bread',symbol:'🍞'},key:{name:'Key',symbol:'🔑'},mug:{name:'Mug',symbol:'☕'},plant:{name:'Plant',symbol:'🪴'},coin:{name:'Coin',symbol:'🪙'}};
export const initial = board => ({hand:board.start,neighbors:board.neighbors.map(n=>n.start)});
export const won = (board,state) => state.hand === board.goal && board.neighbors.every((n,i)=>state.neighbors[i]===n.goal);
export function trade(board,state,index) {
  const neighbor=board.neighbors[index];
  if (!neighbor || !neighbor.accepts.includes(state.hand)) return null;
  const next={hand:state.neighbors[index],neighbors:[...state.neighbors]};
  next.neighbors[index]=state.hand;
  return next;
}
export function solve(board,start) {
  const key=s=>[s.hand,...s.neighbors].join('|');
  const queue=[{state:start,path:[]}];
  const seen=new Set([key(start)]);
  for(let head=0;head<queue.length;head++){
    const {state,path}=queue[head];
    if(won(board,state)) return path;
    board.neighbors.forEach((n,i)=>{
      const next=trade(board,state,i);
      if(next&&!seen.has(key(next))){seen.add(key(next));queue.push({state:next,path:[...path,i]});}
    });
  }
  return null;
}
