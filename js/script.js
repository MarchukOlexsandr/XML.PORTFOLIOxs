/* ================= CURSOR ================= */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const label = document.getElementById('cursor-label');
let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
  label.style.left = mx+'px'; label.style.top = my+'px';
});
(function ringLoop(){
  rx += (mx-rx)*.16; ry += (my-ry)*.16;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(ringLoop);
})();
function bindHovers(){
  document.querySelectorAll('a,button,[data-hover]').forEach(el=>{
    if(el.dataset.cbound) return; el.dataset.cbound = 1;
    el.addEventListener('mouseenter', ()=>{
      cur.classList.add('hover');
      const t = el.getAttribute('data-hover');
      if(t){ label.textContent = t; label.classList.add('on'); }
    });
    el.addEventListener('mouseleave', ()=>{
      cur.classList.remove('hover'); label.classList.remove('on');
    });
  });
}
bindHovers();

/* ================= LOADER ================= */
const loader = document.getElementById('loader');
const fill = document.getElementById('load-fill');
const pct = document.getElementById('load-pct');
const status = document.getElementById('load-status');
const flash = document.getElementById('flash');
const site = document.getElementById('site');

const steps = [
  [0,   'INITIALIZING KERNEL...'],
  [12,  'LOADING CHESS.ENGINE ... OK'],
  [28,  'SYSTEM 84% ONLINE'],
  [44,  'MOUNTING /XML.PORTFOLIO ... OK'],
  [61,  'RENDERING GRAPHIC MODULES...'],
  [78,  'DATA 90% — STRUCTURE.OK'],
  [92,  'FINALIZING BOOT SEQUENCE...'],
  [100, 'ACCESS GRANTED — WELCOME']
];
let p = 0, si = 0, finished = false;

function tick(){
  if(finished) return;
  p = Math.min(100, p + Math.random()*4.2 + 1.2);
  const pi = Math.floor(p);
  fill.style.width = pi + '%';
  pct.textContent = pi + '%';
  while(si < steps.length && pi >= steps[si][0]){
    status.textContent = steps[si][1]; si++;
  }
  if(p >= 100){ finished = true; setTimeout(enterSite, 650); }
  else setTimeout(tick, 90 + Math.random()*130);
}
setTimeout(tick, 900);

const ambient = document.getElementById('ambient');
function enterSite(){
  loader.classList.add('run-out');      // человечек забегает в дверь
  flash.classList.add('go');            // синяя вспышка
  try{ ambient.volume = 0.01; ambient.play().catch(()=>{}); }catch(e){}
  setTimeout(()=>{
    site.classList.add('show');
    document.body.style.overflow = '';
  }, 260);
  setTimeout(()=>{ loader.classList.add('done'); }, 480);
  setTimeout(()=>{ loader.style.display = 'none'; }, 1300);
}

document.getElementById('btn-yes').addEventListener('click', ()=>{
  if(finished) return;
  p = 100; fill.style.width='100%'; pct.textContent='100%';
  status.textContent = 'ACCESS GRANTED — WELCOME';
  finished = true; setTimeout(enterSite, 350);
});
/* NO → окно ошибки → медиаплеер с видео на сайте */
const RICK_EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&enablejsapi=1';
const errWrap = document.getElementById('err-wrap');
const errCount = document.getElementById('err-count');
const vidWrap = document.getElementById('vid-wrap');
const vidFrame = document.getElementById('vid-frame');
let errInt = null, errShown = false, vidInt = null;

function goRick(){
  finished = true;   // останавливаем загрузку, плеер живёт внутри загрузчика
  errWrap.classList.remove('show');
  vidFrame.src = RICK_EMBED;
  vidWrap.classList.add('show');
  // бегущий таймкод в плеере
  let s = 0;
  const tc = document.getElementById('vid-tc');
  clearInterval(vidInt);
  vidInt = setInterval(()=>{
    s++;
    const m = String(Math.floor(s/60)).padStart(2,'0'), ss = String(s%60).padStart(2,'0');
    tc.textContent = '00:' + m + ':' + ss;
  }, 1000);
}
/* вуаль над видео: курсор сайта остаётся поверх iframe, клики проходят в плеер */
const vidVeil = document.getElementById('vid-veil');
if(vidVeil){
  vidVeil.addEventListener('mousedown', ()=>{ vidVeil.style.pointerEvents = 'none'; });
  addEventListener('mouseup', ()=>{ vidVeil.style.pointerEvents = ''; });
  vidVeil.addEventListener('mouseleave', ()=>{ vidVeil.style.pointerEvents = ''; });
}
/* над iframe кейса прячем курсор родителя — внутри работает свой такой же */
const caseFrame = document.getElementById('cw-frame');
if(caseFrame){
  caseFrame.addEventListener('mouseenter', ()=>{ cur.classList.add('off'); ring.classList.add('off'); label.classList.remove('on'); label.classList.add('off'); });
  caseFrame.addEventListener('mouseleave', ()=>{ cur.classList.remove('off'); ring.classList.remove('off'); label.classList.remove('off'); });
}
document.getElementById('vid-x').addEventListener('click', ()=>{
  vidWrap.classList.remove('show');
  vidFrame.src = '';
  clearInterval(vidInt);
  if(site.classList.contains('show')) return; // сайт уже открыт — просто закрываем плеер
  try{ ambient.pause(); }catch(e){}
  window.close();   // закрываем сайт (сработает, если вкладка открыта скриптом)
  // если браузер заблокировал закрытие — экран конца сеанса
  setTimeout(()=>{
    document.body.innerHTML =
      '<div style="position:fixed;inset:0;background:#06060a;display:grid;place-items:center;' +
      'font-family:\'IBM Plex Mono\',monospace;text-align:center;z-index:99999">' +
      '<div><div style="color:#1a1aff;font-size:13px;letter-spacing:.3em;margin-bottom:18px">■ SESSION TERMINATED</div>' +
      '<div style="color:#f2f2ec;font-size:26px;font-weight:700;letter-spacing:.08em">XML.PORTFOLIO CLOSED</div>' +
      '<div style="color:#666;font-size:11px;letter-spacing:.2em;margin-top:16px">YOU CAN CLOSE THIS TAB NOW</div></div></div>';
    document.body.style.background = '#06060a';
  }, 250);
});

