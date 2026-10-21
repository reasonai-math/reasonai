/* Optional student evidence. Drawings are NOT interpreted by the rule engine. */
window.ReasonAIScratchpad=(()=>{
let active=null;
function mount(host,textarea){if(!host||!textarea)return;
 host.innerHTML=`<section class="scratch-widget" aria-label="Math reasoning tools"><div class="scratch-head"><b>Math symbols & visual scratchpad</b><span>Optional drawing evidence</span></div><div class="scratch-symbols" role="group" aria-label="Insert math symbol"></div><div class="scratch-tools"><button type="button" data-tool="pen" class="selected">✏ Pen</button><button type="button" data-tool="eraser">Eraser</button><button type="button" data-action="undo">↶ Undo</button><button type="button" data-action="clear">Clear</button></div><canvas aria-label="Draw your mathematical working" class="scratch-canvas"></canvas><p class="scratch-caption">Your drawing is saved as supporting evidence for teacher review; automated reasoning analysis reads your written explanation only.</p></section>`;
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');let strokes=[],current=null,tool='pen',pointer=null;
 const redraw=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);for(const s of [...strokes,...(current?[current]:[])]){if(!s.points.length)continue;ctx.beginPath();ctx.strokeStyle=s.tool==='eraser'?'#fff':'#173c60';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=s.tool==='eraser'?22:2.5;ctx.lineCap='round';ctx.lineJoin='round';s.points.forEach((p,i)=>i?ctx.lineTo(p.x*w,p.y*h):ctx.moveTo(p.x*w,p.y*h));if(s.points.length===1){const p=s.points[0];ctx.arc(p.x*w,p.y*h,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();}else ctx.stroke();}};
 const resize=()=>{const r=canvas.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,2);if(!r.width||!r.height)return;canvas.width=Math.round(r.width*scale);canvas.height=Math.round(r.height*scale);ctx.setTransform(scale,0,0,scale,0,0);redraw();};
 const point=e=>{const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointer=e.pointerId;current={tool,points:[point(e)]};canvas.setPointerCapture(pointer);redraw();});
 canvas.addEventListener('pointermove',e=>{if(pointer!==e.pointerId||!current)return;current.points.push(point(e));redraw();});
 const finish=e=>{if(pointer!==e.pointerId)return;if(current)strokes.push(current);current=null;pointer=null;redraw();};
 canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
 host.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.tool;host.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('selected',x===b));}));
 host.querySelector('[data-action="undo"]').addEventListener('click',()=>{if(current){strokes.push(current);current=null;pointer=null;}strokes.pop();redraw();});
 host.querySelector('[data-action="clear"]').addEventListener('click',()=>{strokes=[];current=null;pointer=null;redraw();});
 for(const symbol of ['3/4','5/8','>','<','=','≥','≤','÷','×','x','y','n']){const b=document.createElement('button');b.type='button';b.textContent=symbol;b.setAttribute('aria-label','Insert '+symbol);b.addEventListener('pointerdown',e=>e.preventDefault());b.addEventListener('click',()=>{textarea.setRangeText(symbol,textarea.selectionStart,textarea.selectionEnd,'end');textarea.focus();textarea.dispatchEvent(new Event('input',{bubbles:true}));});host.querySelector('.scratch-symbols').appendChild(b);}
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();active={host,capture:()=>strokes.length?{dataUrl:canvas.toDataURL('image/png'),strokeCount:strokes.length}:null};
 }
 return {mount,capture:()=>active?.host?.isConnected?active.capture():null};
})();
