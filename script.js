(() => {
const body=document.body,toggle=document.getElementById('menuToggle'),nav=document.getElementById('nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}))}
const progress=document.querySelector('.scroll-progress span');let ticking=false;const update=()=>{if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'}ticking=false};addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,items=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!reduce){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});items.forEach(x=>observer.observe(x))}else items.forEach(x=>x.classList.add('visible'));
const glow=document.querySelector('.cursor-glow');if(glow&&matchMedia('(hover:hover) and (pointer:fine)').matches){body.classList.add('has-pointer');let x=-500,y=-500,gx=-500,gy=-500;addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY},{passive:true});const follow=()=>{gx+=(x-gx)*.12;gy+=(y-gy)*.12;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(follow)};requestAnimationFrame(follow)}

const cinema=document.querySelector('.cinema-scroll'),canvas=document.getElementById('cinemaCanvas');
if(cinema&&canvas){
const ctx=canvas.getContext('2d'),copies=[...cinema.querySelectorAll('.cinema-copy')],label=document.getElementById('cinemaFrame'),bar=cinema.querySelector('.cinema-scrollline span');
let w=0,h=0,t=0,target=0,raf=0,last=0;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const palettes=[['#e0eaff','#647bff','#111b52','#070a20'],['#b5fff4','#21b7bd','#103b50','#04141e'],['#f5d4ff','#ac55df','#42185d','#14091f']];
function planet(i,x,y,r,a,phase){if(a<.005)return;const p=palettes[i];ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);
let g=ctx.createRadialGradient(0,0,r*.7,0,0,r*1.8);g.addColorStop(0,p[1]+'77');g.addColorStop(1,p[1]+'00');ctx.fillStyle=g;ctx.fillRect(-r*2,-r*2,r*4,r*4);
ctx.save();ctx.rotate(-.35+i*.5);ctx.scale(1,.32+i*.09);for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(0,0,r*(1.25+k*.13),0,Math.PI*2);ctx.strokeStyle=p[1]+'88';ctx.lineWidth=1+k*.5;ctx.stroke()}ctx.restore();
ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.clip();g=ctx.createRadialGradient(-r*.38,-r*.45,r*.03,0,0,r*1.1);p.forEach((c,k)=>g.addColorStop([0,.3,.65,1][k],c));ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);
for(let k=0;k<18;k++){ctx.beginPath();let yy=(k/17*2-1)*r;ctx.ellipse(Math.sin(k*2+phase)*r*.13,yy,r*(.7+.2*Math.sin(k)),r*.09,.12*Math.sin(k+i),0,Math.PI*2);ctx.strokeStyle=p[0]+(i===1?'33':'18');ctx.lineWidth=i===2?4:1.5;ctx.stroke()}
if(i===1){for(let k=0;k<24;k++){let xx=Math.sin(k*31+phase)*r,yy=Math.cos(k*19)*r;ctx.fillStyle=p[0]+'99';ctx.fillRect(xx,yy,2,2)}}ctx.restore();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle=p[0]+'66';ctx.lineWidth=1.5;ctx.stroke();ctx.restore()}
function draw(){if(!w||!h)return;ctx.clearRect(0,0,w,h);const mobile=w<700,cx=w*(mobile?.55:.73),cy=h*(mobile?.35:.52),r=Math.min(w,h)*(mobile?.28:.26),v=t*2;
const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.8);bg.addColorStop(0,'#211a49');bg.addColorStop(1,'#03040e');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
for(let k=0;k<160;k++){const x=((k*7919)%997)/997*w,y=(((k*3571)%991)/991*h+t*(k%3+1)*35)%h;ctx.fillStyle=k%7===0?'#a9bfff':'#797fa866';ctx.fillRect(x,y,k%7===0?2:1,k%7===0?2:1)}
copies.forEach((el,i)=>{const d=v-i,abs=Math.abs(d),a=1-ease((abs-.12)/.82);planet(i,cx+d*w*.32,cy+d*h*.36,r*(1-.22*Math.min(1,abs)),a,t*3);const visible=a>.55;el.style.opacity=String(a);el.style.transform='translateY('+((mobile?0:-50)+d*18)+'%)';el.style.pointerEvents=visible?'auto':'none';el.inert=!visible;el.setAttribute('aria-hidden',String(!visible))});label.textContent='0'+(Math.round(v)+1);bar.style.width=t*100+'%'}
function measure(){const box=cinema.getBoundingClientRect(),sticky=cinema.querySelector('.cinema-sticky');target=clamp((parseFloat(getComputedStyle(sticky).top)||0)-box.top >0?((parseFloat(getComputedStyle(sticky).top)||0)-box.top)/Math.max(1,cinema.offsetHeight-sticky.offsetHeight):0);if(!raf&&!reduce)raf=requestAnimationFrame(tick)}
function tick(now){raf=0;const dt=last?Math.min(50,now-last):16;last=now;t+=(target-t)*(1-Math.exp(-dt/85));if(Math.abs(target-t)<.0003)t=target;draw();if(t!==target)raf=requestAnimationFrame(tick);else last=0}
function resize(){const b=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);w=b.width;h=b.height;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);measure();t=target;if(!reduce)draw()}
addEventListener('scroll',measure,{passive:true});addEventListener('resize',resize);resize();
}
})();