document.getElementById('btn-no').addEventListener('click', function(){
  this.classList.remove('shake'); void this.offsetWidth; this.classList.add('shake');
  status.textContent = 'ERROR: NO IS NOT AN OPTION :)';
  finished = true;   // стоп загрузки, пока висит ошибка/плеер
  if(errShown) return;
  errShown = true;
  errWrap.classList.add('show');
  let sec = 5;
  errCount.textContent = 'LOADING RECOVERY.AVI IN ' + sec + ' SEC';
  errInt = setInterval(()=>{
    sec--;
    if(sec <= 0){ clearInterval(errInt); goRick(); }
    else errCount.textContent = 'LOADING RECOVERY.AVI IN ' + sec + ' SEC';
  }, 1000);
});
document.getElementById('err-ok').addEventListener('click', ()=>{
  clearInterval(errInt); goRick();
});
document.querySelector('.err-title .x').addEventListener('click', ()=>{
  clearInterval(errInt); goRick();   // спасения нет :)
});

if(location.search.indexOf('vid') > -1){ goRick(); }
/* QR-код — тап/клик открывает то же видео, что и при загрузке */
const qrImg = document.querySelector('.qr-row img');
if(qrImg) qrImg.addEventListener('click', goRick);

/* dev: ?errno — показать окно ошибки без таймера */
if(location.search.indexOf('errno') > -1){
  errWrap.classList.add('show'); errShown = true;
}

document.body.style.overflow = 'hidden';

/* dev: ?instant — пропуск загрузки */
if(location.search.indexOf('instant') > -1){
  finished = true;
  if(location.search.indexOf('flat') > -1) document.body.classList.add('flat');
  loader.style.display = 'none';
  site.classList.add('show');
  document.body.style.overflow = '';
  document.querySelectorAll('.rv').forEach(el=>el.classList.add('in'));
  document.querySelectorAll('.bar i').forEach(b=>b.style.width = b.dataset.w + '%');
  document.documentElement.style.scrollBehavior = 'auto';
  if(location.hash){
    const t = document.querySelector(location.hash);
    if(t) setTimeout(()=>t.scrollIntoView({behavior:'instant', block:'start'}), 100);
  }
}

/* ================= PARALLAX + BEAT ================= */
// бит-состояние: true когда SoundCloud реально играет
let beatOn = false, beatT0 = 0;
const BPM = 122;
function kick(now){
  const ph = ((now - beatT0) / 1000 * (BPM / 60)) % 1;
  return Math.exp(-4.5 * ph);   // резкая атака + затухание, как бочка
}
// существующие плюсики тоже включаем в параллакс
document.querySelectorAll('.hero .plus').forEach((p,i)=>{
  p.classList.add('px');
  p.dataset.px = (0.2 + i*0.09).toFixed(2);
  p.dataset.py = (0.3 + i*0.11).toFixed(2);
});
// лёгкое парение короля
const kingW = document.querySelector('.king-wrap');
if(kingW){ kingW.dataset.px = '0.08'; kingW.dataset.py = '0.35'; }
// синие блоки тоже в параллакс и бит
document.querySelectorAll('.blue-block').forEach((b,i)=>{
  b.dataset.px = (0.1 + i*0.05).toFixed(2);
  b.dataset.py = '0.3';
});

const pxEls = document.querySelectorAll('[data-px]');
const lyricsBigEl = document.getElementById('lyrics-main');
const lyricsEcho1 = document.querySelector('.lyrics-big.e1');
const lyricsEcho2 = document.querySelector('.lyrics-big.e2');
let tmx = 0, tmy = 0, cmx = 0, cmy = 0;
addEventListener('mousemove', e=>{
  tmx = (e.clientX / innerWidth - .5) * 2;
  tmy = (e.clientY / innerHeight - .5) * 2;
});
(function pxLoop(now){
  cmx += (tmx - cmx) * .055;
  cmy += (tmy - cmy) * .055;
  const sy = scrollY;
  const b = beatOn ? kick(now || performance.now()) : 0;
  const dark = document.body.classList.contains('dark-track');
  const amp = 1 + b * (dark ? 2.4 : 0.9);  // на 5м треке параллакс качается сильнее
  pxEls.forEach(el=>{
    const d = parseFloat(el.dataset.px) || .2;
    const s = parseFloat(el.dataset.py) || 0;
    let t = 'translate3d(' + (cmx * d * 70 * amp).toFixed(1) + 'px,' +
      (cmy * d * 60 * amp - sy * s * .28 - b * d * 26).toFixed(1) + 'px,0)';
    if(el === kingW) t += ' scale(' + (1 + b * .05).toFixed(3) + ')';
    if(el.classList && el.classList.contains('blue-block'))
      t += ' scale(' + (1 + b * .03).toFixed(3) + ')';
    el.style.transform = t;
  });
  document.body.classList.toggle('beat', beatOn && b > .55);
  requestAnimationFrame(pxLoop);
})();

