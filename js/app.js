/* Catalogue. Wall placement (l, t, w) is a percentage of the shop stage; items without wall are kept in the plan chest. */


(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var stage=$("#stage"), pieces=$("#wallPieces");
  var byId={}; ITEMS.forEach(function(it,i){it.i=i;byId[it.id]=it});
  var lastFocus=null;

  /* wall */
  var VIEWS=[
    {name:"The Harbour Wall",rows:[{t:9.5,x0:31,x1:97,ids:["zeeslagh","world","leurope","speed"]},{t:31.5,x0:31,x1:84,ids:["canada","tallis","selkirk","shells"]}]},
    {name:"The Chart Wall",rows:[{t:9,x0:8,x1:92,ids:["bellin","sanson-brit","macedonia","berey","honter"]},{t:32,x0:8,x1:92,ids:["alexandrie","anholt","zatta","sandpiper"]}]},
    {name:"The Hearth Wall",rows:[{t:10,x0:38,x1:62,rh:13.5,ids:["novascotia"]},{t:9,x0:6,x1:33,ids:["australia-misc","europe-misc"]},{t:32,x0:6,x1:33,ids:["namerica-misc","wwii"]},{t:9,x0:67,x1:94,ids:["fulton","leo"]},{t:32,x0:67,x1:94,ids:["kent-wallis","pineapple"]}]}
  ];
  var RH=16, FR=1.6;
  VIEWS.forEach(function(vw,vi){
    var host=document.querySelector('[data-pieces="'+vi+'"]');
    vw.rows.forEach(function(row){
      var items=row.ids.map(function(id){return byId[id]});
      var n=items.length, span=row.x1-row.x0;
      var sum=items.reduce(function(a,it){return a+it.ar*0.5625},0);
      var rh=Math.min(row.rh||RH,(span-FR*n-2*(n-1))/sum);
      var ws=items.map(function(it){return rh*it.ar*0.5625+FR});
      var tot=ws.reduce(function(a,b){return a+b},0);
      var gap=n>1?(span-tot)/(n-1):0, x=n>1?row.x0:row.x0+(span-tot)/2;
      items.forEach(function(it,k){
        it.onWall=true; it.view=vi;
        var b=document.createElement("button"); b.type="button"; b.className="piece"; it.el=b;
        b.style.left=x+"%"; b.style.top=row.t+"%"; b.style.width=ws[k]+"%"; x+=ws[k]+gap;
        b.setAttribute("aria-label","Examine "+it.title+", "+it.year);
        var im=document.createElement("img"); im.src=it.img; im.alt=""; im.draggable=false; im.loading="lazy";
        var tg=document.createElement("span"); tg.className="tag"; tg.textContent=it.title.length>46?it.title.slice(0,44)+"…":it.title;
        b.appendChild(im); b.appendChild(tg);
        b.addEventListener("click",function(){openExamine(it.i,b)});
        host.appendChild(b);
      });
    });
  });

  /* room backgrounds: planked oak, beams, panelling, lamplight */
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function buildBg(el,v){
    var r=rng(v*977+13), id="g"+v, o="";
    o+='<svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"><defs>'
     +'<filter id="'+id+'" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.2" numOctaves="3" seed="'+(v+3)+'"/><feColorMatrix values="0 0 0 0 .04 0 0 0 0 .02 0 0 0 0 .01 2.4 0 0 0 -.85"/></filter>'
     +'<filter id="'+id+'f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.7" numOctaves="2" seed="'+(v+11)+'"/><feColorMatrix values="0 0 0 0 .05 0 0 0 0 .03 0 0 0 0 .01 1.8 0 0 0 -.6"/></filter>'
     +'<linearGradient id="'+id+'p" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>'
     +'<linearGradient id="'+id+'s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>'
     +'<linearGradient id="'+id+'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a3c"/><stop offset=".12" stop-color="#5b4029"/><stop offset="1" stop-color="#2a1c11"/></linearGradient>'
     +'<radialGradient id="'+id+'w" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf86" stop-opacity=".42"/><stop offset="1" stop-color="#ffcf86" stop-opacity="0"/></radialGradient>'
     +'<radialGradient id="'+id+'c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9fc4d8" stop-opacity=".30"/><stop offset="1" stop-color="#9fc4d8" stop-opacity="0"/></radialGradient>'
     +'</defs>';
    // ceiling and joists
    o+='<rect width="1600" height="80" fill="#140d08"/>';
    for(var j=0;j<1600;j+=100+r()*40){o+='<rect x="'+j+'" y="0" width="5" height="80" fill="#050302" opacity=".6"/>';}
    o+='<rect width="1600" height="80" filter="url(#'+id+'f)" opacity=".6"/>';
    // planked wall 80..594
    var x=0;
    while(x<1600){
      var w=62+r()*46, k=r(), col="rgb("+(50+k*26|0)+","+(33+k*17|0)+","+(19+k*11|0)+")";
      o+='<rect x="'+x.toFixed(1)+'" y="80" width="'+(w+1).toFixed(1)+'" height="514" fill="'+col+'"/>';
      o+='<rect x="'+x.toFixed(1)+'" y="80" width="'+(w+1).toFixed(1)+'" height="514" fill="url(#'+id+'p)"/>';
      o+='<rect x="'+(x+w-2).toFixed(1)+'" y="80" width="3" height="514" fill="#0b0704" opacity=".85"/>';
      o+='<rect x="'+(x+w+1).toFixed(1)+'" y="80" width="1.2" height="514" fill="#ffdca0" opacity=".07"/>';
      if(r()<.28){var cy=120+r()*440, cx=x+w*(.25+r()*.5); o+='<ellipse cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" rx="7" ry="16" fill="#1a0f07" opacity=".55"/><ellipse cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" rx="11" ry="24" fill="none" stroke="#1a0f07" stroke-width="1.6" opacity=".4"/>';}
      x+=w;
    }
    o+='<rect y="80" width="1600" height="514" filter="url(#'+id+')" opacity=".75"/>';
    // dado rail and panelled lower wall
    o+='<rect y="594" width="1600" height="36" fill="url(#'+id+'r)"/><rect y="594" width="1600" height="3" fill="#caa468" opacity=".35"/><rect y="628" width="1600" height="3" fill="#0b0704"/>';
    o+='<rect y="630" width="1600" height="270" fill="#2a1b10"/>';
    for(var p=24;p<1580;p+=200){o+='<rect x="'+p+'" y="656" width="176" height="200" fill="#33231a"/><path d="M'+p+' 856 V656 H'+(p+176)+'" fill="none" stroke="#0a0604" stroke-width="3" opacity=".8"/><path d="M'+(p+176)+' 656 V856 H'+p+'" fill="none" stroke="#c9a060" stroke-width="2" opacity=".12"/><rect x="'+(p+16)+'" y="672" width="144" height="168" fill="none" stroke="#0a0604" stroke-width="2" opacity=".5"/>';}
    o+='<rect y="630" width="1600" height="270" filter="url(#'+id+')" opacity=".7"/>';
    o+='<rect y="868" width="1600" height="32" fill="#150d07"/><rect y="866" width="1600" height="3" fill="#6b4a2a" opacity=".5"/>';
    // beam shadow and posts
    o+='<rect y="80" width="1600" height="120" fill="url(#'+id+'s)"/>';
    o+='<rect width="1600" height="82" fill="none"/><rect y="78" width="1600" height="6" fill="#050302" opacity=".7"/>';
    [0,1566].forEach(function(px){
      o+='<rect x="'+px+'" y="0" width="34" height="900" fill="#1d130b"/><rect x="'+px+'" y="0" width="34" height="900" filter="url(#'+id+'f)" opacity=".8"/><rect x="'+(px?px:30)+'" y="0" width="4" height="900" fill="#000" opacity=".5"/>';
    });
    // lamplight per wall
    if(v===0){o+='<ellipse cx="260" cy="360" rx="720" ry="560" fill="url(#'+id+'c)" style="mix-blend-mode:screen"/><ellipse cx="1420" cy="600" rx="420" ry="360" fill="url(#'+id+'w)" style="mix-blend-mode:screen"/>';}
    if(v===1){o+='<ellipse cx="90" cy="320" rx="520" ry="520" fill="url(#'+id+'w)" style="mix-blend-mode:screen"/><ellipse cx="1510" cy="320" rx="520" ry="520" fill="url(#'+id+'w)" style="mix-blend-mode:screen"/>';}
    if(v===2){o+='<ellipse cx="800" cy="640" rx="760" ry="520" fill="url(#'+id+'w)" style="mix-blend-mode:screen"/>';}
    o+='</svg>';
    el.innerHTML=o;
  }
  document.querySelectorAll("[data-bg]").forEach(function(el){buildBg(el,+el.getAttribute("data-bg"))});

  /* furniture for the chart wall, hearth for the hearth wall */
  (function(){
    var f='';
    // barrel left
    f+='<g transform="translate(50 60)"><ellipse cx="80" cy="196" rx="76" ry="12" fill="rgba(0,0,0,.5)"/><path d="M10 30 Q-6 110 10 190 H150 Q166 110 150 30Z" fill="#4a3220"/><path d="M10 30 Q-6 110 10 190 H150 Q166 110 150 30Z" fill="url(#bar)"/><ellipse cx="80" cy="30" rx="70" ry="12" fill="#5b4029"/><ellipse cx="80" cy="30" rx="62" ry="9" fill="#33231a"/>';
    [64,120,168].forEach(function(y){f+='<path d="M'+(4+(y<100?6:0))+' '+y+' Q80 '+(y+14)+' '+(156-(y<100?6:0))+' '+y+'" fill="none" stroke="#1a1410" stroke-width="7"/>';});
    f+='</g>';
    // sea chest 1
    f+='<g transform="translate(250 100)"><ellipse cx="190" cy="154" rx="196" ry="12" fill="rgba(0,0,0,.5)"/><rect x="0" y="50" width="380" height="100" fill="#3a2614"/><path d="M0 50 Q190 -30 380 50Z" fill="#4a3220"/><rect x="0" y="50" width="380" height="100" fill="url(#bar)"/><g fill="#8a6a2c"><rect x="28" y="20" width="14" height="130"/><rect x="338" y="20" width="14" height="130"/><rect x="183" y="12" width="14" height="138"/></g><rect x="170" y="70" width="40" height="34" rx="3" fill="#c39a45"/><circle cx="190" cy="86" r="5" fill="#2a1c11"/></g>';
    // map table centre
    f+='<g transform="translate(640 50)"><ellipse cx="160" cy="206" rx="190" ry="12" fill="rgba(0,0,0,.5)"/><rect x="-10" y="92" width="340" height="18" fill="#6a4a2b"/><rect x="0" y="110" width="14" height="96" fill="#3a2614"/><rect x="306" y="110" width="14" height="96" fill="#3a2614"/><rect x="0" y="150" width="320" height="8" fill="#2a1c11"/>';
    f+='<path d="M10 90 L40 40 H300 L320 92Z" fill="#e3d2a2"/><path d="M40 40 H300 L292 46 H48Z" fill="#fff" opacity=".25"/><g stroke="#7a5a2c" stroke-width="1.5" fill="none" opacity=".75"><path d="M80 70 Q130 52 170 66 T260 60"/><path d="M60 84 Q110 74 150 82 T280 80"/><circle cx="230" cy="64" r="14"/><path d="M230 52 V76 M218 64 H242"/></g>';
    f+='<path d="M10 90 Q0 96 18 98 L318 98 Q336 94 322 90Z" fill="#c9b27a"/><ellipse cx="40" cy="62" rx="12" ry="22" fill="#cdb67f" transform="rotate(-8 40 62)"/><g transform="translate(120 58) rotate(22)" fill="none" stroke="#c39a45" stroke-width="3.5" stroke-linecap="round"><path d="M0 0 L-10 36 M0 0 L12 34"/><circle cx="0" cy="0" r="5" fill="#8a6a2c"/></g></g>';
    // sea chest 2 + rolled charts
    f+='<g transform="translate(1060 120)"><ellipse cx="150" cy="134" rx="156" ry="11" fill="rgba(0,0,0,.5)"/><rect x="0" y="44" width="300" height="86" fill="#3a2614"/><path d="M0 44 Q150 -22 300 44Z" fill="#4a3220"/><rect x="0" y="44" width="300" height="86" fill="url(#bar)"/><g fill="#8a6a2c"><rect x="24" y="16" width="12" height="114"/><rect x="264" y="16" width="12" height="114"/></g><rect x="130" y="62" width="40" height="32" rx="3" fill="#c39a45"/></g>';
    f+='<g transform="translate(1410 70)"><ellipse cx="60" cy="186" rx="64" ry="10" fill="rgba(0,0,0,.5)"/><path d="M6 60 Q-2 120 8 184 H112 Q122 120 114 60Z" fill="#33231a"/><path d="M6 60 Q-2 120 8 184 H112 Q122 120 114 60Z" fill="url(#bar)"/><ellipse cx="60" cy="60" rx="54" ry="9" fill="#1a1410"/>';
    [[22,0,-6],[44,-14,2],[70,-8,8],[92,4,14]].forEach(function(t){f+='<rect x="'+t[0]+'" y="'+(10+t[1])+'" width="14" height="70" rx="7" fill="#d9c595" transform="rotate('+t[2]+' '+(t[0]+7)+' 70)"/><rect x="'+t[0]+'" y="'+(10+t[1])+'" width="14" height="10" rx="5" fill="#b39a62" transform="rotate('+t[2]+' '+(t[0]+7)+' 70)"/>';});
    f+='</g>';
    var defs='<defs><linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>';
    document.getElementById("furn1").innerHTML=defs+f;

    var r=rng(77), h='<defs><linearGradient id="hg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".15" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient><radialGradient id="hi" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="#ffb04a"/><stop offset=".5" stop-color="#7a2c0c"/><stop offset="1" stop-color="#1a0a04"/></radialGradient><filter id="hn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.4 0 0 0 -.5"/></filter></defs>';
    // stone surround
    var rows=[[0,40],[40,96],[96,152],[152,208],[208,264],[264,320],[320,376],[376,432],[432,488],[488,544],[544,600],[600,656]];
    h+='<rect x="0" y="40" width="448" height="616" fill="#2a2420"/>';
    rows.slice(1).forEach(function(rw,ri){var x=-(r()*40);while(x<448){var w=50+r()*44,k=r(),c="rgb("+(70+k*34|0)+","+(62+k*28|0)+","+(54+k*22|0)+")";h+='<rect x="'+x.toFixed(1)+'" y="'+rw[0]+'" width="'+(w-3).toFixed(1)+'" height="'+(rw[1]-rw[0]-3)+'" rx="3" fill="'+c+'"/>';x+=w;}});
    h+='<rect y="40" width="448" height="616" filter="url(#hn)" opacity=".5"/><rect y="40" width="448" height="616" fill="url(#hg)"/>';
    // mantel beam
    h+='<rect x="-14" y="0" width="476" height="44" fill="#2b1c10"/><rect x="-14" y="0" width="476" height="6" fill="#8a6a3c" opacity=".5"/><rect x="-14" y="38" width="476" height="8" fill="#0a0604" opacity=".7"/>';
    // opening
    h+='<path d="M92 600 V250 Q92 190 224 190 Q356 190 356 250 V600Z" fill="#0c0705"/><path d="M92 600 V250 Q92 190 224 190 Q356 190 356 250 V600Z" fill="url(#hi)" opacity=".85"/>';
    h+='<path d="M80 612 V250 Q80 178 224 178 Q368 178 368 250 V612" fill="none" stroke="#1a1410" stroke-width="14"/>';
    // hearthstone
    h+='<rect x="40" y="598" width="368" height="58" fill="#3b332c"/><rect x="40" y="598" width="368" height="5" fill="#8a7a66" opacity=".4"/>';
    // logs and fire
    h+='<g><rect x="120" y="560" width="210" height="30" rx="14" fill="#2b1a0e"/><rect x="140" y="534" width="180" height="28" rx="13" fill="#3a2410" transform="rotate(-6 230 548)"/><circle cx="124" cy="575" r="12" fill="#5a3a1c"/><circle cx="326" cy="575" r="12" fill="#5a3a1c"/></g>';
    h+='<g class="fl c"><path d="M170 556 Q150 480 196 430 Q190 480 214 500 Q222 450 256 410 Q262 470 282 500 Q300 470 292 440 Q326 490 300 556Z" fill="#e04e12"/></g><g class="fl"><path d="M190 556 Q176 500 212 462 Q214 496 232 508 Q240 470 262 446 Q272 490 286 512 Q296 540 280 556Z" fill="#ff9a2a"/></g><g class="fl b"><path d="M212 556 Q204 520 228 494 Q232 518 246 528 Q256 506 266 498 Q270 530 262 556Z" fill="#ffe08a"/></g>';
    // andirons
    h+='<g fill="#0d0b0a"><rect x="104" y="548" width="10" height="52"/><rect x="334" y="548" width="10" height="52"/><circle cx="109" cy="544" r="7"/><circle cx="339" cy="544" r="7"/></g>';
    // crane and kettle
    h+='<g stroke="#0d0b0a" stroke-width="6" fill="none"><path d="M104 230 V420 M104 240 H216"/></g><path d="M214 244 V300" stroke="#0d0b0a" stroke-width="3"/><g transform="translate(188 296)"><path d="M0 24 Q-2 60 22 62 Q46 60 44 24Z" fill="#a8602a"/><ellipse cx="22" cy="24" rx="22" ry="7" fill="#c47a3a"/><path d="M42 30 Q64 24 62 44" stroke="#a8602a" stroke-width="5" fill="none"/></g>';
    document.getElementById("hearth").innerHTML=h;
  })();

  /* motes in the window light */
  (function(){
    var m=document.getElementById("motes"),r=rng(5);
    for(var i=0;i<16;i++){var d=document.createElement("i"); d.className="mote"; d.style.left=(8+r()*38)+"%"; d.style.top=(16+r()*34)+"%"; d.style.animationDelay=(-r()*14)+"s"; d.style.animationDuration=(10+r()*10)+"s"; d.style.setProperty("--dx",(2+r()*4)+"cqw"); d.style.setProperty("--dy",(3+r()*6)+"cqw"); m.appendChild(d);}
  })();

  /* turning between walls */
  var curWall=0, views=[].slice.call(document.querySelectorAll(".view")), track=$("#track");
  var aL=$("#aL"), aR=$("#aR"), wname=$("#wname"), dots=$("#dots");
  views.forEach(function(v,k){
    var b=document.createElement("button"); b.type="button"; b.setAttribute("aria-label","Go to "+VIEWS[k].name);
    b.addEventListener("click",function(){goWall(k)}); dots.appendChild(b);
  });
  function goWall(i){
    i=Math.max(0,Math.min(views.length-1,i)); curWall=i;
    track.style.transform="translateX(-"+(i*100/views.length)+"%)";
    views.forEach(function(v,k){v.inert=(k!==i)});
    wname.textContent=VIEWS[i].name;
    [].forEach.call(dots.children,function(b,k){b.setAttribute("aria-current",k===i?"true":"false")});
    aL.hidden=(i===0); aR.hidden=(i===views.length-1);
    aL.setAttribute("aria-label","Turn left to "+(VIEWS[i-1]?VIEWS[i-1].name:"")); aR.setAttribute("aria-label","Turn right to "+(VIEWS[i+1]?VIEWS[i+1].name:""));
  }
  aL.addEventListener("click",function(){goWall(curWall-1)}); aR.addEventListener("click",function(){goWall(curWall+1)});
  goWall(0);
  var sx=null,sy=null;
  stage.addEventListener("pointerdown",function(e){sx=e.clientX;sy=e.clientY});
  stage.addEventListener("pointerup",function(e){
    if(sx===null)return; var dx=e.clientX-sx,dy=e.clientY-sy; sx=null;
    if(Math.abs(dx)>110&&Math.abs(dx)>2*Math.abs(dy)) goWall(curWall+(dx<0?1:-1));
  });

  /* overlays */
  function openOv(el,from){ lastFocus=from||document.activeElement; el.classList.add("open"); var c=$("[data-close]",el); if(c)c.focus(); }
  function closeOv(el){ el.classList.remove("open"); if(lastFocus&&lastFocus.focus)lastFocus.focus(); }
  document.querySelectorAll(".overlay").forEach(function(ov){
    ov.addEventListener("click",function(e){ if(e.target===ov||e.target.hasAttribute("data-close"))closeOv(ov); });
  });

  /* examine + zoom */
  var ovEx=$("#ovExamine"), viewer=$("#viewer"), vInner=$("#vInner"), card=$("#card"), cur=0;
  var z={s:1,min:1,max:8,x:0,y:0,w:0,h:0,fit:1};
  function applyZ(){ vInner.style.transform="translate("+(z.x)+"px,"+(z.y)+"px) scale("+z.s+")"; }
  function centre(){ z.x=-z.w*z.s/2; z.y=-z.h*z.s/2; }
  function fitImg(img){
    var vw=viewer.clientWidth, vh=viewer.clientHeight, w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
    z.w=w; z.h=h; z.fit=Math.min(vw*.9/w,(vh-96)/h); z.s=z.fit; z.min=z.fit*.6; z.max=z.fit*8; centre(); applyZ();
  }
  function zoomAt(f,cx,cy){
    var ns=Math.max(z.min,Math.min(z.max,z.s*f)); f=ns/z.s;
    var rx=cx-viewer.clientWidth/2, ry=cy-viewer.clientHeight/2;
    z.x=rx-(rx-z.x)*f; z.y=ry-(ry-z.y)*f; z.s=ns; applyZ();
  }
  function fillCard(it){
    var h="<h3 id='exTitle'></h3><p class='maker'></p><p class='year'></p><p class='d'></p><h4>About the maker</h4><p class='b'></p>";
    card.innerHTML=h;
    $("h3",card).textContent=it.title; $(".maker",card).textContent=it.maker; $(".year",card).textContent=it.year;
    $(".d",card).textContent=it.desc; $(".b",card).textContent=it.bio;
    if(it.link){
      var s=document.createElement("h4"); s.textContent="Another copy to see"; card.appendChild(s);
      var p=document.createElement("p"); var a=document.createElement("a"); a.href=it.link; a.target="_blank"; a.rel="noopener"; a.textContent=it.note||"Library record"; p.appendChild(a); card.appendChild(p);
    }
    if(it.onWall){var sw=document.createElement("button"); sw.type="button"; sw.className="seewall"; sw.textContent="Show me where it hangs";
      sw.addEventListener("click",function(){closeOv(ovEx); goWall(it.view); setTimeout(function(){it.el.classList.add("pulse"); setTimeout(function(){it.el.classList.remove("pulse")},3200)},750);});
      card.appendChild(sw);}
    var n=document.createElement("p"); n.className="note";
    n.textContent=it.img?"Image from a dealer or library scan. Check the source before sharing it publicly.":"No image yet. This piece is in the collection and waits for a scan.";
    card.appendChild(n);
  }
  function openExamine(i,from){
    cur=i; var it=ITEMS[i]; vInner.innerHTML=""; fillCard(it);
    $("#pos").textContent=(i+1)+" of "+ITEMS.length;
    if(!ovEx.classList.contains("open")) openOv(ovEx,from);
    if(it.img){
      var im=new Image(); im.alt=it.title; im.draggable=false;
      vInner.appendChild(im);
      im.onload=function(){fitImg(im)};
      im.src=it.img;
      $("#vHint").style.display="";
      $(".zoombar",viewer).style.display="";
    }else{
      var d=document.createElement("div"); d.className="noscan";
      d.innerHTML="<b></b><i>Scan to come</i>"; $("b",d).textContent=it.title;
      vInner.appendChild(d); z.s=1;z.min=1;z.max=1;z.x=-210;z.y=-280;
      var w=Math.min(420,viewer.clientWidth*.8); z.x=-w/2; z.y=-(w*4/3)/2; applyZ();
      $("#vHint").style.display="none"; $(".zoombar",viewer).style.display="none";
    }
  }
  function step(d){ openExamine((cur+d+ITEMS.length)%ITEMS.length); }
  $("#prev").addEventListener("click",function(){step(-1)});
  $("#next").addEventListener("click",function(){step(1)});
  $("#zIn").addEventListener("click",function(){zoomAt(1.5,viewer.clientWidth/2,viewer.clientHeight/2)});
  $("#zOut").addEventListener("click",function(){zoomAt(1/1.5,viewer.clientWidth/2,viewer.clientHeight/2)});
  $("#zReset").addEventListener("click",function(){var im=$("img",vInner); if(im)fitImg(im)});
  viewer.addEventListener("wheel",function(e){
    if(!$("img",vInner))return; e.preventDefault();
    var r=viewer.getBoundingClientRect(); zoomAt(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top);
  },{passive:false});
  var drag=null, pts={}, pinch=0;
  viewer.addEventListener("pointerdown",function(e){
    if(e.target.closest(".zoombar"))return;
    viewer.setPointerCapture(e.pointerId); pts[e.pointerId]={x:e.clientX,y:e.clientY};
    drag={x:e.clientX,y:e.clientY,ox:z.x,oy:z.y}; viewer.classList.add("drag");
  });
  viewer.addEventListener("pointermove",function(e){
    if(!pts[e.pointerId])return; pts[e.pointerId]={x:e.clientX,y:e.clientY};
    var ids=Object.keys(pts);
    if(ids.length===2&&$("img",vInner)){
      var a=pts[ids[0]],b=pts[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(pinch){var r=viewer.getBoundingClientRect(); zoomAt(d/pinch,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);}
      pinch=d; return;
    }
    if(drag&&$("img",vInner)){ z.x=drag.ox+(e.clientX-drag.x); z.y=drag.oy+(e.clientY-drag.y); applyZ(); }
  });
  function endPtr(e){ delete pts[e.pointerId]; pinch=0; drag=null; viewer.classList.remove("drag"); }
  viewer.addEventListener("pointerup",endPtr); viewer.addEventListener("pointercancel",endPtr);
  viewer.addEventListener("dblclick",function(e){
    if(!$("img",vInner))return; var r=viewer.getBoundingClientRect();
    if(z.s>z.fit*1.5){var im=$("img",vInner); fitImg(im);} else zoomAt(3,e.clientX-r.left,e.clientY-r.top);
  });
  window.addEventListener("resize",function(){ if(ovEx.classList.contains("open")){var im=$("img",vInner); if(im&&im.complete)fitImg(im);} });

  /* ledger */
  var rows=$("#ledRows"), q=$("#q");
  function drawRows(){
    var t=q.value.trim().toLowerCase(); rows.innerHTML="";
    ITEMS.slice().sort(function(a,b){return a.sort-b.sort}).filter(function(it){
      return !t||(it.title+" "+it.maker+" "+it.year+" "+it.desc).toLowerCase().indexOf(t)>-1;
    }).forEach(function(it){
      var tr=document.createElement("tr"); tr.className="go"; tr.tabIndex=0;
      tr.setAttribute("role","button");
      [it.title,it.maker,it.year].forEach(function(v,k){var td=document.createElement("td"); if(k===2)td.className="num"; td.textContent=v; tr.appendChild(td);});
      var s=document.createElement("td"); s.textContent=it.onWall?"On the wall":(it.img?"In a drawer":"No scan yet"); s.className=it.img?"scan-yes":"scan-no"; tr.appendChild(s);
      function go(){ closeOv($("#ovLedger")); openExamine(it.i,$("#btnLedger")); }
      tr.addEventListener("click",go); tr.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
      rows.appendChild(tr);
    });
    if(!rows.children.length){var tr=document.createElement("tr"); var td=document.createElement("td"); td.colSpan=4; td.textContent="Nothing in the ledger matches. Try a maker's surname or a century."; tr.appendChild(td); rows.appendChild(tr);}
  }
  q.addEventListener("input",drawRows); drawRows();
  function openLedger(from){ openOv($("#ovLedger"),from); q.focus(); }
  $("#btnLedger").addEventListener("click",function(){openLedger(this)});
  $("#ledgerBook").addEventListener("click",function(){openLedger(this)});

  /* plan chest */
  var fol=$("#folios");
  ITEMS.filter(function(it){return !it.onWall}).forEach(function(it){
    var b=document.createElement("button"); b.type="button"; b.className="folio";
    b.setAttribute("aria-label","Examine "+it.title+", "+it.year);
    var t=document.createElement("b"); t.textContent=it.title;
    var m=document.createElement("i"); m.textContent=it.maker;
    var y=document.createElement("span"); y.className="yr"; y.textContent=it.year+(it.img?"":"  ·  scan to come");
    if(it.img){var th=document.createElement("img"); th.src=it.img; th.alt=""; b.appendChild(th);}
    var top=document.createElement("div"); top.appendChild(t); top.appendChild(document.createElement("br")); top.appendChild(m);
    b.appendChild(top); b.appendChild(y);
    b.addEventListener("click",function(){closeOv($("#ovChest")); openExamine(it.i,$("#btnChest"));});
    fol.appendChild(b);
  });
  function openChest(from){ openOv($("#ovChest"),from); }
  $("#btnChest").addEventListener("click",function(){openChest(this)});
  document.querySelectorAll(".drawer").forEach(function(d){d.addEventListener("click",function(){openChest(this)})});

  /* lantern */
  var lan=$("#btnLantern"), mx=40,my=45,raf=0;
  lan.addEventListener("click",function(){
    var on=lan.getAttribute("aria-pressed")==="true"; lan.setAttribute("aria-pressed",on?"false":"true");
    stage.classList.toggle("lantern-off",on);
  });
  stage.addEventListener("pointermove",function(e){
    var r=stage.getBoundingClientRect(); mx=(e.clientX-r.left)/r.width*100; my=(e.clientY-r.top)/r.height*100;
    if(!raf)raf=requestAnimationFrame(function(){raf=0; stage.style.setProperty("--mx",mx+"%"); stage.style.setProperty("--my",my+"%");});
  });

  /* keys */
  document.addEventListener("keydown",function(e){
    var open=document.querySelector(".overlay.open"); if(!open){ if(e.key==="ArrowRight")goWall(curWall+1); else if(e.key==="ArrowLeft")goWall(curWall-1); return; }
    if(e.key==="Escape"){closeOv(open);return;}
    if(open===ovEx){
      if(e.key==="ArrowRight")step(1);
      else if(e.key==="ArrowLeft")step(-1);
      else if(e.key==="+"||e.key==="=")zoomAt(1.4,viewer.clientWidth/2,viewer.clientHeight/2);
      else if(e.key==="-")zoomAt(1/1.4,viewer.clientWidth/2,viewer.clientHeight/2);
    }
    if(e.key==="Tab"){
      var f=open.querySelectorAll("button,input,a[href],[tabindex='0']"); f=Array.prototype.filter.call(f,function(n){return n.offsetParent!==null});
      if(!f.length)return; var a=f[0],b=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();}
      else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();}
    }
  });
})();
