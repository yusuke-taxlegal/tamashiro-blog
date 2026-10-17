const I={
hinotes:(s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none"><path d="M26.9474 2L21.8953 7.02585L26.9474 12.0517L31.9995 7.02585L26.9474 2Z" fill="#00838F"/><path d="M25.2654 13.7286L15.1645 23.777L13.755 25.1821L13.209 25.7254C11.5006 27.4249 8.73051 27.4249 7.02211 25.7254L6.47604 25.1791L5.06661 23.777L20.2195 8.7059L25.2685 13.7286H25.2654Z" fill="#00838F"/><path opacity="0.5" d="M5.053 13.7219L0 18.7469L5.05124 23.7736L10.1042 18.7487L5.053 13.7219Z" fill="#00838F"/></svg>`,
google:(s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`,
apple:(s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="#111" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>`,
eye:(s=16)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#718082" stroke-width="2"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.5"/></svg>`,
usb:(s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12l2 5"/><path d="m10 14 5 2 3.5-3.5"/><path d="m18 12 1-1 1 1-1 1Z"/></svg>`,
};
function fill(){document.querySelectorAll('[data-i]').forEach(e=>{const[n,s]=e.dataset.i.split(':');e.outerHTML=I[n](+(s||18))})}
function chrome(url,title){return `<div class="tabbar"><div class="dots"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i></div><div class="tab">${I.hinotes(15)}${title}<span class="x">✕</span></div></div><div class="addr"><div class="navbtns">←&nbsp; →&nbsp; ⟳</div><div class="url"><span class="lock">🔒︎</span>${url}</div></div>`}
function link(a,b,color='#E5484D',dash=false,side='right'){
 const st=document.querySelector('.stage');const s=st.getBoundingClientRect();
 let svg=st.querySelector('svg.links');
 if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','links arrow');svg.style.left=0;svg.style.top=0;svg.setAttribute('width',s.width);svg.setAttribute('height',s.height);st.appendChild(svg)}
 const A=document.getElementById(a).getBoundingClientRect(),B=document.getElementById(b).getBoundingClientRect();
 let x1,y1,x2,y2;
 if(side==='right'){x1=A.left-s.left;y1=A.top+A.height/2-s.top;x2=B.right-s.left+6;y2=B.top+B.height/2-s.top}
 else if(side==='left'){x1=A.right-s.left;y1=A.top+A.height/2-s.top;x2=B.left-s.left-6;y2=B.top+B.height/2-s.top}
 else if(side==='down'){x1=A.left+A.width/2-s.left;y1=A.bottom-s.top;x2=B.left+B.width/2-s.left;y2=B.top-s.top-6}
 else if(side==='up'){x1=A.left+A.width/2-s.left;y1=A.top-s.top;x2=B.left+B.width/2-s.left;y2=B.bottom-s.top+6}
 const mx=(x1+x2)/2;const vertical=side==='down'||side==='up';const my=(y1+y2)/2;
 const d=vertical?`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`:`M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
 svg.insertAdjacentHTML('beforeend',`<path d="${d}" stroke="${color}" stroke-width="3" fill="none" ${dash?'stroke-dasharray="7 6"':''}/><circle cx="${x2}" cy="${y2}" r="5.5" fill="${color}"/>`);
}
function place(n,id,dx,dy){const s=document.querySelector('.stage').getBoundingClientRect(),r=document.getElementById(id).getBoundingClientRect(),e=document.getElementById(n);e.style.left=(r.left-s.left+dx)+'px';e.style.top=(r.top-s.top+dy)+'px'}
/* HiDock P1 本体（公式の正面画像 HiDock_P1_Space_Gray_Front の寸法をもとに描いた図） viewBox 380x1270 */
function p1(h=560,opt={}){const w=h*380/1270;const led=opt.led||'';return `<svg width="${w}" height="${h}" viewBox="0 0 380 1270">
<defs><linearGradient id="dial" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E7178"/><stop offset="1" stop-color="#3E4045"/></linearGradient><clipPath id="p1c"><rect width="380" height="1270" rx="16"/></clipPath><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A6D74"/><stop offset="1" stop-color="#55585E"/></linearGradient></defs><g clip-path="url(#p1c)">
<path d="M14 0h352a14 14 0 0 1 14 14v96H0V14A14 14 0 0 1 14 0z" fill="#4A4C51"/><rect x="38" y="40" width="304" height="58" rx="4" fill="#fff"/>
<rect x="0" y="108" width="380" height="148" rx="6" fill="url(#top)"/>
<text x="92" y="128" font-size="13" fill="#E7E8EA" font-family="Arial" font-weight="700" letter-spacing="1">PUSH-TO-</text><rect x="158" y="117" width="66" height="15" fill="#C9CBCF"/><text x="163" y="129" font-size="12" fill="#55585E" font-family="Arial" font-weight="700">WHISPER</text><text x="242" y="129" font-size="14" fill="#E7E8EA" font-family="Arial">HiNotes</text>
<rect x="30" y="140" width="320" height="36" rx="10" fill="#1F2023"/><rect x="30" y="196" width="320" height="36" rx="10" fill="#1F2023"/>
<rect x="0" y="256" width="380" height="404" fill="#4D4F54"/>
<circle cx="330" cy="310" r="32" fill="#E53935"/><circle cx="330" cy="310" r="32" fill="none" stroke="#B71C1C" stroke-width="2"/>
<circle cx="190" cy="475" r="142" fill="#2E3034"/><circle cx="190" cy="475" r="134" fill="url(#dial)"/>
<rect x="0" y="660" width="380" height="115" fill="#6B6E73"/>
<rect x="0" y="775" width="188" height="165" fill="#4D4F54" stroke="#3A3C40" stroke-width="3"/><path d="M70 862l18 18 34-38" stroke="#9EA1A6" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M114 836l16-16" stroke="#9EA1A6" stroke-width="10" stroke-linecap="round"/>
<rect x="0" y="940" width="188" height="35" fill="#6B6E73"/>
<rect x="0" y="975" width="188" height="295" fill="#4D4F54" stroke="#3A3C40" stroke-width="3"/><path d="M78 1100c0 40 30 70 70 70l8-14-20-16-12 10c-14-6-24-16-30-30l10-12-16-20z" fill="#9EA1A6"/>
<rect x="190" y="775" width="190" height="325" fill="#4D4F54" stroke="#3A3C40" stroke-width="3"/><path d="M270 905a15 15 0 0 1 30 0v30a15 15 0 0 1-30 0z M255 935a30 30 0 0 0 60 0 M285 965v14 M262 960l48-58" stroke="#9EA1A6" stroke-width="8" fill="none" stroke-linecap="round"/>
<rect x="190" y="1100" width="190" height="170" fill="#4D4F54" stroke="#3A3C40" stroke-width="3"/><g fill="#9EA1A6"><circle cx="268" cy="1172" r="12"/><rect x="262" y="1172" width="9" height="34" rx="4"/><circle cx="302" cy="1172" r="12"/><rect x="299" y="1172" width="9" height="34" rx="4"/></g>
</g>${led}</svg>`}
const SV={
home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
note:'<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 9h6M9 13h4"/>',
tr:'<path d="M4 6h9M8.5 4v2c0 4-2 7-4.5 9M6 10c1 2 3 4 6 5"/><path d="m13 20 3.5-8 3.5 8M14.2 17.5h4.6"/>',
vm:'<rect x="4.5" y="4.5" width="15" height="15" rx="4"/><path d="M9 10v4M12 8.5v7M15 10.5v3"/>',
todo:'<path d="M9 7h11M9 12h11M9 17h11"/><path d="m3.5 7 1.2 1.2L7 6M3.5 12l1.2 1.2L7 11M3.5 17l1.2 1.2L7 16"/>',
dev:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><circle cx="12" cy="10" r="2.6"/><path d="M9.5 16h5"/>',
swap:'<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
user:'<circle cx="12" cy="9" r="3.5"/><path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"/>',
};
function sv(n,s=18,c='currentColor',w=1.7){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${SV[n]}</svg>`}
function rail(on,opt={}){const it=(k,l)=>`<div class="ri ${on===k?'on':''}"><div class="ic">${sv(k,19)}</div>${l}</div>`;
 const dev=`<div class="ri ${on==='devp1'?'on':''}" id="${opt.devId||'railp1'}"><div class="ic" style="position:relative">${sv('dev',19)}<span style="position:absolute;right:3px;bottom:3px;width:8px;height:8px;border-radius:50%;background:#2EAE5A;border:1.5px solid #fff"></span></div>P1</div>`;
 return `<div class="rail"><div style="margin-bottom:10px">${I.hinotes(26)}</div>${it('home','ホーム')}${it('note','ノート')}${it('tr','翻訳')}${it('vm','ボイスメモ')}${it('todo','To-Do')}<div class="sep"></div>${opt.nodev?'':dev}<div class="bot">${opt.swap?`<div style="width:30px;height:30px;border-radius:7px;background:#d6eef1;display:flex;align-items:center;justify-content:center;color:#2b5d63">${sv('swap',17)}</div>`:''}<div class="plus" id="${opt.plusId||'plus'}">+</div><div class="ava">${sv('user',18,'#5f7275')}</div></div></div>`}