/* ================= MARQUEE ================= */
const phrase = ' UI/UX — MOTION DESIGN — BRANDING — VISUAL SYSTEMS — XML.PORTFOLIO —';
document.getElementById('mq-track').textContent = phrase.repeat(6);

/* ================= REVEAL ON SCROLL ================= */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.classList.contains('skills')){
        e.target.querySelectorAll('.bar i').forEach(b=>{
          b.style.width = b.dataset.w + '%';
        });
      }
      io.unobserve(e.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ================= SOUNDCLOUD PLAYER ================= */
const SC_URL = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/rallen-543940140/sets/for-site'
  + '&color=%231a1aff&auto_play=true&hide_related=true&show_comments=false'
  + '&show_user=true&show_reposts=false&show_teaser=false&visual=false';
const scPlayer = document.getElementById('sc-player');
const scFrame = document.getElementById('sc-frame');
const scOpenBtn = document.getElementById('sc-open');
let scLoaded = false, scInt = null, scSec = 0;

function scTickStart(){
  clearInterval(scInt); scSec = 0;
  const tc = document.getElementById('sc-tc');
  scInt = setInterval(()=>{
    scSec++;
    tc.textContent = String(Math.floor(scSec/60)).padStart(2,'0') + ':' + String(scSec%60).padStart(2,'0');
  }, 1000);
}
/* подключаем SoundCloud Widget API для точного play/pause */
let scWidget = null;
function scBindApi(){
  const tag = document.createElement('script');
  tag.src = 'https://w.soundcloud.com/player/api.js';
  tag.onload = ()=>{
    try{
      scWidget = SC.Widget(scFrame);
      scWidget.bind(SC.Widget.Events.READY, ()=>{
        try{ scWidget.setVolume(muted ? 0 : 100); }catch(e){}
        scWidget.bind(SC.Widget.Events.PLAY, ()=>{
          beatOn = true; beatT0 = performance.now();
          scLoadLyrics();
        });
        const stop = ()=>{ beatOn = false; };
        scWidget.bind(SC.Widget.Events.PAUSE, stop);
        scWidget.bind(SC.Widget.Events.FINISH, stop);
        // синхра большой надписи с позицией трека (5й трек)
        scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, e=>{
          if(!darkMode()) return;
          const L = lyricLines.length ? lyricLines : TRACK5_LYRICS;
          const rel = e.relativePosition || 0;
          const posSec = (e.currentPosition || 0) / 1000;
          const dur = rel > 0 ? posSec / rel : 0; // полная длина трека, сек
          let i;
          const lastMark = LYRIC_MARKS[LYRIC_MARKS.length - 1];
          if(dur <= 0 || posSec >= lastMark){
            // после 20-й секунды: оставшиеся строки равномерно до конца трека
            const rest = dur > 0 ? (posSec - lastMark) / (dur - lastMark) : 0;
            i = Math.min(L.length - 1, (LYRIC_MARKS.length - 1) + Math.floor(Math.max(0, rest) * (L.length - LYRIC_MARKS.length + 1)));
          }else{
            // по расписанию: строка держится в своём окне
            i = 0;
            for(let m = 1; m < LYRIC_MARKS.length; m++){ if(posSec >= LYRIC_MARKS[m]) i = m; }
            i = Math.min(i, L.length - 1);
          }
          if(i !== bigIdx){
            bigIdx = i;
            setBigLyric(L[i]);
          }
        });
      });
    }catch(e){ /* API недоступно — работаем по флагу окна */ }
  };
  document.head.appendChild(tag);
}

/* ============ ТЕКСТ ТЕКУЩЕГО ТРЕКА (lyrics.ovh) ============ */
let lyricLines = [];   // строки текста играющего трека
let lyricIdx = 0;
let lyricTrack = '';   // "ARTIST — TITLE" для шапки окна
let lyricFetchId = 0;
const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ============ DARK TRACK — 5й трек по счёту ============ */
let scSounds = null;
let bigIdx = 0, bigLag1 = null, bigLag2 = null, bigFx = 0;
const WORD_ANIMS = ['a-pop','a-up','a-left','a-rot'];   // варианты подлёта слов
const LINE_FX = ['fx-zoom','fx-left','fx-spin'];         // приёмы смены строки
function setBigLyric(t){ // motion-design кинетика: приём строки + слова по одному
  if(lyricsBigEl.dataset.text === t) return;
  lyricsBigEl.dataset.text = t;
  clearTimeout(bigLag1); clearTimeout(bigLag2);
  // приём смены строки — чередуем zoom / left / spin
  lyricsBigEl.classList.remove(...LINE_FX);
  void lyricsBigEl.offsetWidth; // перезапуск анимации
  lyricsBigEl.classList.add(LINE_FX[bigFx % LINE_FX.length]); bigFx++;
  const words = t.split(' ');
  const step = words.length > 10 ? 55 : 85; // длинные строки — быстрее
  lyricsBigEl.innerHTML = '';
  words.forEach((w, i)=>{
    const s = document.createElement('span');
    s.className = 'w ' + WORD_ANIMS[(i + bigFx) % WORD_ANIMS.length];
    s.textContent = w;
    s.style.animationDelay = (i * step) + 'ms';
    lyricsBigEl.appendChild(s);
    if(i < words.length - 1) lyricsBigEl.appendChild(document.createTextNode(' '));
  });
  bigLag1 = setTimeout(()=>{ lyricsEcho1.textContent = t; }, 160);
  bigLag2 = setTimeout(()=>{ lyricsEcho2.textContent = t; }, 320);
}
function scApplyTrackMood(s){
  const set = idx=>{
    const dark = (idx === 4); // пятый трек плейлиста
    document.body.classList.toggle('dark-track', dark);
    if(dark){
      document.querySelectorAll('.rnd-err').forEach(e=>e.remove()); // все ошибки пропадают
      lyricLines = TRACK5_LYRICS.slice(); // точный текст 5го трека
      lyricIdx = 0; bigIdx = -1;
      setBigLyric(lyricLines[0]);
    }
  };
  if(scSounds){ set(scSounds.findIndex(x => x.id === s.id)); }
  else{
    try{
      scWidget.getSounds(list=>{
        scSounds = list;
        set(list.findIndex(x => x.id === s.id));
      });
    }catch(e){ set(-1); }
  }
}
const darkMode = () => document.body.classList.contains('dark-track');
// пульс текста песни в ритме бочки на 5м треке
(function lyricPulse(){
  const b = beatOn ? kick(performance.now()) : 0;
  if(lyricsBigEl){
    if(darkMode() && beatOn){
      lyricsBigEl.style.transform = 'scale(' + (1 + b * .08).toFixed(3) + ')';
      lyricsBigEl.style.filter = b > .5 ? 'blur(.4px)' : '';
    }else if(lyricsBigEl.style.transform){
      lyricsBigEl.style.transform = ''; lyricsBigEl.style.filter = '';
    }
  }
  requestAnimationFrame(lyricPulse);
})();
/* большие строки текста песни за фигурой — запасной режим,
   если SoundCloud API не дал PLAY_PROGRESS (синхра идёт через него) */
