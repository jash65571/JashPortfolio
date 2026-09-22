import {boards,items,initial,won,trade,solve} from './game.mjs';
const $=id=>document.getElementById(id);
let level=0;
let state=initial(boards[level]);
let history=[];
function render(message,focusIndex=null){
  const board=boards[level], complete=won(board,state);
  $('puzzle-level').textContent=`${String(level+1).padStart(2,'0')} / 03`;
  $('puzzle-title').textContent=board.title;
  $('puzzle-instruction').textContent=board.instruction;
  $('puzzle-moves').textContent=`${history.length} ${history.length===1?'move':'moves'}`;
  $('puzzle-hand').textContent=items[state.hand].name;
  $('puzzle-goal').textContent=items[board.goal].name;
  $('puzzle-neighbors').replaceChildren(...board.neighbors.map((neighbor,index)=>{
    const button=document.createElement('button');
    const held=items[state.neighbors[index]];
    const satisfied=state.neighbors[index]===neighbor.goal;
    const legal=neighbor.accepts.includes(state.hand);
    button.type='button';button.className='neighbor'+(satisfied?' is-satisfied':'');
    button.dataset.neighbor=String(index);
    button.disabled=complete||!legal;
    button.setAttribute('aria-label',`${neighbor.name} has ${held.name}, wants ${items[neighbor.goal].name}. ${satisfied?'Goal reached. ':''}${legal&&!complete?`Trade your ${items[state.hand].name} for ${held.name}.`:`Accepts ${neighbor.accepts.map(x=>items[x].name).join(', ')}.`}`);
    button.innerHTML=`<strong>${neighbor.name}${satisfied?' ✓':''}</strong><span class="neighbor-item" aria-hidden="true">${held.symbol}</span><span class="item-name">${held.name}</span><span class="neighbor-goal">Wants ${items[neighbor.goal].name}</span><span class="trade-label">${complete?'Goal reached':legal?'Tap to trade':'Needs '+neighbor.accepts.map(x=>items[x].name).join(' / ')}</span>`;
    button.addEventListener('click',()=>{
      const next=trade(board,state,index);
      if(!next||won(board,state))return;
      const gave=items[state.hand].name,received=items[next.hand].name;
      history.push(state);state=next;
      const message=won(board,state)?`Everyone has their goal. Solved in ${history.length} ${history.length===1?'move':'moves'}!`:`Gave ${gave} to ${neighbor.name}. Received ${received}.`;
      render(message,index);
    });
    return button;
  }));
  $('puzzle-message').textContent=message||'Choose a neighbor to trade.';
  $('puzzle-undo').disabled=history.length===0;
  $('puzzle-hint').disabled=complete;
  $('puzzle-next').hidden=!complete;
  $('puzzle-next').textContent=level===boards.length-1?'Play again ↻':'Next puzzle →';
  if(focusIndex!==null){
    const target=complete?$('puzzle-next'):$('puzzle-neighbors').querySelector(`[data-neighbor="${focusIndex}"]`);
    if(target&&!target.disabled)target.focus({preventScroll:true});
    else $('puzzle-neighbors').querySelector('button:not(:disabled)')?.focus({preventScroll:true});
  }
}
$('puzzle-undo').addEventListener('click',()=>{if(history.length){state=history.pop();render('Last trade undone.');}});
$('puzzle-reset').addEventListener('click',()=>{state=initial(boards[level]);history=[];render('Puzzle restarted.');});
$('puzzle-hint').addEventListener('click',()=>{
  const path=solve(boards[level],state);
  $('puzzle-message').textContent=path===null?'No solution from this position. Undo a trade or restart.':path.length?`Try trading with ${boards[level].neighbors[path[0]].name}. A shortest solution takes ${path.length} more ${path.length===1?'trade':'trades'}.`:'Everyone already has their goal.';
});
$('puzzle-next').addEventListener('click',()=>{level=(level+1)%boards.length;state=initial(boards[level]);history=[];render('New puzzle. Choose a neighbor to trade.');$('puzzle-neighbors').querySelector('button:not(:disabled)')?.focus({preventScroll:true});});
render();