setInterval(()=>{
  if(!darkMode() || scWidget) return;
  const L = lyricLines.length ? lyricLines : TRACK5_LYRICS;
  bigIdx = (bigIdx + 1) % L.length;
  setBigLyric(L[bigIdx]);
}, 4500);

function scLoadLyrics(){
  if(!scWidget) return;
  try{
    scWidget.getCurrentSound(s=>{
      if(!s || !s.title) return;
      scApplyTrackMood(s);
      let a = (s.user && s.user.username) ? s.user.username : '';
      let t = s.title;
      if(s.title.indexOf(' - ') > -1){          // формат "Artist - Title"
        const p = s.title.split(' - ');
        a = p[0].trim(); t = p.slice(1).join(' - ').trim();
      }
      lyricTrack = ((a ? a + ' — ' : '') + t).slice(0, 40);
      lyricLines = []; lyricIdx = 0;
      const id = ++lyricFetchId;
      const clean = x => x.replace(/\(.*?\)|\[.*?\]|feat\..*|ft\..*/gi,'')
                          .replace(/[^\p{L}\p{N} &'-]/gu,'').trim();
      fetch('https://api.lyrics.ovh/v1/' + encodeURIComponent(clean(a)) + '/' + encodeURIComponent(clean(t)))
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if(id !== lyricFetchId || !d || !d.lyrics || darkMode()) return; // на 5м треке — свой текст
          lyricLines = d.lyrics.split('\n').map(l => l.trim()).filter(l => l.length > 1);
          lyricIdx = 0;
        })
        .catch(()=>{ /* нет текста — останутся запасные строки */ });
    });
  }catch(e){}
}

/* ================= EQUALIZER ================= */
const eqWrap = document.getElementById('eq-wrap');
const eqBody = document.getElementById('eq-bars');
const EQ_N = 18, eqBars = [];
for(let i = 0; i < EQ_N; i++){
  const b = document.createElement('i');
  eqBody.appendChild(b); eqBars.push(b);
}
setInterval(()=>{
  if(!eqWrap.classList.contains('open')) return;
  const boost = beatOn ? kick(performance.now()) : 0;
  eqBars.forEach((b, i)=>{
    const wave = Math.sin(performance.now()/300 + i*.7) * .5 + .5;
    const h = 10 + wave*30 + Math.random()*28 + boost*(25 + Math.random()*45);
    b.style.height = Math.min(98, h) + '%';
  });
}, 95);

/* ============ ФОНОВЫЙ ЭКВАЛАЙЗЕР 5ГО ТРЕКА (за шахматой и текстом) ============ */
const bgEq = document.getElementById('bg-eq');
const BG_N = 46, bgBars = [];
if(bgEq){
  for(let i = 0; i < BG_N; i++){
    const b = document.createElement('i');
    bgEq.appendChild(b); bgBars.push(b);
  }
  setInterval(()=>{
    if(!darkMode()) return;
    const boost = beatOn ? kick(performance.now()) : 0;
    bgBars.forEach((b, i)=>{
      const wave = Math.sin(performance.now()/380 + i*.45) * .5 + .5;
      const h = 3 + wave*22 + Math.random()*14 + boost*(30 + Math.random()*55);
      b.style.height = Math.min(100, h) + '%';
    });
  }, 90);
}

/* ================= RANDOM GLITCH ERRORS ================= */
const RND_MSGS = [
  ['0x0000BEAT', '<b>BEAT DROP DETECTED</b><br>audio.sys is too loud'],
  ['0xVHS-ERR', '<b>TRACKING ERROR</b><br>adjusting head alignment...'],
  ['0x00BUFFER', '<b>BUFFER UNDERRUN</b><br>never gonna buffer you down'],
  ['0xSYNC404', '<b>SYNC LOST</b><br>recalibrating parallel.universe'],
  ['0x0GROOVE', '<b>EXCESS GROOVE</b><br>system cannot stand still'],
  ['0xTAPE-16', '<b>TAPE CHEWED</b><br>please rewind with a pencil']
];
let rndTimer = null;
function scheduleRndErr(){
  clearTimeout(rndTimer);
  rndTimer = setTimeout(()=>{
    if(beatOn && !darkMode()){
      const [code, msg] = RND_MSGS[Math.floor(Math.random()*RND_MSGS.length)];
      const el = document.createElement('div');
      el.className = 'rnd-err glitch';
      el.innerHTML = '<div class="re-t"><span>✖ ' + code + '</span><span>×</span></div><div class="re-b">' + msg + '</div>';
      el.style.left = (5 + Math.random()*68) + 'vw';
      el.style.top = (10 + Math.random()*60) + 'vh';
      document.body.appendChild(el);
      setTimeout(()=>el.classList.add('out'), 2300);
      setTimeout(()=>el.remove(), 2800);
    }
    scheduleRndErr();
  }, 7000 + Math.random()*11000);
}
scheduleRndErr();

/* ============ LYRICS — синие ошибки внизу экрана ============ */
const LYRICS = [
  '♪ never gonna give you up, never gonna let you down ♪',
  '♪ around the world, around the world ♪',
  '♪ синий неон в моих венах ♪',
  '♪ static noise — my favourite song ♪',
  '♪ rewind the tape, play it again ♪',
  '♪ 404: silence not found ♪',
  '♪ баслайн держит этот город ♪',
  '♪ press play and drift away ♪'
];
/* ============ ТЕКСТ 5ГО ТРЕКА (точный, для синхры) ============ */
/* расписание строк 5го трека: границы окон в секундах —
   строка 0 стоит 0–5с, строка 1 — 5–12с, строка 2 — 12–14с и т.д.;
   после последней границы остаток строк равномерно до конца трека */
const LYRIC_MARKS = [0,5,12,14,16,20];
const TRACK5_LYRICS = [
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up',
  'Just say what\'s up-uh-uh-uh-uh-uh-uh-uh',
  'Another call last night',
  'Don\'t lie and talk to me, wasted time only, boy',
  'Never right, don\'t lie and talk, don\'t lie and talk only',
  'Too late, know you\'re dying from within',
  'Wolf in a sheep\'s skin, trying but you never win',
  'Nothing left, cigarette, lighter, dead—dead—dead—dead—dead',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up, uh, uh, uh-uh',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up, uh, uh, uh, uh-uh',
  'Nosebleed, someone\'s getting nervous',
  'Always looking down \'cause you\'re just so fucking perfect',
  'Call me and all your worries, gone',
  'You\'ve been living on the edge, down the barrel of the gun',
  'Wanna see me dead? I\'ll go',
  'Something in your head, for sure',
  'Looking for some rest, I know, \'nother pack of blow',
  'Dizzy on the street, you ain\'t got no home',
  'Dizzy on the street, you ain\'t got no home',
  'Dizzy on the street, you ain\'t got no—',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up, uh, uh, uh-uh',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s— Up, just say what\'s up',
  'Talk, boy? You wanna talk, boy?',
  'Just say what\'s up, just say what\'s up, uh, uh, uh, uh-uh—',
  'Just say what\'s up',
  'Up-up, just say what\'s up'
];
function nextLyric(){ // строка из текста играющего трека, иначе — запасная
  if(lyricLines.length){
    const t = '♪ ' + lyricLines[lyricIdx % lyricLines.length] + ' ♪';
    lyricIdx++;
    return t;
  }
  return LYRICS[Math.floor(Math.random()*LYRICS.length)];
}
function lyricTitle(){
  return lyricTrack ? ('♪ ' + lyricTrack.toUpperCase()) : '♪ LYRICS.SYS';
}
function spawnLyric(centered){
  const W = innerWidth, H = innerHeight;
  const el = document.createElement('div');
  el.className = 'rnd-err lyric glitch';
  el.innerHTML = '<div class="re-t"><span>' + escHtml(lyricTitle()) + '</span><span>×</span></div><div class="re-b">' + escHtml(nextLyric()) + '</div>';
  if(centered){
    el.style.left = Math.max(8, W/2 - 165) + 'px';
    el.style.top = (H * 0.82) + 'px';
    el.style.animationDelay = '1200ms';
    setTimeout(()=>el.classList.add('out'), 4800);
    setTimeout(()=>el.remove(), 5300);
  }else{
    el.style.left = Math.max(8, W*0.5 - 165 + (Math.random()*W*0.24 - W*0.12)) + 'px';
    el.style.top = (H*0.74 + Math.random()*H*0.14) + 'px';
    setTimeout(()=>el.classList.add('out'), 3600);
    setTimeout(()=>el.remove(), 4100);
  }
  document.body.appendChild(el);
}
let lyricTimer = null;
function scheduleLyricErr(){
  clearTimeout(lyricTimer);
  lyricTimer = setTimeout(()=>{
    if(beatOn && !darkMode()) spawnLyric(false);
    scheduleLyricErr();
  }, 4000 + Math.random()*4000);
}
scheduleLyricErr();

/* ============ ERROR FLOOD — раз в минуту, надпись SHU ============ */
const SHU_FONT = {
  S: ['111','100','111','001','111'],
  H: ['101','101','111','101','101'],
  U: ['101','101','101','101','111']
};
function floodErrors(){
  if(!beatOn || darkMode()) return;
  const W = innerWidth, H = innerHeight;
  const cols = 11, rows = 5;
  const cellW = Math.min((W * 0.9) / cols, 160);
  const cellH = Math.min(cellW * 0.58, (H * 0.62) / rows);
  const startX = (W - cols * cellW) / 2;
  const startY = (H - rows * cellH) / 2 - H * 0.03;
  const hex = () => '0x' + Math.floor(Math.random()*255).toString(16).toUpperCase().padStart(2,'0');

  // надпись SHU из окон-пикселей
  ['S','H','U'].forEach((ch, li)=>{
    const m = SHU_FONT[ch];
    for(let r = 0; r < 5; r++){
      for(let c = 0; c < 3; c++){
        if(m[r][c] !== '1') continue;
        const el = document.createElement('div');
        el.className = 'rnd-err px glitch';
        el.innerHTML = '<div class="re-t"><span>' + hex() + '</span><span>×</span></div>';
        el.style.left = (startX + (li*4 + c) * cellW) + 'px';
        el.style.top = (startY + r * cellH) + 'px';
        el.style.width = (cellW * 0.94) + 'px';
        const delay = li * 280 + Math.random() * 260; // буквы по очереди: S → H → U
        el.style.animationDelay = delay + 'ms';
        setTimeout(()=>el.classList.add('out'), 3400 + delay);
        setTimeout(()=>el.remove(), 3950 + delay);
        document.body.appendChild(el);
      }
    }
  });

  // рассеянные ошибки по краям
  for(let i = 0; i < 5; i++){
    const [code, msg] = RND_MSGS[Math.floor(Math.random()*RND_MSGS.length)];
    const el = document.createElement('div');
    el.className = 'rnd-err glitch';
    el.innerHTML = '<div class="re-t"><span>✖ ' + code + '</span><span>×</span></div><div class="re-b">' + msg + '</div>';
    el.style.left = (Math.random() < .5 ? 2 + Math.random()*8 : 76 + Math.random()*8) + 'vw';
    el.style.top = (6 + Math.random()*80) + 'vh';
    const delay = 600 + Math.random()*900;
    el.style.animationDelay = delay + 'ms';
    setTimeout(()=>el.classList.add('out'), 2600 + delay);
    setTimeout(()=>el.remove(), 3150 + delay);
    document.body.appendChild(el);
  }

  // lyric-ошибка снизу по центру
  spawnLyric(true);
}
setInterval(floodErrors, 60000);
/* dev: ?flood — мгновенный флуд; ?dark — тёмный режим 5го трека */
if(location.search.indexOf('flood') > -1)
  setTimeout(()=>{ beatOn = true; floodErrors(); }, 700);
if(location.search.indexOf('dark') > -1)
  setTimeout(()=>document.body.classList.add('dark-track'), 400);

/* ================= AMBIENT — приглушаем под музыку ================= */
setInterval(()=>{
  try{ ambient.volume += ((beatOn ? 0 : 0.01) - ambient.volume) * .4; }catch(e){}
}, 700);

/* ================= HOVER SOUND ================= */
const hoverSnd = new Audio('assets/audio/hover.mp3');
let hoverLast = 0;
function playHover(){
  if(muted) return;
  const now = performance.now();
  if(now - hoverLast < 70) return; // анти-пулемёт
  hoverLast = now;
  try{
    hoverSnd.volume = beatOn ? 0.10 : 0.20;
    hoverSnd.currentTime = 0;
    hoverSnd.play().catch(()=>{});
  }catch(e){}
}
document.addEventListener('mouseover', e=>{
  const t = e.target.closest('a,button,[data-hover],.work-card');
  if(!t || (e.relatedTarget && t.contains(e.relatedTarget))) return; // вход на объект, не внутри него
  playHover();
});

/* ================= GLOBAL MUTE — глушит всё: ambient, hover, SoundCloud, видео ================= */
let muted = false;
const sndBtn = document.getElementById('snd-toggle');
function applyMute(){
  try{ ambient.muted = muted; }catch(e){}
  try{ hoverSnd.muted = muted; }catch(e){}
  if(scWidget){ try{ scWidget.setVolume(muted ? 0 : 100); }catch(e){} }
  if(vidFrame && vidFrame.src && vidFrame.contentWindow){
    try{ vidFrame.contentWindow.postMessage(JSON.stringify({event:'command', func: muted ? 'mute' : 'unMute', args:[]}), '*'); }catch(e){}
  }
  if(sndBtn){
    sndBtn.textContent = muted ? 'SND:OFF' : 'SND:ON';
    sndBtn.classList.toggle('muted', muted);
    sndBtn.setAttribute('data-hover', muted ? 'UNMUTE' : 'MUTE');
  }
}
if(sndBtn) sndBtn.addEventListener('click', ()=>{ muted = !muted; applyMute(); });

/* ================= MAX PROTECTION ================= */
function denyErr(x, y, msg){
  const el = document.createElement('div');
  el.className = 'rnd-err glitch';
  el.innerHTML = '<div class="re-t"><span>✖ 0x0000LOCK</span><span>×</span></div><div class="re-b"><b>ACCESS DENIED</b><br>' + msg + '</div>';
  el.style.left = Math.min(innerWidth - 270, Math.max(8, x)) + 'px';
  el.style.top = Math.min(innerHeight - 130, Math.max(8, y)) + 'px';
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add('out'), 1500);
  setTimeout(()=>el.remove(), 2000);
}
/* правая кнопка мыши */
document.addEventListener('contextmenu', e=>{
  e.preventDefault();
  denyErr(e.clientX, e.clientY, 'protection.sys is watching you');
});
/* копирование / вырезание / вставка */
document.addEventListener('copy', e=>{ e.preventDefault(); denyErr(innerWidth/2 - 125, innerHeight*0.4, 'clipboard.exe blocked'); });
document.addEventListener('cut', e=>e.preventDefault());
document.addEventListener('paste', e=>e.preventDefault());
/* перетаскивание изображений и чего угодно */
document.querySelectorAll('img').forEach(im => im.draggable = false);
document.addEventListener('dragstart', e=>{
  e.preventDefault();
  denyErr(e.clientX, e.clientY, 'drag.sys not found');
});
/* долгий тап на телефоне (вызов контекстного меню iOS/Android) */
document.addEventListener('touchstart', e=>{
  if(e.touches.length > 1) e.preventDefault();
}, {passive:false});
/* devtools / view-source / save — Win и Mac */
document.addEventListener('keydown', e=>{
  const k = e.key.toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  const blocked = e.key === 'F12' ||
    (mod && ['u','s','p','g'].includes(k)) ||
    (mod && e.shiftKey && ['i','j','c','k'].includes(k)) ||
    (mod && e.altKey && ['i','u'].includes(k));
  if(blocked){
    e.preventDefault();
    denyErr(innerWidth/2 - 125, innerHeight*0.4, 'nice try, inspector');
  }
});
/* защита от встраивания сайта в чужой iframe */
if(window.top !== window.self){
  try{ window.top.location.href = window.self.location.href; }catch(e){}
}
/* детектор открытого инспектора — экран блокировки */
const devLock = document.createElement('div');
devLock.id = 'dev-lock';
devLock.innerHTML = '<div>■ INSPECTOR DETECTED<br><span style="color:#f2f2ec;font-size:13px">SESSION LOCKED — 0xF12<br>CLOSE DEVELOPER TOOLS TO CONTINUE</span></div>';
document.body.appendChild(devLock);
setInterval(()=>{
  const open = Math.abs(window.outerWidth - window.innerWidth) > 160 ||
               Math.abs(window.outerHeight - window.innerHeight) > 160;
  devLock.classList.toggle('on', open);
}, 800);

/* ================= MOBILE MENU ================= */
const mobMenu = document.getElementById('mob-menu');
document.getElementById('mob-open').addEventListener('click', e=>{
  e.stopPropagation();
  mobMenu.classList.toggle('open');
});
document.getElementById('mob-close').addEventListener('click', ()=>mobMenu.classList.remove('open'));
mobMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>mobMenu.classList.remove('open')));
document.addEventListener('click', e=>{
  if(!mobMenu.contains(e.target)) mobMenu.classList.remove('open');
});

scOpenBtn.addEventListener('click', ()=>{
  const isOpen = scPlayer.classList.toggle('open');
  if(isOpen){
    if(!scLoaded){ scFrame.src = SC_URL; scLoaded = true; scBindApi(); }
    scOpenBtn.classList.add('playing');
    eqWrap.classList.add('open');
    scTickStart();
    // запасной вариант, если API не подгрузилось
    setTimeout(()=>{ if(!scWidget){ beatOn = true; beatT0 = performance.now(); } }, 3000);
  } else {
    scOpenBtn.classList.remove('playing');
    eqWrap.classList.remove('open');
    clearInterval(scInt);
    beatOn = false;
  }
});
document.getElementById('sc-close').addEventListener('click', ()=>{
  scPlayer.classList.remove('open');
  scOpenBtn.classList.remove('playing');
  eqWrap.classList.remove('open');
  clearInterval(scInt);
  scFrame.src = ''; scLoaded = false; scWidget = null;   // STOP
  beatOn = false;
});

/* drag плеера за титульную панель */
(function(){
  const win = scPlayer, bar = win.querySelector('.sc-title');
  let drag = false, ox = 0, oy = 0;
  bar.addEventListener('pointerdown', e=>{
    if(e.target.closest('.x')) return;   // не тащим за крестик
    drag = true;
    win.classList.add('dragging');
    const r = win.getBoundingClientRect();
    // фиксируем текущую позицию в координаты left/top
    win.style.left = r.left + 'px';
    win.style.top = r.top + 'px';
    win.style.right = 'auto';
    win.style.bottom = 'auto';
    ox = e.clientX - r.left; oy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove', e=>{
    if(!drag) return;
    const x = Math.min(Math.max(e.clientX - ox, 0), innerWidth - 60);
    const y = Math.min(Math.max(e.clientY - oy, 0), innerHeight - 40);
    win.style.left = x + 'px';
    win.style.top = y + 'px';
  });
  const stop = ()=>{ drag = false; win.classList.remove('dragging'); };
  bar.addEventListener('pointerup', stop);
  bar.addEventListener('pointercancel', stop);
})();

/* dev: ?sc — сразу открыть плеер */
if(location.search.indexOf('sc') > -1 && location.search.indexOf('instant') > -1){
  setTimeout(()=>scOpenBtn.click(), 300);
}

/* ================= WORK MODAL ================= */
const WORKS = [
  {num:'01', title:'GAME UI DESIGN', file:'GAME_UI.EXE', img:'assets/img/work1.jpg',
   tags:'UI / HUD / INTERFACE',
   desc:'Concept interface system for a sci-fi game — layered glitch HUDs, blueprint grids, kinetic typography and blueprint-blue data overlays.'},
  {num:'02', title:'MOTION DESIGN', file:'MOTION.EXE', img:'assets/img/work2.jpg',
   tags:'TYPE / LOOP / ACID',
   desc:'Acid-graphics motion piece — oversized kanji typography, barcodes, RX labels and medical overlays drifting in a permanent loop.'},
  {num:'03', title:'VISUAL IDENTITY', file:'VISUAL_ID.EXE', img:'assets/img/work3.jpg',
   tags:'POSTER / ID / PRINT',
   desc:'Visual identity poster — blurred photo textures, marker lettering, analog print noise and torn composition layers.'}
];
const modal = document.getElementById('work-modal');
const wwImg = document.getElementById('ww-img');
const wwLoad = document.getElementById('ww-load');
const wwBarFill = document.getElementById('ww-bar-fill');
const wwLoadPct = document.getElementById('ww-load-pct');
const wwLoadText = document.getElementById('ww-load-text');
let wwTimer = null;
let curWork = 0;

function openWork(i){
  curWork = i;
  const w = WORKS[i];
  document.getElementById('ww-title-text').textContent = 'RUNNING: ' + w.file;
  document.getElementById('ww-num').textContent = w.num;
  document.getElementById('ww-name').textContent = w.title;
  document.getElementById('ww-tags').textContent = w.tags;
  document.getElementById('ww-desc').textContent = w.desc;
  wwImg.src = w.img;

  // фейковая загрузка ассета как на старте
  wwLoad.classList.remove('hide');
  wwBarFill.style.width = '0%'; wwLoadPct.textContent = '0%';
  wwLoadText.textContent = 'LOADING ASSET...';
  let lp = 0;
  clearInterval(wwTimer);
  wwTimer = setInterval(()=>{
    lp = Math.min(100, lp + Math.random()*16 + 6);
    wwBarFill.style.width = lp + '%';
    wwLoadPct.textContent = Math.floor(lp) + '%';
    if(lp >= 100){
      clearInterval(wwTimer);
      wwLoadText.textContent = 'ASSET LOADED — OK';
      setTimeout(()=>wwLoad.classList.add('hide'), 260);
    }
  }, 70);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeWork(){
  modal.classList.remove('open');
  clearInterval(wwTimer);
  if(loader.style.display === 'none' || site.classList.contains('show'))
    document.body.style.overflow = '';
}
document.querySelectorAll('.work-card').forEach(card=>{
  card.addEventListener('click', e=>{
    e.preventDefault();
    openWork(+card.dataset.i);
  });
});
document.getElementById('ww-close').addEventListener('click', closeWork);
document.getElementById('ww-cancel').addEventListener('click', closeWork);
document.getElementById('wm-back').addEventListener('click', closeWork);
/* ================= CASE VIEWER ================= */
const caseModal = document.getElementById('case-modal');
const cwFrame = document.getElementById('cw-frame');
const cwLoad = document.getElementById('cw-load');
const cwBarFill = document.getElementById('cw-bar-fill');
const cwLoadPct = document.getElementById('cw-load-pct');
const cwLoadText = document.getElementById('cw-load-text');
const cwStatus = document.getElementById('cw-status');
let cwTimer = null, cwLoaded = false;
const CASE_FILES = ['cases/case1/index.html', 'cases/case2/index.html', 'cases/case3/index.html']; // кейс по индексу работы

function openCase(){
  const w = WORKS[curWork];
  document.getElementById('cw-title-text').textContent = 'CASE_' + w.num + '.EXE — ' + w.title;
  document.getElementById('cw-url').textContent = 'xml.portfolio/cases/' + w.file.toLowerCase();
  cwStatus.textContent = 'MOUNTING';
  const file = CASE_FILES[curWork];
  const cw404 = document.getElementById('cw-404');
  if(file){
    cw404.style.display = 'none';
    cwFrame.style.display = '';
    if(cwFrame.dataset.case !== file){ cwFrame.src = file; cwFrame.dataset.case = file; }
    cwLoaded = true;
  }else{
    cwFrame.style.display = 'none';
    cw404.style.display = 'grid';
  }

  cwLoad.classList.remove('hide');
  cwBarFill.style.width = '0%'; cwLoadPct.textContent = '0%';
  cwLoadText.textContent = 'MOUNTING CASE...';
  let lp = 0;
  clearInterval(cwTimer);
  cwTimer = setInterval(()=>{
    lp = Math.min(100, lp + Math.random()*18 + 8);
    cwBarFill.style.width = lp + '%';
    cwLoadPct.textContent = Math.floor(lp) + '%';
    if(lp >= 100){
      clearInterval(cwTimer);
      cwLoadText.textContent = file ? 'CASE MOUNTED — OK' : 'CASE MISSING — 0x404';
      cwStatus.textContent = file ? 'LIVE' : 'MISSING';
      setTimeout(()=>cwLoad.classList.add('hide'), 300);
    }
  }, 70);

  caseModal.classList.add('open');
}
function closeCase(){
  caseModal.classList.remove('open');
  clearInterval(cwTimer);
  cwStatus.textContent = 'READY';
}
document.getElementById('cw-close').addEventListener('click', closeCase);

document.getElementById('ww-open').addEventListener('click', function(){
  this.textContent = 'MOUNTING...';
  setTimeout(()=>{ this.textContent = 'OPEN CASE'; openCase(); }, 420);
});
addEventListener('keydown', e=>{
  if(e.key === 'Escape'){
    if(caseModal.classList.contains('open')) closeCase();
    else closeWork();
  }
});
bindHovers();

/* dev: ?work=N — сразу открыть работу; ?case — сразу кейс */
const wq = location.search.match(/work=(\d)/);
if(wq) setTimeout(()=>openWork(+wq[1]), 300);
const cq = location.search.match(/case(\d)/);
if(cq && location.search.indexOf('instant') > -1)
  setTimeout(()=>{ openWork(+cq[1]); setTimeout(openCase, 500); }, 300);
else if(location.search.indexOf('case') > -1 && location.search.indexOf('instant') > -1)
  setTimeout(()=>{ openWork(1); setTimeout(openCase, 500); }, 300);

/* ================= NAME GLITCH ================= */
const name = document.querySelector('h1.name');
setInterval(()=>{
  if(Math.random() < .3){
    name.style.transform = 'translateX(' + (Math.random()*6-3) + 'px)';
    setTimeout(()=> name.style.transform = '', 70);
  }
}, 900);
