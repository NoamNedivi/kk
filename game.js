"use strict";
/* Keys Treasure Quest - 3D version (Three.js) */
const $=id=>document.getElementById(id);
const TAU=Math.PI*2,PI=Math.PI,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
const ov=$('o'),ctx=ov.getContext('2d');
let W,H,DPR,renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:true})}catch(e){$('err').style.display='flex';throw e}
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const camera=new THREE.PerspectiveCamera(46,1,5,14000);let QL=0,PRmax=2;
function resize(){DPR=Math.min(window.devicePixelRatio||1,PRmax);W=innerWidth;H=innerHeight;renderer.setPixelRatio(DPR);renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();ov.width=W*DPR;ov.height=H*DPR}
addEventListener('resize',resize);resize();

/* ---------- species journal ---------- */
const SP={
 mangrove:{n:'Red Mangrove',e:'🌳',z:'Mangroves',f:'Its arching prop roots make it look like the tree is walking on water. The roots shelter baby fish and protect the islands from storm waves.'},
 croc:{n:'American Crocodile',e:'🐊',z:'Mangroves',f:'South Florida is the only place in the U.S. where it lives - and the only place on Earth where crocodiles and alligators share a home. It is shy and avoids people.'},
 spoonbill:{n:'Roseate Spoonbill',e:'🦩',z:'Mangroves',f:'It gets its pink color from pigments in the shrimp and crustaceans it eats, sweeping its spoon-shaped bill side to side through the mud.'},
 upjelly:{n:'Upside-down Jellyfish',e:'🪼',z:'Mangroves',f:'It rests bell-down on the bottom so the algae living in its frilly arms can soak up sunlight and make food for it.'},
 snapper:{n:'Mangrove Snapper',e:'🐟',z:'Mangroves',f:'Young snappers hide among mangrove roots until they are big enough to move out to the reef. Mangroves are the reef\'s nursery.'},
 tarpon:{n:'Tarpon',e:'🥈',z:'Mangroves',f:'The "silver king" can gulp air at the surface, which lets it live in mangrove creeks with very little oxygen. Big ones top 200 pounds.'},
 horseshoe:{n:'Horseshoe Crab',e:'🛡️',z:'Mangroves',f:'Older than the dinosaurs - its family goes back over 400 million years - and more closely related to spiders than to crabs. Its blood is blue.'},
 osprey:{n:'Osprey',e:'🦅',z:'Mangroves',f:'The "fish hawk" dives feet-first to grab fish and can swivel one toe backward for a better grip. It builds huge stick nests on dead trees.'},
 stonecrab:{n:'Florida Stone Crab',e:'🦀',z:'Mangroves',f:'Its claws are strong enough to crush oyster shells. If it loses a claw it can grow a new one, so fishers take one claw and put the crab back.'},
 turtlegrass:{n:'Turtle Grass',e:'🌱',z:'Seagrass',f:'Seagrass is a true flowering plant, not seaweed. Its meadows hold the sea floor in place, store carbon and feed turtles and manatees.'},
 manatee:{n:'West Indian Manatee',e:'🦭',z:'Seagrass',f:'This gentle plant-eater can munch around a tenth of its body weight in seagrass each day. Boat strikes are a major danger, so boaters slow down.'},
 conch:{n:'Queen Conch',e:'🐚',z:'Seagrass',f:'This big sea snail grazes algae off the seagrass. It was overfished, so taking one has been illegal in Florida since the 1980s.'},
 seahorse:{n:'Lined Seahorse',e:'🐴',z:'Seagrass',f:'It grips seagrass with its curly tail so it will not drift away. The father carries the babies in a pouch.'},
 stingray:{n:'Southern Stingray',e:'🛸',z:'Seagrass',f:'It buries itself in sand with only its eyes showing. Waders do the "stingray shuffle" to warn it they are coming.'},
 seastar:{n:'Cushion Sea Star',e:'⭐',z:'Seagrass',f:'The biggest sea star in the Caribbean. Like all sea stars it has no brain and no blood - it pumps seawater through its body instead.'},
 sawfish:{n:'Smalltooth Sawfish',e:'🪚',z:'Seagrass',f:'A ray, not a shark. It swings its toothy saw to stun fish. It is critically endangered, and South Florida is its last stronghold in the U.S.'},
 seacucumber:{n:'Sea Cucumber',e:'🥒',z:'Seagrass',f:'The vacuum cleaner of the sea floor: it swallows sand, digests the scraps in it and leaves clean sand behind. It breathes through its rear end.'},
 elkhorn:{n:'Elkhorn Coral',e:'🪸',z:'Coral Reef',f:'Shaped like antlers, it was once the main reef builder here. It has declined by more than 90% since the 1980s and is now protected.'},
 brain:{n:'Brain Coral',e:'🧠',z:'Coral Reef',f:'Each boulder is a colony of thousands of tiny animals called polyps. Some colonies are hundreds of years old - one touch can damage them.'},
 parrotfish:{n:'Stoplight Parrotfish',e:'🐠',z:'Coral Reef',f:'It scrapes algae off the reef with its beak, grinds up the rock, and poops it out as white sand. A lot of beach sand is parrotfish poop!'},
 moray:{n:'Green Moray Eel',e:'🐍',z:'Coral Reef',f:'Its skin is really brownish - a layer of yellow slime makes it look green. It opens and closes its mouth to breathe, not to threaten.'},
 lionfish:{n:'Lionfish (invasive)',e:'🦁',z:'Coral Reef',f:'It belongs in the Indo-Pacific. Here it has no natural predators and gobbles up young reef fish, so divers help by removing it.'},
 turtle:{n:'Green Sea Turtle',e:'🐢',z:'Coral Reef',f:'Adults are mostly vegetarian and mow the seagrass like a lawn, which keeps the meadows healthy.'},
 angelfish:{n:'Queen Angelfish',e:'👑',z:'Coral Reef',f:'Named for the blue-ringed "crown" on its forehead. It mostly eats sponges.'},
 lobster:{n:'Caribbean Spiny Lobster',e:'🦞',z:'Coral Reef',f:'It has no big claws - just long spiny antennae. Spiny lobsters sometimes migrate across the sea floor in single-file lines.'},
 bluetang:{n:'Blue Tang',e:'🔵',z:'Coral Reef',f:'Babies are bright yellow and turn blue as they grow. Schools of tangs graze algae, which stops it from smothering the coral.'},
 puffer:{n:'Porcupinefish',e:'🐡',z:'Coral Reef',f:'When scared it gulps water and blows up into a spiky ball that is too big and too prickly to swallow.'},
 octopus:{n:'Caribbean Reef Octopus',e:'🐙',z:'Coral Reef',f:'A master of disguise that changes color and skin texture in a blink. It has three hearts and blue blood.'},
 squid:{n:'Caribbean Reef Squid',e:'🦑',z:'Coral Reef',f:'It "talks" with waves of color across its skin, and can even show a different pattern on each side of its body at once.'},
 xmasworm:{n:'Christmas Tree Worm',e:'🎄',z:'Coral Reef',f:'Those tiny colorful spirals on the brain coral are the breathing and feeding crowns of a worm living inside it. They vanish in a flash if a shadow passes.'},
 sergeant:{n:'Sergeant Major',e:'🎖️',z:'Coral Reef',f:'Named for its dark stripes, like the badge of an army sergeant. The father guards the purple egg patch and chases away fish many times his size.'},
 yellowtail:{n:'Yellowtail Snapper',e:'💛',z:'Coral Reef',f:'A fast, curious schooling fish with a bright yellow stripe running into its tail. It often follows divers around the reef.'},
 hogfish:{n:'Hogfish',e:'🐽',z:'Coral Reef',f:'It roots in the sand with its long pig-like snout to find crabs and snails. Every hogfish starts life female, and the biggest turn into males.'},
 trumpetfish:{n:'Trumpetfish',e:'🎺',z:'Coral Reef',f:'It hangs head-down among sea fans, swaying like a branch, then sucks in small fish that swim too close.'},
 loggerhead:{n:'Loggerhead Sea Turtle',e:'🐢',z:'Open Water',f:'Named for its big head and powerful jaws that crack conchs and crabs. Florida beaches are among the most important loggerhead nesting sites in the world.'},
 whaleshark:{n:'Whale Shark',e:'🐋',z:'Open Water',f:'The biggest fish in the sea - as long as a school bus - yet it eats only tiny plankton and fish eggs. It occasionally passes through Florida waters.'},
 flyingfish:{n:'Flying Fish',e:'✈️',z:'Open Water',f:'It bursts out of the water and glides on wing-like fins for hundreds of feet to escape predators such as mahi-mahi.'},
 dolphin:{n:'Bottlenose Dolphin',e:'🐬',z:'Open Water',f:'Dolphins in Florida Bay invented "mud-ring feeding": one stirs up a ring of mud and the trapped fish jump right into waiting mouths.'},
 nurse:{n:'Nurse Shark',e:'🦈',z:'Open Water',f:'A calm bottom-dweller that rests by day and slurps up prey like a vacuum at night. Leave it alone and it leaves you alone.'},
 reefshark:{n:'Caribbean Reef Shark',e:'🦈',z:'Open Water',f:'The most common shark on Caribbean reefs. As a top predator it keeps fish populations healthy. Shark bites on people are very rare - but give them space.'},
 hammerhead:{n:'Great Hammerhead',e:'🔨',z:'Open Water',f:'Its wide head is packed with sensors that pick up the tiny electric signals of stingrays hiding under the sand - its favorite meal.'},
 eagleray:{n:'Spotted Eagle Ray',e:'🦋',z:'Open Water',f:'It "flies" through open water by flapping its wing-like fins, and sometimes leaps clear out of the sea.'},
 grouper:{n:'Goliath Grouper',e:'🐟',z:'Open Water',f:'It can grow to 8 feet and 800 pounds and loves shipwrecks. It was nearly fished out and has been protected in Florida since 1990.'},
 cuda:{n:'Great Barracuda',e:'⚡',z:'Open Water',f:'A lightning-fast hunter that can sprint at about 35 mph. It is curious about shiny things - give it room.'},
 moonjelly:{n:'Moon Jellyfish',e:'🌕',z:'Open Water',f:'Sea turtles love to eat jellyfish. A floating plastic bag looks just like one - a good reason to pick up trash.'},
 manowar:{n:'Portuguese Man o\' War',e:'🎈',z:'Open Water',f:'Not one jellyfish but a colony of tiny animals working together. Its gas-filled float is a sail, and its stinging tentacles can trail 30 feet or more.'},
 deer:{n:'Key Deer',e:'🦌',z:'Islands',f:'The smallest deer in North America - about the size of a big dog. It lives only in the Florida Keys and is endangered.'},
 pelican:{n:'Brown Pelican',e:'🐦',z:'Islands',f:'It plunge-dives from the air to scoop up fish. It nearly vanished because of the pesticide DDT and bounced back after DDT was banned.'},
 frigate:{n:'Magnificent Frigatebird',e:'🪁',z:'Islands',f:'Its wings span over 7 feet, but its feathers are not waterproof, so it never lands on the sea. It snatches fish from the surface - or steals them from other birds.'},
 heron:{n:'Great White Heron',e:'🪶',z:'Islands',f:'An all-white form of the great blue heron found almost only in South Florida and the Keys.'},
 airboat:{n:'Airboat & Seagrass',e:'🚤',z:'Islands',f:'Your airboat is pushed by a fan above the water, so there is no propeller to cut "prop scars" through the seagrass. Scars can take years to heal.'}
};
const NSP=Object.keys(SP).length;

/* ---------- helpers ---------- */
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(x,y,s){let h=Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1442695041)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function dot(g,x,y,r){g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
let AC;function sfx(f,d,type,v){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.value=v||.07;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+(d||.15));o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.15))}catch(e){}}

/* ---------- world map (tile grid) ---------- */
const TILE=32,WX=120,WY=72,WW=WX*TILE,WH=WY*TILE;
const T={DEEP:0,SHAL:1,GRASS:2,REEF:3,MUD:4,MANG:5,SAND:6,HAM:7,ROCK:8,POST:9};
const map=new Uint8Array(WX*WY);
const cyf=tx=>52-tx*.3+3*Math.sin(tx*.09);
const tileAt=(x,y)=>{const tx=x/TILE|0,ty=y/TILE|0;return(tx<0||ty<0||tx>=WX||ty>=WY)?T.MANG:map[ty*WX+tx]};
const solid=t=>t>=5;
function genWorld(){
 for(let ty=0;ty<WY;ty++)for(let tx=0;tx<WX;tx++){
  const d=ty-cyf(tx);let w=1.6+1.5*Math.sin(tx*.33+1)+.9*vnoise(tx/5,1,7);if(Math.sin(tx*.21+.5)>.8)w=0;
  const m=vnoise(tx/3.5,ty/3.5,3),n=vnoise(tx/6,ty/6,5);let t;
  if(Math.abs(d)<w)t=Math.abs(d)>w-.9?T.SAND:T.HAM;
  else if(d<0){ if(ty<2)t=T.MANG;else if(m>.72&&d<-4)t=T.MANG;else if(m>.63&&d<-3)t=T.MUD;else t=n>.47?T.GRASS:T.SHAL }
  else if(d<4)t=n>.6?T.GRASS:T.SHAL;
  else if(d<10)t=vnoise(tx/2.5,ty/2.5,9)>.42?T.REEF:T.SHAL;
  else t=T.DEEP;
  map[ty*WX+tx]=t;
 }
}
function findTile(tx,ty,pred){tx=Math.round(tx);ty=Math.round(ty);for(let r=0;r<50;r++)for(let y=ty-r;y<=ty+r;y++)for(let x=tx-r;x<=tx+r;x++){if(Math.max(Math.abs(x-tx),Math.abs(y-ty))!==r)continue;if(x<2||y<3||x>=WX-2||y>=WY-2)continue;if(pred(map[y*WX+x],x,y))return{x:(x+.5)*TILE,y:(y+.5)*TILE}}return{x:tx*TILE,y:ty*TILE}}
const nearType=(x,y,t)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(map[(y+j)*WX+x+i]===t)return true;return false};
const setT=(p,t)=>{map[(p.y/TILE|0)*WX+(p.x/TILE|0)]=t};
const wet=t=>t===T.SHAL||t===T.GRASS;

/* ---------- landmarks + clue treasures ---------- */
const LM={};
const CACHES=[
 {id:'light',lm:'Old Heron Light',item:'a golden astrolabe',e:'🧭',clue:'"Where the tall lamp warns ships off the eastern reef, look in its morning shadow." (When the sun rises in the east, shadows fall to the west.)'},
 {id:'skull',lm:'Skull Rock',item:'an emerald ring',e:'💍',clue:'"A stone face with hollow eyes stares across the north-west bay. What it guards lies under its chin."'},
 {id:'piers',lm:'The Broken Railway',item:'a bag of gold doubloons',e:'🪙',clue:'"The iron road to Key West once leapt from island to island. Find three broken piers in a channel and search just south of the middle one."'},
 {id:'palms',lm:'Three Palm Sandbar',item:'a jade parrot idol',e:'🦜',clue:'"Three palms on a sandbar no bigger than a rowboat, on the ocean side of the western keys. Search where the waves lap its southern tip."'},
 {id:'shack',lm:'The Stilt Shack',item:'the ship cook\'s silver goblet',e:'🏆',clue:'"A fisherman\'s shack on stilts stands alone in the middle of the bay. The cook hid his pay under the east side of the porch."'},
 {id:'bell',lm:'The Red Bell Buoy',item:'the bosun\'s silver whistle',e:'🔔',clue:'"A red bell buoy rocks where the reef ends and the deep begins, south of the western keys. The bosun sank his share just north of it."'},
 {id:'cannon',lm:'Cannon Rock',item:'a sack of Spanish gold bars',e:'🧱',clue:'"On a lonely rock in the northern bay sits a rusty cannon that will never fire again. Search where its barrel points - to the east."'},
 {id:'anchor',lm:'The Giant Anchor',item:'a ruby-studded dagger',e:'🗡️',clue:'"A giant anchor rusts on an ocean-side beach of the eastern keys. Search the water just south of it."'},
 {id:'arch',lm:'The Needle\'s Eye',item:'a crown of sea-green opals',e:'👑',clue:'"The Needle\'s Eye is a stone arch standing in the sea off the far south-west keys. At noon its shadow falls to the north - search there."'},
 {id:'osprey',lm:'The Osprey Tree',item:'a rope of black pearls',e:'📿',clue:'"An osprey nests on a dead tree in the far north-east corner of the bay. Search among its roots, on the south-west side."'}
];
function placeLandmarks(){
 let p=findTile(100,cyf(100)+6,t=>t===T.REEF||t===T.SHAL);setT(p,T.SAND);LM.light=p;
 p=findTile(10,12,(t,x,y)=>wet(t)&&!nearType(x,y,T.MANG));setT(p,T.ROCK);LM.skull=p;
 LM.piers=[62,64,66].map(tx=>{const q={x:(tx+.5)*TILE,y:(Math.round(cyf(tx))+.5)*TILE};setT(q,T.ROCK);return q});
 p=findTile(26,cyf(26)+4,(t,x,y)=>wet(t)&&!nearType(x,y,T.SAND));setT(p,T.SAND);LM.palms=p;
 p=findTile(60,14,(t,x,y)=>wet(t)&&!nearType(x,y,T.MANG)&&!nearType(x,y,T.MUD));setT(p,T.POST);LM.shack=p;
 p=findTile(112,6,(t,x,y)=>wet(t)&&!nearType(x,y,T.MANG));setT(p,T.POST);LM.osprey=p;
 p=findTile(46,cyf(46)+12.5,t=>t===T.DEEP);setT(p,T.POST);LM.bell=p;
 p=findTile(38,7,(t,x,y)=>wet(t)&&!nearType(x,y,T.MANG)&&!nearType(x,y,T.MUD));setT(p,T.ROCK);LM.cannon=p;
 LM.anchor=findTile(88,cyf(88)+2,(t,x,y)=>t===T.SAND&&y>cyf(x)&&!solid(map[(y+1)*WX+x]));
 p=findTile(6,cyf(6)+6,t=>t===T.REEF||t===T.SHAL);setT(p,T.ROCK);LM.arch=p;
 const spot=(x,y)=>solid(tileAt(x,y))?findTile(x/TILE-.5,y/TILE-.5,t=>!solid(t)):{x,y};
 const at=[[LM.light.x-58,LM.light.y],[LM.skull.x,LM.skull.y+56],[LM.piers[1].x,LM.piers[1].y+52],[LM.palms.x,LM.palms.y+54],[LM.shack.x+58,LM.shack.y],[LM.bell.x,LM.bell.y-56],[LM.cannon.x+58,LM.cannon.y],[LM.anchor.x,LM.anchor.y+TILE+6],[LM.arch.x,LM.arch.y-56],[LM.osprey.x-42,LM.osprey.y+42]];
 CACHES.forEach((c,i)=>{const s=spot(at[i][0],at[i][1]);c.x=s.x;c.y=s.y});
}

const wc=document.createElement('canvas');
function paintWorld(){
 wc.width=WW/2;wc.height=WH/2;const g=wc.getContext('2d'),R=rng(11);g.scale(.5,.5);
 g.fillStyle='#0b4f8a';g.fillRect(0,0,WW,WH);
 const each=(pred,fn)=>{for(let ty=0;ty<WY;ty++)for(let tx=0;tx<WX;tx++){const t=map[ty*WX+tx];if(pred(t))fn((tx+.5)*TILE,(ty+.5)*TILE,t,tx,ty)}};
 g.fillStyle='#1877b3';each(t=>t!==T.DEEP,(x,y)=>dot(g,x,y,TILE*2));
 g.fillStyle='#27a0c4';each(t=>t!==T.DEEP,(x,y)=>dot(g,x,y,TILE*1.3));
 g.fillStyle='#43c2c9';each(t=>t!==T.DEEP&&t!==T.REEF,(x,y)=>dot(g,x,y,TILE*.85));
 each(t=>t===T.GRASS,(x,y)=>{for(let i=0;i<5;i++){g.fillStyle=`rgba(${20+R()*20|0},${105+R()*30|0},${95+R()*20|0},.5)`;g.beginPath();g.ellipse(x+(R()-.5)*TILE,y+(R()-.5)*TILE,6+R()*9,3+R()*5,R()*3,0,TAU);g.fill()}});
 const cc=['#e0763c','#c9568f','#e9b44c','#8e5fc7','#d9a441','#b5651d'];
 each(t=>t===T.REEF,(x,y)=>{g.fillStyle='#35b3cf';dot(g,x,y,TILE*.8);for(let i=0;i<6;i++){g.fillStyle=cc[R()*cc.length|0];g.globalAlpha=.75;dot(g,x+(R()-.5)*TILE,y+(R()-.5)*TILE,2+R()*5);g.globalAlpha=1}});
 g.fillStyle='#b7ae7c';each(t=>t===T.MUD,(x,y)=>dot(g,x,y,TILE*.8));
 g.fillStyle='#f3e4b3';each(t=>t===T.SAND||t===T.HAM,(x,y)=>dot(g,x,y,TILE*.9));
 g.fillStyle='#4c9a52';each(t=>t===T.HAM,(x,y)=>dot(g,x,y,TILE*.8));
 g.fillStyle='#5b4a2e';each(t=>t===T.MANG,(x,y)=>dot(g,x,y,TILE*.82));
 g.fillStyle='#2b7447';each(t=>t===T.MANG,(x,y)=>dot(g,x,y,TILE*.6));
 g.fillStyle='#8d8a80';each(t=>t===T.ROCK,(x,y)=>dot(g,x,y,TILE*.6));
}

/* ---------- dive sites ---------- */
const SITES=[
 {id:'mangrove',name:'Walking-Tree Creek',eco:'Mangrove Forest',icon:'🌳',W:1900,D:390,drain:1.25,c1:'#7dba98',c2:'#2c5a48',floor:'#6d5e43',
  intro:'The water here is tea-colored from fallen leaves. Tangled red mangrove roots hide all sorts of young fish - and maybe an old bottle.',
  clue:'"Piece the second lies where the sea cows graze a meadow beneath the waves, far up the bay to the north-east."',next:'Find the seagrass meadow in the north-east of Florida Bay.'},
 {id:'seagrass',name:'Sea Cow Meadow',eco:'Seagrass Meadow',icon:'🌱',W:2300,D:430,drain:1.25,c1:'#63cfc6',c2:'#1b7a84',floor:'#d8cc9c',
  intro:'A waving underwater prairie of turtle grass. Somewhere in it is a sunken skiff. Watch for stingrays hiding in the sand!',
  clue:'"Piece the third rests where the stone grows like antlers, on the ocean side of the islands."',next:'Cross a channel between the islands to the coral reef on the Atlantic side.'},
 {id:'reef',name:'Antler Reef',eco:'Coral Reef',icon:'🪸',W:2500,D:570,drain:1.3,c1:'#45badb',c2:'#0e5b92',floor:'#cfc194',
  intro:'Florida\'s Coral Reef is the only living barrier reef in the continental United States. Look, but never touch - coral is alive!',
  clue:'"Piece the fourth sleeps in the galleon the hurricane swallowed, out in the deep blue to the east."',next:'Head east into deep water and find the shipwreck.'},
 {id:'wreck',name:'Wreck of the Santa Rosalia',eco:'Shipwreck (artificial reef)',icon:'⚓',W:2700,D:720,drain:1.4,c1:'#2587b8',c2:'#052845',floor:'#8f8a72',locked:true,
  intro:'In 1733 a hurricane smashed a Spanish treasure fleet along these reefs. Old wrecks become artificial reefs full of life. The chest is locked - search the stern cabin for a key.',
  clue:'The four pieces fit together! A big red X marks <b>Blacktide\'s Hole</b>, a deep blue hole off the south-west keys.',next:'Sail to the red X in the far south-west and dive Blacktide\'s Hole.'},
 {id:'hole',name:'Blacktide\'s Hole',eco:'Blue Hole',icon:'❌',W:2000,D:900,drain:1.75,c1:'#2c8fc4',c2:'#020d20',floor:'#7c8794',
  intro:'A sinkhole in the sea floor, dark and deep. Your air goes faster down here. The treasure should be at the very bottom...'}
];
const WRECKS=[
 {id:'bonus',name:'Wreck of the Sea Witch',eco:'Pirate Shipwreck',icon:'☠️',W:2400,D:640,drain:1.35,c1:'#2a8fbd',c2:'#06304f',floor:'#948e74',hx:700,relic:'Captain Blacktide\'s brass spyglass',
  intro:'A pirate sloop that ran onto the rocks in a storm. Reef sharks patrol the hull, so time your swim. Scoop up the gold doubloons and find the chest in the bow (right end).'},
 {id:'bonus',name:'Wreck of the Crimson Gull',eco:'Pirate Shipwreck',icon:'☠️',W:2400,D:500,drain:1.3,c1:'#3fb0d2',c2:'#0d5a8c',floor:'#cbbd92',hx:800,relic:'the ship\'s bronze bell',
  intro:'A shallow wreck on the back reef - her broken mast still pokes out of the water. Sharks cruise here too. Collect the doubloons and find the chest in the bow (right end).'},
 {id:'bonus',name:'Wreck of the Iron Parrot',eco:'Pirate Shipwreck',icon:'☠️',W:2400,D:760,drain:1.5,c1:'#2380b0',c2:'#041f3a',floor:'#868a80',hx:750,locked:true,relic:'a strongbox of silver pieces of eight',
  intro:'The deepest pirate wreck in the Keys, guarded by a great hammerhead. The chest is locked - the key is in the stern cabin (left end of the ship).'}
];
function placeSites(){
 const q=[findTile(40,cyf(40)+15,t=>t===T.DEEP),findTile(86,cyf(86)+7,t=>t===T.REEF||t===T.SHAL),findTile(72,cyf(72)+18,t=>t===T.DEEP)];
 WRECKS.forEach((w,i)=>{w.x=q[i].x;w.y=q[i].y});
 const p=[
  findTile(26,24,(t,x,y)=>wet(t)&&nearType(x,y,T.MANG)),
  findTile(94,10,(t,x,y)=>t===T.GRASS&&!nearType(x,y,T.MANG)),
  findTile(60,cyf(60)+7,t=>t===T.REEF),
  findTile(105,cyf(105)+16,t=>t===T.DEEP),
  findTile(14,cyf(14)+14,t=>t===T.DEEP)];
 SITES.forEach((s,i)=>{s.x=p[i].x;s.y=p[i].y});
}

/* ================= 3D kit ================= */
const SPH=new THREE.SphereGeometry(1,14,10),ICO=new THREE.IcosahedronGeometry(1,1),BOX=new THREE.BoxGeometry(1,1,1),CYL=new THREE.CylinderGeometry(1,1,1,10),CONE=new THREE.ConeGeometry(1,1,10),
 DOME=new THREE.SphereGeometry(1,14,8,0,TAU,0,PI/2),TOR=new THREE.TorusGeometry(1,.09,6,24),RING=new THREE.RingGeometry(.9,1,48),DISC=new THREE.CircleGeometry(1,20),PLANE=new THREE.PlaneGeometry(1,1);
[SPH,ICO,BOX,CYL,CONE,DOME,TOR,RING,DISC,PLANE].forEach(g=>{g.userData.shared=1});
const MC={};
function M(c,o){const k=c+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8,metalness:0,envMapIntensity:.55},o||{})))}
const mk=geo=>(c,sx,sy,sz,x,y,z,rx,ry,rz,o)=>{const m=new THREE.Mesh(geo,M(c,o));m.scale.set(sx,sy,sz);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);return m};
const E=mk(SPH),B=mk(BOX),Y=mk(CYL),C=mk(CONE),D=mk(DOME),I=mk(ICO),TO=mk(TOR);
function Gp(){const g=new THREE.Group();for(let i=0;i<arguments.length;i++)g.add(arguments[i]);return g}
const UP=new THREE.Vector3(0,1,0),_v=new THREE.Vector3();
function aim(m,x,y,z){_v.set(x,y,z).normalize();m.quaternion.setFromUnitVectors(UP,_v);return m}
function eyes(g,x,y,z,r){for(const s of[1,-1]){g.add(E('#ffffff',r,r,r*.6,x,y,z*s),E('#111111',r*.55,r*.55,r*.45,x+r*.25,y,z*s+s*r*.4))}}
function canvasTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const glowTex=canvasTex(64,64,g=>{const r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(255,225,110,.9)');r.addColorStop(1,'rgba(255,225,110,0)');g.fillStyle=r;g.fillRect(0,0,64,64)});
function glow(s){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));sp.scale.set(s,s,1);return sp}
const TR={transparent:true,opacity:.6};

/* ---- underwater creature models: face +X, Y up ---- */
function fishM(L,Hh,c1,c2,th){th=th||Hh*.24;const g=Gp(E(c1,L*.5,Hh*.5,th)),tail=Gp(C(c2,Hh*.5,L*.34,Hh*.07,-L*.15,0,0,0,0,-PI/2));tail.position.x=-L*.4;
 g.add(tail,C(c2,L*.16,Hh*.42,Hh*.05,-L*.05,Hh*.5,0),C(c2,L*.09,Hh*.3,Hh*.04,L*.1,-Hh*.25,th,2,0,.6),C(c2,L*.09,Hh*.3,Hh*.04,L*.1,-Hh*.25,-th,-2,0,.6));eyes(g,L*.3,Hh*.1,th*.78,Math.max(1.5,Hh*.1));g.userData.tail=tail;return g}
function sharkM(col,belly,ham){const g=Gp(E(col,66,14,12),E(belly,58,9,10.5,2,-5.5,0),C(col,11,30,9.5,72,-1,0,0,0,-PI/2),C(col,10,30,2,-19,25,0,0,0,.5),
  C(col,8,34,2,22,-12,18,2,0,0),C(col,8,34,2,22,-12,-18,-2,0,0),C(col,4,14,1.5,-36,13,0,0,0,.6));
 const tail=Gp(C(col,7,36,2,-13,11,0,0,0,.9),C(col,6,22,2,-8,-7,0,0,0,PI-.9));tail.position.x=-58;g.add(tail);g.userData.tail=tail;g.userData.ts=4;
 if(ham){g.add(B(col,11,5,46,74,0,0));eyes(g,76,0,23,2.2)}else eyes(g,54,3,9.5,2);return g}
const MODEL={
 fish(c){if(c.school){const g=Gp();for(let i=0;i<c.school;i++){const f=fishM(c.L,c.Hh,c.c1,c.c2);f.position.set(Math.sin(i*2.4)*34,Math.cos(i*1.7)*20,Math.sin(i*4.1)*26);g.add(f)}g.userData.kids=1;return g}
  const g=fishM(c.L,c.Hh,c.c1,c.c2,c.th);
  if(c.sp==='parrotfish')g.add(E('#f5d33b',3,3,c.Hh*.25,-c.L*.3,0,0),E('#e95d8f',c.L*.3,c.Hh*.2,c.Hh*.25,0,-c.Hh*.3,0));
  if(c.sp==='angelfish')g.add(E('#f5d33b',c.L*.3,c.Hh*.3,c.Hh*.25,-2,0,0),TO('#1c3fa0',3.5,3.5,3.5,c.L*.2,c.Hh*.36,c.Hh*.12));
  if(c.spots)for(let i=0;i<14;i++){const a=i*2.4,b=Math.cos(i*3.3)*.6;g.add(E('#3a3a1c',4,4,2,Math.cos(a)*c.L*.33,b*c.Hh*.4,(i%2?1:-1)*c.Hh*.215))}
  return g},
 lion(){const g=fishM(30,16,'#b5452c','#e9d7c0',5);for(let i=0;i<13;i++){const b=.7+i*.41;g.add(Y('#f1e3d0',.55,26,.55,Math.cos(b)*13,Math.sin(b)*13,(i%3-1)*6,0,0,b-PI/2))}
  g.add(E('#f1e3d0',1.6,8.2,5.3,6,0,0),E('#f1e3d0',1.6,8.3,5.3,-3,0,0),E('#f1e3d0',1.5,7,5,-10,0,0));return g},
 cuda(){const g=Gp(E('#b9c4cc',56,8,6),C('#b9c4cc',6,26,5,62,0,0,0,0,-PI/2),C('#8a98a3',5,10,1,-10,9,0,0,0,.4)),tail=Gp(C('#8a98a3',12,18,1.5,-8,0,0,0,0,-PI/2));tail.position.x=-52;g.add(tail);
  for(let i=0;i<5;i++)g.add(E('#55626c',2.2,2.2,6.2,-30+i*13,-2,0));eyes(g,44,2,4.6,2.4);g.userData.tail=tail;g.userData.ts=9;return g},
 gshark(c){return sharkM('#6f7f8c','#dfe6ea',c.ham)},
 shark(){const g=sharkM('#a58c6a','#c9b592');g.scale.set(1,.8,1.1);g.userData.tail=null;return g},
 moray(){const g=Gp(E('#4a4438',24,13,20,-34,-20,0),I('#5a5346',14,10,12,-14,-26,10));const pts=[[-32,-12,8],[-27,-2,7.5],[-18,6,7],[-6,11,7],[7,13,7]];for(const p of pts)g.add(E('#6f9a3a',p[2],p[2],p[2],p[0],p[1],0));
  const head=Gp(E('#6f9a3a',13,7.5,7,6,0,0),E('#3a1a1a',6,2.4,5,13,-3.5,0));eyes(head,9,4,5.5,2);head.position.set(10,13,0);g.add(head);g.userData.anim=(m,c,t)=>{head.rotation.z=Math.sin(t*2)*.18;head.position.y=13+Math.sin(t*2)*2};return g},
 jelly(){const g=Gp(D('#ebe1ff',20,15,20,0,0,0,0,0,0,{transparent:true,opacity:.55}),E('#ffffff',17,3,17,0,1,0,0,0,0,{transparent:true,opacity:.35}));
  for(let i=0;i<4;i++)g.add(TO('#ffaadc',3.4,3.4,3.4,(i%2?1:-1)*6,5,(i>1?1:-1)*6,PI/2));
  for(let i=0;i<9;i++){const a=i*.7;g.add(Y('#ffdcf0',.6,26+i%3*5,.6,Math.cos(a)*13,-14,Math.sin(a)*13,0,0,0,TR))}
  g.userData.anim=(m,c,t)=>{const p=Math.sin(t*2.4)*.1;m.scale.set(1+p,1-p,1+p)};return g},
 manowar(){const g=Gp(E('#9a8cf0',17,8,7,0,3,0,0,0,0,{transparent:true,opacity:.75}),E('#f0a0d8',15,4,1.2,0,10,0,0,0,0,{transparent:true,opacity:.8}));
  for(let i=0;i<10;i++)g.add(Y(i%2?'#6a5acd':'#4b8fd0',.7,90+i%4*12,.7,-11+i*2.4,-48-i%4*6,(i%3-1)*4,0,0,0,TR));
  g.userData.anim=(m,c,t)=>{m.rotation.z=Math.sin(t*.8+c.ph)*.07};return g},
 upjelly(){const g=Gp(E('#96784a',19,4,19,0,-3,0));for(let i=0;i<10;i++){const a=i*.63;g.add(C('#b7c96a',3,15,3,Math.cos(a)*9,6,Math.sin(a)*9,Math.sin(a)*.35,0,-Math.cos(a)*.35))}g.add(C('#d6e08a',4,14,4,0,7,0));return g},
 turtle(c){const sh=c&&c.shell||'#5b6e3a',sk=c&&c.skin||'#7a9a55',g=Gp(E(sh,25,11,19),E('#c9c08a',22,6,16,0,-5,0),E(sk,8,6,6,31,2,0),E(sk,9,1.6,5,-23,-3,11,0,.5),E(sk,9,1.6,5,-23,-3,-11,0,-.5));if(c&&c.sc)g.scale.setScalar(c.sc);eyes(g,35,3,4.6,1.5);
  for(let i=0;i<5;i++)g.add(E(sk,6,1,5,-14+i*7,10.3-Math.abs(i-2)*.9,0));
  const fl=[1,-1].map(s=>{const f=Gp(E(sk,7,1.8,16,-4,0,s*15,0,s*.35,0));f.position.set(14,-2,s*15);g.add(f);return f});
  g.userData.anim=(m,c,t)=>{const a=Math.sin(t*3)*.5;fl[0].rotation.x=a;fl[1].rotation.x=-a};return g},
 manatee(){const g=Gp(E('#8b949a',74,28,30),E('#8b949a',25,19,21,70,-4,0),E('#737c82',11,9,12,89,-10,0),E('#8b949a',9,18,5,34,-24,23,.4,0,.5),E('#8b949a',9,18,5,34,-24,-23,-.4,0,.5));eyes(g,80,4,17,2);
  const tail=Gp(E('#8b949a',27,5,23,-24,0,0));tail.position.x=-66;g.add(tail);g.userData.anim=(m,c,t)=>{tail.rotation.z=Math.sin(t*1.5)*.22};return g},
 ray(){const g=Gp(E('#96876a',27,3,25),Y('#7d6f52',1,36,1,-42,1,0,0,0,PI/2),E('#111111',1.8,1.8,1.8,12,2.6,5),E('#111111',1.8,1.8,1.8,12,2.6,-5));return g},
 eagleray(){const g=Gp(E('#3a3f5a',26,5,13),E('#e8e8f0',22,3,11,1,-2.5,0),E('#3a3f5a',9,5,8,26,0,0),Y('#2a2e44',.9,80,.9,-62,0,0,0,0,PI/2));eyes(g,30,2,7,1.6);
  const w=[1,-1].map(s=>{const f=Gp(C('#3a3f5a',20,46,2.4,0,0,s*23,s*PI/2));for(let i=0;i<4;i++)f.add(E('#e8e8f0',2,.6,2,-6+i*5,1.6,s*(8+i*6)));f.position.set(0,0,s*8);g.add(f);return f});
  for(let i=0;i<5;i++)g.add(E('#e8e8f0',2,.6,2,-12+i*7,4.6,(i%2?3:-3)));
  g.userData.anim=(m,c,t)=>{const a=Math.sin(t*2.4)*.55;w[0].rotation.x=-a;w[1].rotation.x=a};return g},
 sawfish(){const g=Gp(E('#9a8f6e',58,7,17),E('#d8d0b0',50,4,14,0,-3.5,0),B('#b8ad8c',50,2,7,80,0,0),C('#9a8f6e',8,20,2,-6,13,0,0,0,.5),C('#9a8f6e',6,16,2,-30,11,0,0,0,.5),E('#9a8f6e',16,2,26,18,-1,0));
  for(let i=0;i<9;i++){g.add(C('#e8e0c0',1,5,1,60+i*5,0,5.5,PI/2),C('#e8e0c0',1,5,1,60+i*5,0,-5.5,-PI/2))}
  const tail=Gp(C('#9a8f6e',6,30,2,-11,9,0,0,0,.9),C('#9a8f6e',5,16,2,-6,-5,0,0,0,PI-.9));tail.position.x=-52;g.add(tail);eyes(g,44,5,9,1.8);g.userData.tail=tail;g.userData.ts=3;return g},
 conch(){return Gp(C('#e8b58a',9,24,9,-2,0,0,0,0,PI/2),E('#e8b58a',9,8,9,8,0,0),E('#f48fa5',7,4,6,8,-2,7),C('#e8b58a',2,5,2,2,8,0),C('#e8b58a',2,5,2,8,9,0))},
 seahorse(){const g=Gp();for(const p of[[4,14,4.2],[0,8,3.4],[-3,2,4.4],[-1,-5,3.4],[2,-11,2.6],[1,-16,2],[-2,-18,1.6],[-4,-16,1.3]])g.add(E('#d6a23a',p[2],p[2],p[2]*.8,p[0],p[1],0));
  g.add(Y('#d6a23a',1.1,8,1.1,10,13,0,0,0,PI/2),C('#b8862a',2,5,1,-7,3,0,0,0,PI/2),C('#b8862a',2,4,1,4,19,0));eyes(g,5,15,3,1.1);g.userData.anim=(m,c,t)=>{m.rotation.z=Math.sin(t*1.5+c.ph)*.12};return g},
 seastar(){const g=Gp(E('#e07b2a',6,6,3.4));for(let i=0;i<5;i++){const a=i*TAU/5+PI/2;g.add(C('#e07b2a',4.4,15,3,Math.cos(a)*9,Math.sin(a)*9,0,0,0,a-PI/2));g.add(E('#f6b25a',1.2,1.2,1.2,Math.cos(a)*7,Math.sin(a)*7,3))}g.rotation.x=-.95;return g},
 lobster(){const g=Gp(E('#b8452f',15,6,6),E('#b8452f',10,4.6,5,-19,-1,0),C('#a03a26',7,9,1.2,-32,-1,0,0,0,-PI/2));for(const s of[1,-1]){g.add(Y('#c8553a',.6,48,.6,32,14,s*4,0,s*.15,-1));for(let i=0;i<4;i++)g.add(Y('#a03a26',.8,10,.8,-6+i*5,-6,s*5,s*.5))}eyes(g,13,4,3,1.2);
  g.userData.anim=(m,c,t)=>{m.children[3].rotation.z=-1+Math.sin(t*2)*.1;m.children[8].rotation.z=-1+Math.cos(t*2)*.1};return g},
 horseshoe(){return Gp(D('#7a5a34',14,8,13),D('#6b4e2c',9,5,9,-11,0,0),Y('#5d4426',.9,22,.9,-29,2,0,0,0,PI/2),E('#111111',1.2,1.2,1.2,5,5,8),E('#111111',1.2,1.2,1.2,5,5,-8))},
 octopus(){const head=E('#c8642f',13,16,13,0,12,0),g=Gp(head);eyes(g,9,9,8,2.6);const arms=[];
  for(let i=0;i<8;i++){const a=i*TAU/8+.3,arm=Gp();[[10,2,5],[18,-3,4.2],[26,-6,3.3],[33,-7,2.4],[38,-6,1.7]].forEach(p=>arm.add(E('#b5562a',p[2],p[2],p[2],p[0],p[1],0)));arm.rotation.y=a;g.add(arm);arms.push(arm)}
  g.userData.anim=(m,c,t)=>{head.scale.y=16+Math.sin(t*2)*1.5;arms.forEach((a,i)=>{a.rotation.z=Math.sin(t*1.6+i)*.12})};return g},
 squid(){const g=Gp();for(let k=0;k<3;k++){const s=Gp(C('#d98a7a',6,36,6,-8,0,0,0,0,PI/2),E('#d98a7a',6.5,5,5.5,12,0,0),E('#e8a898',10,1.4,11,-14,0,0));for(let i=0;i<7;i++)s.add(C('#d98a7a',1.4,17,1.4,26,Math.cos(i*.9)*2.4,Math.sin(i*.9)*2.4,0,0,-PI/2));eyes(s,13,1,5,2.3);s.position.set(-k*44,k%2*18-9,k*14-14);g.add(s)}
  g.userData.anim=(m,c,t)=>{m.children.forEach((s,i)=>{s.children[2].rotation.x=Math.sin(t*5+i)*.3})};return g},
 puffer(){const g=Gp(E('#d9c27a',15,14,14),E('#f3ecd0',13,9,12.5,1,-5,0));for(let i=0;i<34;i++){const y=1-2*(i+.5)/34,r=Math.sqrt(1-y*y),a=i*2.4;const s=C('#f3e9c8',1.4,6,1.4,r*Math.cos(a)*15,y*14,r*Math.sin(a)*14);aim(s,r*Math.cos(a),y,r*Math.sin(a));g.add(s)}
  const tail=Gp(C('#b8a25a',5,9,1,-4,0,0,0,0,-PI/2));tail.position.x=-14;g.add(tail);eyes(g,10,4,10.5,3.2);g.userData.tail=tail;return g},
 whaleshark(){const g=sharkM('#4a6078','#dfe6ea');g.add(E('#4a6078',26,11,17,50,0,0));for(let i=0;i<46;i++){const a=i*2.4,x=-50+(i*37%110);g.add(E('#e8f0f4',1.8,1,1.8,x,13.2-Math.abs(Math.sin(a))*4-Math.abs(x)*.03,Math.sin(a)*8))}g.scale.setScalar(3.3);g.userData.ts=1.4;return g},
 trumpet(){const f=Gp(E('#b58a3a',34,3.6,3.6),Y('#b58a3a',1.7,18,1.7,40,0,0,0,0,PI/2),C('#8a6a2a',4,8,1,-37,0,0,0,0,-PI/2),C('#8a6a2a',3,6,1,-24,4,0),C('#8a6a2a',3,6,1,-24,-4,0,PI));eyes(f,30,1,3,1.4);f.rotation.z=-1.15;const g=Gp(f);g.userData.anim=(m,c,t)=>{f.rotation.z=-1.15+Math.sin(t*.9+c.ph)*.12};return g},
 seacucumber(){const g=Gp(E('#5a4630',17,6,7));for(let i=0;i<12;i++)g.add(E('#7a6244',1.8,1.8,1.8,-13+i*2.4,4.6-Math.abs(i-5.5)*.25,(i%3-1)*3.4));for(let i=0;i<5;i++)g.add(C('#c9a878',.9,5,.9,17+Math.cos(i)*1.5,Math.sin(i*1.3)*2,Math.cos(i*2)*2,0,0,-PI/2));return g},
 stonecrab(){const g=Gp(E('#8a5a3a',10,5,8),E('#c9a070',8,3,6.5,0,-2,0));for(const s of[1,-1]){g.add(E('#b5744a',6,4.4,4,10,1,s*8),E('#1c1c1c',3.2,2.4,2.4,15,1,s*8.5));for(let i=0;i<3;i++)g.add(Y('#7a4a2a',.9,9,.9,-4+i*4,-4,s*9,s*.9))}g.add(E('#111111',1,1.4,1,7,5,3),E('#111111',1,1.4,1,7,5,-3));return g},
 croc(){const g=Gp(E('#55683a',52,9,13),E('#c9c89a',46,5,11,0,-4.5,0),B('#55683a',42,6,9,64,0,0),E('#e8d94a',2.4,2.4,2.4,44,7,5),E('#e8d94a',2.4,2.4,2.4,44,7,-5));
  for(const s of[1,-1])for(const x of[-22,24])g.add(E('#55683a',5,11,4,x,-9,s*11,s*.5));
  const tail=Gp(C('#55683a',8,62,5,-31,0,0,0,0,PI/2));tail.position.x=-46;g.add(tail);g.userData.tail=tail;g.userData.ts=2;return g}
};
function animModel(m,c,t){const u=m.userData;if(u.tail)u.tail.rotation.y=Math.sin(t*(u.ts||7)+c.ph)*.4;if(u.kids)for(let i=0;i<m.children.length;i++)m.children[i].userData.tail.rotation.y=Math.sin(t*8+i)*.4;if(u.anim)u.anim(m,c,t)}

function diverM(){const g=Gp(E('#17222e',14,7,7.5),B('#ff5a4d',4,14.4,15.4,-2,0,0),Y('#ffd34d',4.5,20,4.5,-2,10,0,0,0,PI/2),E('#17222e',7.4,7.4,7.4,16.5,2.5,0),E('#e9b98d',6,6,6,18.5,1.5,0),B('#8fe0ff',3,5,9.5,23.4,2.5,0),B('#17222e',1.5,6.4,10.6,22.4,2.5,0),
  Y('#17222e',2.2,15,2.2,12,-6,6.5,0,0,-1.1),Y('#17222e',2.2,15,2.2,12,-6,-6.5,0,0,-1.1),E('#e9b98d',2.5,2.5,2.5,19,-9.5,6.5),E('#e9b98d',2.5,2.5,2.5,19,-9.5,-6.5));
 const legs=[1,-1].map(s=>{const l=Gp(Y('#17222e',2.8,22,2.8,-11,0,0,0,0,PI/2),B('#ffd34d',17,1.4,8,-30,0,0));l.position.set(-10,0,s*3.6);g.add(l);return l});g.userData.legs=legs;return g}
function boatM(){const g=Gp(B('#d5dbdf',52,5,25,0,3,0),B('#d5dbdf',13,5,25,30,5.4,0,0,0,.42),B('#aab3b8',52,1.2,22,0,6,0),B('#e0763c',8,5,16,8,9,0),B('#3d4a55',8,12,10,-6,12,0),
  E('#2f6fa8',4.4,6,4.4,-5,24,0),E('#e9b98d',3.4,3.4,3.4,-5,32,0),Y('#f3e4b3',5.2,.8,5.2,-5,35,0),Y('#f3e4b3',3,3,3,-5,36.5,0),B('#555f66',9,9,9,-17,12,0),
  TO('#39444d',13,13,13,-23,19,0,0,PI/2),B('#39444d',1,26,1,-23,19,0),B('#39444d',1,1,26,-23,19,0),B('#8f989e',1,18,7,-31,19,5),B('#8f989e',1,18,7,-31,19,-5));
 const fan=Gp(B('#222222',1.6,24,3.4),B('#222222',1.6,3.4,24));fan.position.set(-21.5,19,0);g.add(fan);g.userData.fan=fan;return g}
/* ---- surface models: face +X, stand on y=0 ---- */
function palmM(h,lean){const g=Gp();const top=[Math.sin(lean)*h,Math.cos(lean)*h];g.add(Y('#8a6a3a',2,h,2,top[0]/2,top[1]/2,0,0,0,-lean));
 for(let i=0;i<8;i++){const a=i*TAU/8,f=C('#2f8a3e',4.5,22,1.2,0,0,0);aim(f,Math.cos(a),-.35,Math.sin(a));f.position.set(top[0]+Math.cos(a)*10,top[1]-3.5,Math.sin(a)*10);g.add(f)}g.add(E('#6b4a2a',3,3,3,top[0],top[1]-2,0));return g}
function birdM(body,wing,headc,span){const g=Gp(E(body,13,5,6),E(headc,4,4,4,13,3,0));const w=[1,-1].map(s=>{const f=Gp(B(wing,11,1,span,0,0,s*span/2));f.position.set(0,2,s*4);g.add(f);return f});g.userData.w=w;return g}
const SURF={
 manatee(){const g=Gp(),m=MODEL.manatee();m.scale.setScalar(.34);m.position.y=-7;const r=new THREE.Mesh(RING,new THREE.MeshBasicMaterial({color:'#ffdc50',transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-PI/2;r.scale.setScalar(60);r.position.y=.6;g.add(m,r);g.userData.b=m;return g},
 dolphin(){const g=Gp(E('#6f8597',20,6,6),E('#c9d3da',16,4,5,2,-2.2,0),C('#6f8597',2.6,10,2.6,23,-1,0,0,0,-PI/2),C('#6f8597',4,9,1.2,-3,8,0,0,0,.5),E('#6f8597',5,1.2,10,-22,0,0),E('#6f8597',2,5,1.2,6,-5,5,.6),E('#6f8597',2,5,1.2,6,-5,-5,-.6));eyes(g,15,1,4.6,1);return g},
 fin(){const g=sharkM('#5f707d','#cfd8dd');g.scale.setScalar(.5);return g},
 turtle(){const g=MODEL.turtle();g.scale.setScalar(.55);return g},
 pelican(){const g=birdM('#8a7560','#6d5a48','#f3e9c8',26);g.add(C('#d9a441',1.7,15,1.7,23,2,0,0,0,-PI/2),E('#d9a441',5,2.4,1.6,19,0,0));return g},
 frigate(){const g=Gp(E('#1a1a1e',14,3.4,4),E('#1a1a1e',3.4,3.4,3.4,13,1,0),E('#d0302a',3.4,3.4,3.4,9,-3,0),C('#555555',1,9,1,20,1,0,0,0,-PI/2),C('#1a1a1e',1.6,22,.8,-22,0,3,0,.15,PI/2),C('#1a1a1e',1.6,22,.8,-22,0,-3,0,-.15,PI/2));
  for(const s of[1,-1])g.add(B('#1a1a1e',10,.8,28,3,0,s*15,0,-s*.25,0),B('#1a1a1e',6,.8,26,-5,0,s*40,0,s*.5,0));return g},
 spoonbill(){return Gp(E('#f58fb0',9,6,6,0,17,0),Y('#c0506a',.7,14,.7,1,7,2.4),Y('#c0506a',.7,14,.7,-1,7,-2.4),Y('#ffd5e2',1.5,11,1.5,9,24,0,0,0,-.6),E('#ffffff',3.2,3.2,3.2,12,29.5,0),B('#9aa08a',10,1,2,18,28,0,0,0,-.2),E('#9aa08a',2.8,.9,2.8,23,27,0),E('#111111',.8,.8,.8,13.4,30.4,2.6),E('#e0507a',7,3,2,-3,18,5.4),E('#e0507a',7,3,2,-3,18,-5.4))},
 heron(){return Gp(E('#ffffff',9,5.5,5.5,0,23,0),Y('#d9c36a',.7,20,.7,1,10,2.2),Y('#d9c36a',.7,20,.7,-1,10,-2.2),Y('#ffffff',1.4,16,1.4,9,33,0,0,0,-.5),E('#ffffff',3,3,3,13.5,41,0),C('#e9b44c',1.2,10,1.2,20,40.5,0,0,0,-PI/2),E('#111111',.8,.8,.8,14.6,41.8,2.4),C('#ffffff',2.4,9,1.5,-9,21,0,0,0,PI/2+.4))},
 deer(){const g=Gp(E('#a8743f',11,6,5,0,15,0),Y('#a8743f',2.4,10,2.4,10,22,0,0,0,-.6),E('#a8743f',4.8,3.6,3.3,14.5,27,0),E('#3a2a1a',1.3,1.2,1.4,18.6,26.4,0),E('#ffffff',2.2,2.8,2.2,-11,17.5,0),C('#a8743f',1.4,4.5,.8,12.5,31.5,2.6,.4),C('#a8743f',1.4,4.5,.8,12.5,31.5,-2.6,-.4),E('#e8d8b8',9,3,4,0,12,0));
  for(const x of[-7,7])for(const z of[-2.8,2.8])g.add(Y('#8a5c30',1.1,12,1.1,x,6,z));eyes(g,15.6,28,2.8,.8);return g},
 croc(){const g=MODEL.croc();g.scale.setScalar(.38);return g},
 flyfish(){const g=Gp(E('#4a7fc8',9,2.4,2.4),E('#e8f0f4',8,1.4,2,0,-1,0),C('#4a7fc8',3,6,.6,-11,0,0,0,0,-PI/2),B('#9cc4f0',5,.4,13,2,1,8,0,-.3,0,{transparent:true,opacity:.8}),B('#9cc4f0',5,.4,13,2,1,-8,0,.3,0,{transparent:true,opacity:.8}));return g},
 osprey(){return Gp(E('#5a4632',5,8,5,0,8,0),E('#ffffff',3.6,6,3.6,2.4,7,0),E('#ffffff',3.2,3.2,3.2,1,17,0),B('#3a2a1a',5,1.4,6.6,1,17.6,0),C('#333333',1.1,4,1.1,5,16.4,0,0,0,-PI/2-.5),C('#5a4632',3,9,1.2,-5,3,0,0,0,PI-.5))}
};
function flagTex(kind){return canvasTex(64,44,(g)=>{if(kind==='dive'){g.fillStyle='#e0291f';g.fillRect(0,0,64,44);g.strokeStyle='#fff';g.lineWidth=11;g.beginPath();g.moveTo(-4,0);g.lineTo(68,44);g.stroke()}
  else if(kind==='skull'){g.fillStyle='#111';g.fillRect(0,0,64,44);g.fillStyle='#fff';dot(g,32,18,11);g.fillRect(25,24,14,9);g.fillStyle='#111';dot(g,27.5,17,3.4);dot(g,36.5,17,3.4);g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.moveTo(12,34);g.lineTo(52,42);g.moveTo(52,34);g.lineTo(12,42);g.stroke()}
  else{g.fillStyle='#5f9f72';g.fillRect(0,0,64,44);g.strokeStyle='#fff';g.lineWidth=7;g.beginPath();g.moveTo(14,22);g.lineTo(27,34);g.lineTo(50,10);g.stroke()}})}
const FLAG={dive:flagTex('dive'),skull:flagTex('skull'),done:flagTex('done')};
function buoyM(kind,col){const fm=new THREE.MeshBasicMaterial({map:FLAG[kind],side:THREE.DoubleSide}),f=new THREE.Mesh(PLANE,fm);f.scale.set(30,20,1);f.position.set(15,48,0);
 const g=Gp(E(col,9,8,9,0,3,0),E('#ffffff',9.2,2.4,9.2,0,3,0),Y('#333333',1,52,1,0,30,0),f);g.userData.flag=f;g.userData.ball=g.children[0];return g}

/* ================= surface scene ================= */
const S3={};
const HT=new Float32Array(WX*WY);
function buildHeights(){const base=[-75,-10,-9,-9,1.6,1.3,4.5,10,-8,-10],tmp=new Float32Array(WX*WY);for(let i=0;i<tmp.length;i++)tmp[i]=base[map[i]];
 for(let ty=0;ty<WY;ty++)for(let tx=0;tx<WX;tx++){let a=0,n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const x=clamp(tx+i,0,WX-1),y=clamp(ty+j,0,WY-1),w=i||j?1:3;a+=tmp[y*WX+x]*w;n+=w}
  const t=map[ty*WX+tx],b=a/n;HT[ty*WX+tx]=(t>=T.MUD&&t<=T.HAM)?Math.max(b,base[t]*.62):Math.min(b,-2.5)}}
function hAt(x,z){const fx=clamp(x/TILE-.5,0,WX-1.001),fy=clamp(z/TILE-.5,0,WY-1.001),x0=fx|0,y0=fy|0,u=fx-x0,v=fy-y0,i=y0*WX+x0;return lerp(lerp(HT[i],HT[i+1],u),lerp(HT[i+WX],HT[i+WX+1],u),v)}
function shadows(o,cast,recv){o.traverse(m=>{if(m.isMesh){m.castShadow=cast;m.receiveShadow=!!recv}});return o}
function buildSurface(){
 buildHeights();
 const sc=new THREE.Scene(),fogc='#cfe6f2';sc.background=new THREE.Color(fogc);sc.fog=new THREE.Fog(fogc,1000,3300);S3.scene=sc;
 const sunDir=new THREE.Vector3(-.5,.74,.46).normalize();S3.sunDir=sunDir;
 // sky dome, sun and image-based lighting for reflections
 const skyTex=canvasTex(16,512,(g)=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#1558b0');gr.addColorStop(.55,'#4f9fe2');gr.addColorStop(.9,'#b3d8f0');gr.addColorStop(1,fogc);g.fillStyle=gr;g.fillRect(0,0,16,256);g.fillStyle=fogc;g.fillRect(0,256,16,256)});
 const mkSky=()=>new THREE.Mesh(new THREE.SphereGeometry(11000,24,16),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,fog:false,depthWrite:false,toneMapped:false}));
 S3.sky=mkSky();sc.add(S3.sky);
 const sunS=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#fff8e0',blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));sunS.scale.set(3600,3600,1);sunS.position.copy(sunDir).multiplyScalar(10000);S3.sky.add(sunS);
 const es=new THREE.Scene();es.add(mkSky());const sb=new THREE.Mesh(SPH,new THREE.MeshBasicMaterial({color:'#ffffff'}));sb.scale.setScalar(900);sb.position.copy(sunDir).multiplyScalar(10000);es.add(sb);
 const pm=new THREE.PMREMGenerator(renderer);sc.environment=pm.fromScene(es,0,10,30000).texture;pm.dispose();
 sc.add(new THREE.HemisphereLight(0xe6f3ff,0x8fa58a,.35));
 const sun=new THREE.DirectionalLight(0xfff0d2,2.3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sh=sun.shadow.camera;sh.left=sh.bottom=-520;sh.right=sh.top=520;sh.near=10;sh.far=2200;sun.shadow.bias=-.0005;sun.shadow.normalBias=1.2;sc.add(sun,sun.target);S3.sun=sun;
 // clouds
 const cm=new THREE.MeshBasicMaterial({color:'#ffffff',fog:false,transparent:true,opacity:.9,toneMapped:false}),R0=rng(9);
 for(let i=0;i<26;i++){const a=R0()*TAU,d=2600+R0()*5200,g=new THREE.Group();for(let k=0;k<5;k++){const m=new THREE.Mesh(ICO,cm);m.scale.set(220+R0()*260,70+R0()*60,160+R0()*160);m.position.set((R0()-.5)*520,(R0()-.5)*50,(R0()-.5)*260);g.add(m)}g.position.set(WW/2+Math.cos(a)*d,1000+R0()*900,WH/2+Math.sin(a)*d);sc.add(g)}
 // terrain: smooth heightfield textured with the painted map
 const tex=new THREE.CanvasTexture(wc);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
 const tg=new THREE.PlaneGeometry(WW,WH,WX*2,WY*2);tg.rotateX(-PI/2);tg.translate(WW/2,0,WH/2);const tp=tg.attributes.position;for(let i=0;i<tp.count;i++)tp.setY(i,hAt(tp.getX(i),tp.getZ(i)));tg.computeVertexNormals();
 const terrain=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({map:tex,roughness:.95,envMapIntensity:.4}));terrain.receiveShadow=true;sc.add(terrain);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(WW+30000,WH+30000),new THREE.MeshStandardMaterial({color:'#0b4f8a',roughness:.95}));sea.rotation.x=-PI/2;sea.position.set(WW/2,-76,WH/2);sc.add(sea);
 // water: glossy, rippled by a scrolling normal map
 const nt=canvasTex(256,256,(g)=>{const im=g.createImageData(256,256),R=rng(3),wv=[];for(let k=0;k<14;k++)wv.push([(R()*9|0)-4,(R()*9|0)-4,R()*TAU,.5+R()]);
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){let dx=0,dy=0;for(const w of wv){if(!w[0]&&!w[1])continue;const ph=TAU*(w[0]*x+w[1]*y)/256+w[2],c=Math.cos(ph)*w[3]/Math.hypot(w[0],w[1]);dx+=c*w[0];dy+=c*w[1]}
   const l=Math.hypot(dx*.5,dy*.5,1),i=(y*256+x)*4;im.data[i]=(-dx*.5/l*.5+.5)*255;im.data[i+1]=(-dy*.5/l*.5+.5)*255;im.data[i+2]=(1/l*.5+.5)*255;im.data[i+3]=255}g.putImageData(im,0,0)});
 nt.colorSpace=THREE.NoColorSpace;nt.wrapS=nt.wrapT=THREE.RepeatWrapping;nt.repeat.set((WW+30000)/260,(WH+30000)/260);S3.wt=nt;
 const water=new THREE.Mesh(new THREE.PlaneGeometry(WW+30000,WH+30000),new THREE.MeshStandardMaterial({color:'#0e7aad',transparent:true,opacity:.74,roughness:.1,metalness:0,normalMap:nt,normalScale:new THREE.Vector2(.8,.8),envMapIntensity:.6,depthWrite:false}));
 water.rotation.x=-PI/2;water.position.set(WW/2,0,WH/2);water.receiveShadow=true;sc.add(water);
 // instanced vegetation, split into chunks so far-away ones can be skipped
 const R=rng(77),dm=new THREE.Object3D(),col=new THREE.Color();S3.chunks=[];
 const LCYL=new THREE.CylinderGeometry(.7,1,1,5),LCONE=new THREE.ConeGeometry(1,1,4),imat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.85,envMapIntensity:.45}),imatF=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.85,flatShading:true,envMapIntensity:.45});
 const inst=(geo,all)=>{const ch={};for(const o of all){const k=(o[0]/600|0)+'_'+(o[2]/480|0);(ch[k]=ch[k]||[]).push(o)}for(const k in ch)inst1(geo,ch[k])};
 const inst1=(geo,list)=>{const m=new THREE.InstancedMesh(geo,geo===ICO?imatF:imat,list.length);let cx=0,cz=0;list.forEach((o,i)=>{cx+=o[0];cz+=o[2];dm.position.set(o[0],o[1],o[2]);dm.scale.set(o[3],o[4],o[5]);if(o[7])dm.quaternion.copy(o[7]);else dm.rotation.set(0,0,0);dm.updateMatrix();m.setMatrixAt(i,dm.matrix);m.setColorAt(i,col.set(o[6]))});m.computeBoundingSphere();m.castShadow=true;sc.add(m);S3.chunks.push({m,x:cx/list.length,z:cz/list.length})};
 const leaves=[],trunks=[],fronds=[],roots=[],grass=[];
 const palm=(x,z,h)=>{const y0=hAt(x,z),lean=(R()-.5)*.5,tq=new THREE.Quaternion().setFromAxisAngle(_v.set(0,0,1),-lean),tx=x+Math.sin(lean)*h,ty=y0+Math.cos(lean)*h;trunks.push([(x+tx)/2,(y0+ty)/2,z,1.9,h,1.9,'#8a6f4a',tq]);
  for(let i=0;i<9;i++){const a=i*TAU/9+x,dr=-.25-(i%3)*.22;_v.set(Math.cos(a),dr,Math.sin(a)).normalize();fronds.push([tx+_v.x*11,ty+_v.y*11,z+_v.z*11,4.2,24,.9,i%2?'#2f8a3e':'#3c9a48',new THREE.Quaternion().setFromUnitVectors(UP,_v)])}};
 for(let ty=0;ty<WY;ty++)for(let tx=0;tx<WX;tx++){const t=map[ty*WX+tx],x=(tx+.5)*TILE,z=(ty+.5)*TILE;
  if(t===T.HAM){for(let i=0;i<3;i++){const r=8+R()*8,px=x+(R()-.5)*30,pz=z+(R()-.5)*30,h=hAt(px,pz);trunks.push([px,h+r*.5,pz,1.3,r,1.3,'#6b5238']);leaves.push([px,h+r*1.25,pz,r,r*.85,r,['#3b8244','#4c9a52','#5fb062','#357a3e'][R()*4|0]])}if(R()<.3)palm(x+(R()-.5)*18,z+(R()-.5)*18,30+R()*18)}
  else if(t===T.SAND){if(R()<.07)palm(x+(R()-.5)*10,z+(R()-.5)*10,28+R()*16)}
  else if(t===T.MANG){for(let i=0;i<3;i++){const r=9+R()*6,px=x+(R()-.5)*28,pz=z+(R()-.5)*28,h=hAt(px,pz);leaves.push([px,h+13+R()*5,pz,r,r*.75,r,['#1f5f3a','#2b7447','#195232','#256a40'][R()*4|0]]);
     for(let k=0;k<3;k++){const a=R()*TAU;_v.set(Math.cos(a)*.55,1,Math.sin(a)*.55).normalize();roots.push([px+Math.cos(a)*5,h+4,pz+Math.sin(a)*5,.8,18,.8,'#5b3d2a',new THREE.Quaternion().setFromUnitVectors(UP,_v)])}}}
  else if(t===T.MUD){for(let i=0;i<5;i++){const px=x+(R()-.5)*30,pz=z+(R()-.5)*30;grass.push([px,hAt(px,pz)+3.5,pz,1.2,7+R()*6,1.2,R()<.5?'#7d8a45':'#93a052'])}}
 }
 inst(ICO,leaves);inst(LCYL,trunks.concat(roots));inst(LCONE,fronds.concat(grass));
 // landmarks
 const add=(g,p,y)=>{g.position.set(p.x,y||0,p.y);shadows(g,true,true);sc.add(g);return g};
 const tower=new THREE.Mesh(new THREE.CylinderGeometry(6,10,84,14),M('#f4f1e8'));tower.position.y=46;
 add(Gp(I('#8d8a80',24,9,24,0,0,0,0,0,0,{flatShading:true}),tower,Y('#c0392b',9.3,12,9.3,0,20,0),Y('#c0392b',7.6,12,7.6,0,56,0),Y('#333333',9.5,2,9.5,0,89,0),Y('#ffe98a',5,9,5,0,95,0,0,0,0,{emissive:'#ffcc33'}),C('#c0392b',7.5,9,7.5,0,104,0)),LM.light);
 add(Gp(E('#b9b6aa',27,25,25,0,17,0),E('#1c1c1c',7,8,5,-10,21,21),E('#1c1c1c',7,8,5,10,21,21),C('#1c1c1c',3,7,3,0,11,25),B('#a9a69a',30,11,20,0,1,9),B('#1c1c1c',22,1.2,2,0,3,19.6),I('#8d8a80',14,8,12,-26,-2,6,0,0,0,{flatShading:true}),I('#8d8a80',10,6,10,25,-3,-8,0,0,0,{flatShading:true})),LM.skull);
 LM.piers.forEach((p,i)=>{const g=Gp(B('#b5b1a4',20,62,20,0,8,0),B('#9d998c',25,5,25,0,41,0));if(i!==1)g.add(B('#6b3f30',74,6,13,i?16:-16,47,0,0,0,i?-.1:.1),B('#4a2c22',74,1.5,2,i?16:-16,51,5),B('#4a2c22',74,1.5,2,i?16:-16,51,-5));else g.add(B('#6b3f30',16,5,13,-2,46,0,0,.2,.25));add(g,p)});
 add(Gp(E('#f3e4b3',34,9,30,0,-3,0),palmM(44,.25).translateX(-8),palmM(52,-.12).translateX(6).translateZ(-6),palmM(38,.4).translateX(4).translateZ(9)),LM.palms);
 const shack=Gp(B('#8a6a3a',44,2,32,0,26,0),B('#d9c7a0',26,17,22,-6,35.5,0),B('#3a5a6a',1,8,7,7.2,36,0),B('#6b4a2a',1,12,6,7.2,33,-7),B('#8a6a3a',1.2,8,32,21,31,0),E('#e0763c',3,3,3,14,29,10));
 const roof=new THREE.Mesh(new THREE.ConeGeometry(23,13,4),M('#b5452c'));roof.position.set(-6,50.5,0);roof.rotation.y=PI/4;shack.add(roof);for(const x of[-18,18])for(const z of[-12,12])shack.add(Y('#6b4a2a',1.6,40,1.6,x,6,z));add(shack,LM.shack);
 const osp=SURF.osprey();osp.position.set(0,64,0);add(Gp(Y('#8a8172',3.2,74,3.2,0,23,0),Y('#8a8172',1.6,26,1.6,10,40,0,0,0,-.9),Y('#8a8172',1.4,20,1.4,-7,32,4,.3,0,.8),Y('#6b4a2a',10,5,10,0,62,0),Y('#8a8172',1.2,20,1.2,-5,0,5,.5,0,.5),Y('#8a8172',1.2,20,1.2,6,0,-4,-.5,0,-.5),osp),LM.osprey);
 const bell=Gp(Y('#c0392b',13,8,13,0,2,0),Y('#ffffff',13.2,2,13.2,0,3,0),Y('#333333',6,2,6,0,40,0),E('#d9a441',4.5,5.5,4.5,0,26,0),Y('#333333',.6,10,.6,0,34,0),E('#ff4030',3,3,3,0,44,0,0,0,0,{emissive:'#ff2010'}));for(let i=0;i<4;i++){const a=i*PI/2+PI/4;bell.add(aim(Y('#c0392b',1,36,1,Math.cos(a)*7,23,Math.sin(a)*7),-Math.cos(a)*.3,1,-Math.sin(a)*.3))}S3.bell=add(bell,LM.bell);
 add(Gp(I('#8d8a80',28,10,24,0,-1,0,0,0,0,{flatShading:true}),I('#7d7a70',14,8,13,-18,0,10,0,1,0,{flatShading:true}),Y('#2a2a2a',4.4,38,3.6,6,17,0,0,0,-PI/2+.14,{metalness:.6,roughness:.5}),B('#6b4a2a',20,6,12,-2,11,0),Y('#4a3320',6.5,2,6.5,-6,10,7.5,PI/2),Y('#4a3320',6.5,2,6.5,-6,10,-7.5,PI/2),E('#2a2a2a',3,3,3,-16,9,-8),E('#2a2a2a',3,3,3,-20,8.5,-4),E('#2a2a2a',3,3,3,-17,13,-5.5)),LM.cannon);
 const arc=new THREE.Mesh(new THREE.TorusGeometry(17,2.6,6,16,PI),M('#6b3f30',{metalness:.5,roughness:.7}));arc.rotation.z=PI;arc.position.set(0,19,0);
 const anc=Gp(Y('#6b3f30',2.6,58,2.6,0,31,0,0,0,0,{metalness:.5,roughness:.7}),arc,B('#6b3f30',34,3,3,0,52,0,0,PI/2,0),TO('#6b3f30',6,6,6,0,65,0),C('#6b3f30',5,10,2,-17,22,0),C('#6b3f30',5,10,2,17,22,0));anc.rotation.set(.1,.6,.45);anc.scale.setScalar(1.7);add(anc,LM.anchor,hAt(LM.anchor.x,LM.anchor.y)-6);
 const rk={flatShading:true};add(Gp(I('#a39c8a',13,40,13,-24,12,0,0,.4,.08,rk),I('#978f7c',12,36,13,24,10,0,0,1,-.1,rk),I('#a39c8a',38,10,14,0,46,0,0,.3,.05,rk),I('#8d8674',16,9,14,-30,-2,6,0,2,0,rk),I('#8d8674',13,8,12,32,-3,-5,0,1,0,rk)),LM.arch);
 // dynamic things
 S3.boat=shadows(boatM(),true,true);for(let i=0;i<3;i++)S3.boat.children[i].material=M('#d5dbdf',{metalness:.75,roughness:.32});sc.add(S3.boat);
 S3.wake=[];for(let i=0;i<60;i++){const m=new THREE.Mesh(DISC,new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-PI/2;m.position.y=.8;m.renderOrder=2;sc.add(m);S3.wake.push(m)}
 const ringM=c=>{const r=new THREE.Mesh(RING,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-PI/2;r.position.y=1;r.renderOrder=2;return r};
 S3.sites=SITES.map((s,i)=>{const g=shadows(buoyM('dive','#ff7a2a'),true);g.position.set(s.x,0,s.y);const r=ringM(i===4?'#ff3b2a':'#ffffff');g.add(r);g.userData.ring=r;
   const beam=new THREE.Mesh(CYL,new THREE.MeshBasicMaterial({color:i===4?'#ff5040':'#ffe060',transparent:true,opacity:.28,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));beam.scale.set(9,900,9);beam.position.y=450;g.add(beam);g.userData.beam=beam;
   if(i===4){for(const a of[PI/4,-PI/4]){const x=new THREE.Mesh(BOX,new THREE.MeshBasicMaterial({color:'#e0291f'}));x.scale.set(90,2,14);x.position.y=1.2;x.rotation.y=a;g.add(x)}}sc.add(g);return g});
 S3.wrecks=WRECKS.map(w=>{const g=shadows(buoyM('skull','#222222'),true);g.position.set(w.x,0,w.y);sc.add(g);return g});
 S3.caches=CACHES.map(c=>{const g=glow(46);g.position.set(c.x,6,c.y);sc.add(g);return g});
}
function spawnEntMeshes(){
 if(S3.ents)S3.ents.forEach(m=>S3.scene.remove(m));S3.ents=[];
 for(const e of G.ents){const m=SURF[e.kind]();e.m=m;S3.scene.add(m);S3.ents.push(m);
  shadows(m,true);const h=(e.kind==='deer'||e.kind==='heron'||e.kind==='spoonbill')?hAt(e.x,e.y):0;if(h||e.kind==='spoonbill')m.scale.setScalar(.62);m.position.set(e.x,h,e.y);m.rotation.y=e.ph;}
 S3.sites.forEach(g=>{g.userData.flag.material.map=FLAG.dive;g.userData.ball.material=M('#ff7a2a')});
 S3.wrecks.forEach(g=>{g.userData.flag.material.map=FLAG.skull});
}

/* ---------- game state ---------- */
let G;
function newGame(){
 const st=findTile(55,cyf(55)-6,t=>wet(t));
 G={cam:(G&&G.cam)||'chase',mode:'surface',t:0,eco:0,found:{},pieces:0,stage:0,paused:true,stats:{trash:0,lion:0,oops:0,coins:0},
    boat:{x:st.x,y:st.y,vx:0,vy:0,a:-1.2,fan:0,spd:0},wake:[],wi:0,ents:[],dive:null,cool:0};
 const R=rng(42);
 const put=(kind,sp,n,pred,o)=>{for(let i=0,k=0;i<n&&k<4000;k++){const tx=2+R()*(WX-4)|0,ty=3+R()*(WY-6)|0;if(pred(map[ty*WX+tx],tx,ty)){G.ents.push(Object.assign({kind,sp,x:(tx+.5)*TILE,y:(ty+.5)*TILE,x0:(tx+.5)*TILE,y0:(ty+.5)*TILE,ph:R()*9,a:R()*TAU},o||{}));i++}}};
 put('manatee','manatee',7,(t,x,y)=>t===T.GRASS&&y<cyf(x)-3);
 put('dolphin','dolphin',6,t=>t===T.DEEP);
 put('dolphin','dolphin',3,(t,x,y)=>t===T.SHAL&&y<cyf(x)-8&&!nearType(x,y,T.MANG)&&!nearType(x,y,T.MUD));
 put('turtle','turtle',6,t=>t===T.REEF);
 put('fin','reefshark',7,t=>t===T.DEEP);
 put('flyfish','flyingfish',10,t=>t===T.DEEP);
 put('spoonbill','spoonbill',9,t=>t===T.MUD);
 put('heron','heron',8,(t,x,y)=>t===T.SAND&&nearType(x,y,T.SHAL));
 put('deer','deer',10,(t,x,y)=>t===T.HAM&&nearType(x,y,T.SAND));
 put('croc','croc',5,(t,x,y)=>t===T.SHAL&&nearType(x,y,T.MANG)&&y>3);
 for(let i=0;i<7;i++)G.ents.push({kind:'pelican',sp:'pelican',x:R()*WW,y:R()*WH,a:R()*TAU,ph:R()*9});
 for(let i=0;i<5;i++)G.ents.push({kind:'frigate',sp:'frigate',x:R()*WW,y:R()*WH,a:R()*TAU,ph:R()*9});
 const m=SITES[0];G.ents.push({kind:'croc',sp:'croc',x:m.x+70,y:m.y-40,x0:m.x+70,y0:m.y-40,ph:1,a:2});
 WRECKS.forEach(w=>{w.done=false;w.hasKey=false});SITES.forEach(w=>{w.hasKey=false});CACHES.forEach(c=>{c.found=false});
 spawnEntMeshes();hud();
}
function hud(){
 $('cMap').textContent='🗺️ '+Math.min(G.pieces,4)+'/4';$('cEco').textContent='🌿 '+G.eco;$('cWr').textContent='☠️ '+WRECKS.filter(w=>w.done).length+'/'+WRECKS.length;
 $('cCl').textContent='📜 Clues '+CACHES.filter(c=>c.found).length+'/'+CACHES.length;
 $('cJ').textContent='📖 Journal '+Object.keys(G.found).length+'/'+NSP;
 const d=G.dive&&G.dive.site;
 $('goal').innerHTML=G.mode==='dive'?('<b>'+d.name+'</b> · '+(G.dive.got?'Got it! Swim up to the surface.':d.locked&&!d.hasKey?'Find the key in the stern cabin (left end of the wreck).':d.id==='hole'?'Dive to the bottom of the hole.':d.id==='bonus'?'Collect doubloons and find the pirate chest in the bow (right end).':'Search for the hidden map piece.'))
   :('<b>Goal:</b> '+(G.stage===0?'Follow the arrow to the mangrove creek in the west of Florida Bay.':SITES[G.stage-1].next));
}
const TQ=[];let tBusy=0;
function toast(h,bad,ms){TQ.push([h,bad,ms||5200]);while(TQ.length>2)TQ.shift();if(!tBusy)nextT()}
function nextT(){const t=$('toast');if(!TQ.length){tBusy=0;t.classList.remove('on');return}tBusy=1;const q=TQ.shift();t.innerHTML=q[0];t.classList.toggle('bad',!!q[1]);t.classList.add('on');setTimeout(nextT,TQ.length?2600:q[2])}
function discover(id){if(G.found[id])return;G.found[id]=1;G.eco+=10;const s=SP[id];toast('<b>'+s.e+' '+s.n+'</b> · new journal entry +10<br><small>'+s.f+'</small>',0,6500);sfx(880,.12);setTimeout(()=>sfx(1320,.18),90);hud()}
function oops(msg,pts){if(G.cool>0)return;G.cool=3.5;G.eco=Math.max(0,G.eco-pts);G.stats.oops++;toast('⚠️ '+msg+' −'+pts,1,4200);sfx(160,.25,'sawtooth');hud()}
let dlgCb=null;
const anyModal=()=>['dlg','jr','cl','mp'].some(i=>$(i).classList.contains('on'));
function dlg(html,btn,cb){$('dlgBody').innerHTML=html;$('dlgBtn').textContent=btn||'OK';$('dlg').classList.add('on');G.paused=true;dlgCb=cb||null}
function closeDlg(){if(!$('dlg').classList.contains('on'))return;$('dlg').classList.remove('on');G.paused=anyModal();keys.clear();const cb=dlgCb;dlgCb=null;if(cb)cb()}
$('dlgBtn').onclick=()=>{sfx(520,.08);closeDlg()};
function journal(){
 const z={};for(const k in SP){(z[SP[k].z]=z[SP[k].z]||[]).push(k)}
 let h='';for(const zone in z)for(const k of z[zone]){const s=SP[k],f=G.found[k];h+='<div class="sp'+(f?'':' no')+'"><i>'+zone+'</i><br><b>'+(f?s.e+' '+s.n:'❓ Not found yet')+'</b>'+(f?'<br>'+s.f:'')+'</div>'}
 $('jlist').innerHTML=h;$('jsum').innerHTML='Species found: <b>'+Object.keys(G.found).length+' of '+NSP+'</b> · Trash removed: <b>'+G.stats.trash+'</b> · Lionfish netted: <b>'+G.stats.lion+'</b> · Eco points: <b>'+G.eco+'</b>';
 $('jr').classList.add('on');G.paused=true;
}
function clues(){$('clist').innerHTML=CACHES.map((c,i)=>'<div class="clue'+(c.found?' done':'')+'"><b>'+(c.found?'✅ '+c.lm+' - found '+c.e+' '+c.item:'Clue '+(i+1))+'</b><br>'+c.clue+'</div>').join('');$('cl').classList.add('on');G.paused=true}
const closeM=id=>()=>{$(id).classList.remove('on');G.paused=anyModal();keys.clear()};
$('mini').onclick=()=>{if(!anyModal())openMap()};$('mpClose').onclick=closeM('mp');
function camToggle(){G.cam=G.cam==='chase'?'top':'chase';toast(G.cam==='chase'?'🎥 Chase camera: left/right to steer, up to go, down to brake or reverse.':'🎥 Top-down camera: press any direction to go that way.',0,3500)}$('cCam').onclick=camToggle;
$('cJ').onclick=journal;$('jClose').onclick=closeM('jr');$('cCl').onclick=clues;$('clClose').onclick=closeM('cl');

/* ---------- input ---------- */
const keys=new Set();let actQ=false;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
 if(k===' '||k==='enter'||k==='e'){e.preventDefault();if($('dlg').classList.contains('on')){if(!e.repeat)closeDlg()}else if(!e.repeat&&!anyModal())actQ=true;return}
 if(k==='j'&&!$('dlg').classList.contains('on')){$('jr').classList.contains('on')?$('jClose').onclick():journal();return}
 if(k==='c'&&!$('dlg').classList.contains('on')){$('cl').classList.contains('on')?$('clClose').onclick():clues();return}
 if(k==='m'&&!$('dlg').classList.contains('on')){$('mp').classList.contains('on')?$('mpClose').onclick():(G.mode==='surface'&&!anyModal()&&openMap());return}
 if(k==='v'&&!anyModal()){camToggle();return}
 if(k==='escape'){if($('mp').classList.contains('on'))$('mpClose').onclick();if($('jr').classList.contains('on'))$('jClose').onclick();if($('cl').classList.contains('on'))$('clClose').onclick();return}
 if(k.startsWith('arrow'))e.preventDefault();keys.add(k)});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>keys.clear());
const joy={id:null,bx:0,by:0,x:0,y:0};
ov.addEventListener('pointerdown',e=>{if(joy.id===null){joy.id=e.pointerId;joy.bx=e.clientX;joy.by=e.clientY;joy.x=joy.y=0;try{ov.setPointerCapture(e.pointerId)}catch(_){}}});
ov.addEventListener('pointermove',e=>{if(e.pointerId===joy.id){const dx=e.clientX-joy.bx,dy=e.clientY-joy.by,m=Math.hypot(dx,dy),R=56;joy.x=dx/Math.max(m,R);joy.y=dy/Math.max(m,R);if(m>R){joy.bx=e.clientX-dx/m*R;joy.by=e.clientY-dy/m*R}}});
const jend=e=>{if(e.pointerId===joy.id){joy.id=null;joy.x=joy.y=0}};ov.addEventListener('pointerup',jend);ov.addEventListener('pointercancel',jend);
$('prompt').onclick=()=>{actQ=true};
function axis(){let x=0,y=0;if(keys.has('arrowleft')||keys.has('a'))x--;if(keys.has('arrowright')||keys.has('d'))x++;if(keys.has('arrowup')||keys.has('w'))y--;if(keys.has('arrowdown')||keys.has('s'))y++;
 if(x||y){const m=Math.hypot(x,y);return[x/m,y/m]}return[joy.x,joy.y]}
let pTxt='';function prompt_(t){if(t===pTxt)return;pTxt=t;const p=$('prompt');if(t){p.innerHTML=t+' <small>[Space]</small>';p.style.display='block'}else p.style.display='none'}

/* ---------- surface update ---------- */
function updSurface(dt){
 const b=G.boat,[ix,iy]=axis(),mag=Math.hypot(ix,iy),here=tileAt(b.x,b.y);
 const top=here===T.DEEP?180:240;
 if(G.cam==='chase'){ // drive like a vehicle: left/right steer, up = throttle, down = brake/reverse
  const thr=Math.abs(iy)>.15?-iy:0,turn=Math.abs(ix)>.15?ix:0,tgt=thr>0?thr*top:thr*80;
  b.spd+=(tgt-b.spd)*(1-Math.pow(thr?.3:.12,dt));
  b.a+=turn*2*dt*clamp(.4+Math.abs(b.spd)/150,0,1)*(b.spd<-8?-1:1);
  const k2=1-Math.pow(.004,dt);b.vx+=(Math.cos(b.a)*b.spd-b.vx)*k2;b.vy+=(Math.sin(b.a)*b.spd-b.vy)*k2;b.fan+=dt*(5+Math.abs(b.spd)*.14);
 }else{const kk=1-Math.pow(.002,dt);
  if(mag>.15){const m=Math.min(1,mag);b.vx+=(ix/mag*m*top-b.vx)*kk;b.vy+=(iy/mag*m*top-b.vy)*kk;b.fan+=dt*(14+20*mag)}else{const st=Math.pow(.02,dt);b.vx*=st;b.vy*=st;b.fan+=dt*4}
  if(Math.hypot(b.vx,b.vy)>25){let da=Math.atan2(b.vy,b.vx)-b.a;while(da>PI)da-=TAU;while(da<-PI)da+=TAU;b.a+=da*(1-Math.pow(.0005,dt))}
  b.spd=Math.hypot(b.vx,b.vy)}
 let nx=b.x+b.vx*dt,ny=b.y+b.vy*dt;
 let hit=0;if(solid(tileAt(nx+Math.sign(b.vx)*10,b.y))||nx<20||nx>WW-20){b.vx=0;nx=b.x;hit++}
 if(solid(tileAt(nx,ny+Math.sign(b.vy)*10))||ny<20||ny>WH-20){b.vy=0;ny=b.y;hit++}if(hit&&G.cam==='chase')b.spd*=Math.pow(hit>1?.001:.2,dt);
 b.x=nx;b.y=ny;const sp=Math.hypot(b.vx,b.vy);
 if(sp>40&&Math.random()<dt*30){const w=S3.wake[G.wi++%S3.wake.length];w.position.set(b.x-Math.cos(b.a)*24+(Math.random()-.5)*12,.8,b.y-Math.sin(b.a)*24+(Math.random()-.5)*12);w.userData.l=1}
 let zone=['Atlantic · Open Water','Sandy Shallows','Seagrass Meadow','Coral Reef','Tidal Mudflat'][here]||'';
 const tx=b.x/TILE|0,ty=b.y/TILE|0;
 if(tx>1&&ty>1&&tx<WX-2&&ty<WY-2&&nearType(tx,ty,T.MANG)){zone='Mangrove Forest';discover('mangrove')}
 if(here===T.GRASS){discover('turtlegrass');if(sp>150&&G.found.turtlegrass)discover('airboat')}
 if(here===T.DEEP&&!G.deepTip){G.deepTip=1;toast('🌊 Airboats are built for the shallows - ocean swells slow you down out here.')}
 if(Math.hypot(b.x-LM.piers[1].x,b.y-LM.piers[1].y)<150&&!G.railTip){G.railTip=1;toast('🚂 These piers are from the Overseas Railroad, which reached Key West in 1912. The great hurricane of 1935 wrecked it, and the highway was later built along its route.',0,7000)}
 $('cZone').textContent=zone;
 for(const e of G.ents){
  const d=Math.hypot(e.x-b.x,e.y-b.y);
  if(e.kind==='manatee'){e.x=e.x0+Math.sin(G.t*.12+e.ph)*26;e.y=e.y0+Math.cos(G.t*.09+e.ph)*20;e.a=Math.sin(G.t*.1+e.ph)*2;
   if(d<60&&sp>125)oops('Too fast near a manatee! Slow to idle speed around sea cows.',20)}
  else if(e.kind==='dolphin'||e.kind==='fin'){e.a+=dt*.35;e.x=e.x0+Math.cos(e.a)*90;e.y=e.y0+Math.sin(e.a)*60}
  else if(e.kind==='flyfish'){e.a+=dt*.8;e.x=e.x0+Math.cos(e.a)*130;e.y=e.y0+Math.sin(e.a)*90}
  else if(e.kind==='turtle'){e.x=e.x0+Math.sin(G.t*.1+e.ph)*50;e.y=e.y0+Math.cos(G.t*.13+e.ph)*40}
  else if(e.kind==='pelican'||e.kind==='frigate'){e.x+=Math.cos(e.a)*70*dt;e.y+=Math.sin(e.a)*70*dt;e.a+=Math.sin(G.t*.2+e.ph)*dt*.3;if(e.x<-50)e.x=WW+40;if(e.x>WW+50)e.x=-40;if(e.y<-50)e.y=WH+40;if(e.y>WH+50)e.y=-40}
  if(d<(e.kind==='pelican'||e.kind==='frigate'||e.kind==='deer'?150:120))discover(e.sp);
 }
 if(Math.hypot(LM.osprey.x-b.x,LM.osprey.y-b.y)<130)discover('osprey');
 const s=SITES[G.stage];let pr='';
 for(const c of CACHES)if(!c.found&&Math.hypot(c.x-b.x,c.y-b.y)<46){pr='🔍 Search here';if(actQ){c.found=true;G.eco+=60;sfx(660,.15);setTimeout(()=>sfx(990,.15),120);setTimeout(()=>sfx(1320,.3),240);hud();
   const n=CACHES.filter(k=>k.found).length,all=n===CACHES.length;if(all)G.eco+=250;hud();
   dlg('<h2>'+c.e+' Hidden treasure found!</h2><p>At <b>'+c.lm+'</b> you haul up a barnacle-covered box. Inside: <b>'+c.item+'</b>!</p><p>+60 points. Crew treasures found: <b>'+n+' of '+CACHES.length+'</b>.</p>'+(all?'<p><b>You solved every clue! +250 bonus points.</b></p>':'<p>Open 📜 Clues to read the next riddle.</p>'),'Arrr!')}}
 if(s&&Math.hypot(s.x-b.x,s.y-b.y)<75){pr='🤿 Drop anchor &amp; dive';if(actQ&&!G.paused){b.vx=b.vy=0;startDive(s)}}
 for(const w of WRECKS)if(G.mode==='surface'&&!w.done&&Math.hypot(w.x-b.x,w.y-b.y)<75){pr='☠️ Dive the pirate wreck';if(actQ&&!G.paused){b.vx=b.vy=0;startDive(w)}}
 prompt_(pr);
}

/* ---------- dive logic ---------- */
function floorY(sc,x){const s=sc.site;let y=s.D-55-22*Math.sin(x/170+s.D)-12*Math.sin(x/53);
 if(s.id==='hole'){const k=clamp(1-Math.abs(x-1100)/470,0,1);y=300+18*Math.sin(x/90)+(s.D-360)*k*k*(3-2*k)}return y}
function startDive(s){
 const R=rng(s.D*7+3),sc={site:s,x:160,y:36,vx:0,vy:0,face:1,air:100,inv:0,got:false,cr:[],trash:[],decor:[],coral:[],bub:[],chest:null,key:null,kick:0,coins:[],R};
 const fy=x=>floorY(sc,x);
 const add=(kind,sp,x,y,o)=>{const c=Object.assign({kind,sp,x,y,x0:x,y0:y,dir:R()<.5?1:-1,t:R()*9,ph:R()*9,mv:'swim',spd:30,rng:120,bob:8,r:26,hz:0},o||{});c.z=c.z!==undefined?c.z:(c.hz||c.net||c.tent)?0:20-R()*120;sc.cr.push(c)};
 const fishO=(c1,c2,L,Hh,o)=>Object.assign({c1,c2,L,Hh},o);
 const junk=n=>{for(let i=0;i<n;i++){const x=300+R()*(s.W-500);sc.trash.push({x,y:fy(x)-14-R()*(s.id==='hole'?10:90),k:R()*3|0})}};
 const snap=fishO('#a59588','#7c6a5e',26,11),tarp=fishO('#c9d3da','#93a2ad',92,26,{spd:34,rng:260,r:0,th:8}),tang=fishO('#2a5fd0','#f0d040',24,16,{school:6,spd:34,rng:220,r:0}),grp=fishO('#7c7a4a','#5d5b36',130,66,{spd:8,rng:80,r:0,spots:1,th:21,z:-40}),ytail=fishO('#c9d3da','#f5d33b',30,11,{school:6,spd:38,rng:260,r:0}),logger={spd:22,rng:420,bob:26,r:0,z:-60,shell:'#9a5a2a',skin:'#c9a05a',sc:1.35};
 const mow=(x)=>add('manowar','manowar',x,9,{mv:'float',spd:6,rng:90,tent:1});
 if(s.id==='mangrove'){
  for(let i=0;i<80;i++){const x=R()*s.W;sc.decor.push({k:'root',x,w:(R()-.5)*90,z:R()<.55?-60-R()*260:R()<.6?-12-R()*40:26+R()*22})}
  for(let i=0;i<6;i++)add('fish','snapper',300+i*260,150+R()*120,Object.assign({school:5,spd:36,r:0},snap));
  for(let i=0;i<7;i++){const x=350+R()*1400;add('upjelly','upjelly',x,fy(x)-8,{mv:'still',hz:1,r:22})}
  for(let i=0;i<2;i++)add('fish','tarpon',700+i*600,130+i*60,tarp);
  for(let i=0;i<3;i++){const x=450+i*480+R()*100;add('horseshoe','horseshoe',x,fy(x)-2,{mv:'swim',spd:5,rng:60,bob:0,r:0,z:-20})}
  for(let i=0;i<3;i++){const x=600+i*420+R()*100;add('stonecrab','stonecrab',x,fy(x)-5,{mv:'swim',spd:7,rng:50,bob:0,r:0,z:12})}
  add('croc','croc',1300,12,{mv:'swim',spd:10,rng:160,bob:0,r:0,z:-50});
  junk(4);sc.chest={x:1740,y:fy(1740)-16,kind:'bottle'};
 }else if(s.id==='seagrass'){
  sc.blades=true;
  add('manatee','manatee',800,fy(800)-70,{mv:'swim',spd:9,rng:140,bob:6,r:0,z:-70});
  for(let i=0;i<4;i++){const x=400+R()*1700;add('conch','conch',x,fy(x)-9,{mv:'still',r:0})}
  for(let i=0;i<4;i++){const x=500+R()*1600;add('seahorse','seahorse',x,fy(x)-42,{mv:'still',r:0,z:8})}
  for(let i=0;i<5;i++){const x=450+R()*1700;add('seastar','seastar',x,fy(x)-6,{mv:'still',r:0})}
  for(let i=0;i<5;i++){const x=500+i*340+R()*120;add('ray','stingray',x,fy(x)-5,{mv:'still',hz:1,r:30})}
  for(let i=0;i<4;i++){const x=380+R()*1700;add('seacucumber','seacucumber',x,fy(x)-5,{mv:'still',r:0,z:14})}
  add('sawfish','sawfish',1500,fy(1500)-22,{mv:'swim',spd:14,rng:300,bob:3,r:0,z:-60});
  add('fish','tarpon',1100,150,tarp);add('turtle','turtle',1500,170,{spd:26,rng:300,bob:30,r:0});
  junk(4);sc.decor.push({k:'skiff',x:2060});sc.chest={x:2060,y:fy(2060)-26,kind:'chest'};
 }else if(s.id==='reef'){
  const cols=['#d9a441','#e0763c','#c98a3a'];
  for(let x=260;x<s.W-80;x+=70+R()*90){const k=R();const o={x,z:0,r:22+R()*26,k:k<.34?'elk':k<.62?'brain':k<.82?'fan':'tube',col:k<.34?cols[R()*3|0]:k<.62?'#b79a5a':k<.82?'#9060c8':'#e8c64a'};if(Math.abs(x-2260)<90)o.k='fan';sc.coral.push(o)}
  for(let i=0;i<70;i++){const k=R();sc.coral.push({x:R()*(s.W+600)-300,z:-70-R()*520,bg:1,r:26+R()*40,k:k<.3?'elk':k<.6?'brain':k<.8?'fan':'tube',col:k<.3?cols[R()*3|0]:k<.6?'#b79a5a':k<.8?['#9060c8','#c9568f'][R()*2|0]:'#e8c64a'})}
  for(let i=0;i<5;i++)add('fish','parrotfish',400+i*420,260+R()*200,fishO('#2fbf9f','#e95d8f',42,19,{spd:40,rng:200,r:0}));
  for(let i=0;i<4;i++)add('fish','angelfish',600+i*450,200+R()*220,fishO('#3b6fd6','#3b6fd6',32,30,{spd:28,r:0}));
  for(let i=0;i<3;i++)add('fish','bluetang',500+i*700,180+R()*200,tang);
  for(let i=0;i<2;i++)add('puffer','puffer',850+i*900,300+R()*120,{spd:14,rng:120,r:0});
  add('squid','squid',1600,200,{spd:22,rng:260,bob:14,r:0});
  for(let i=0;i<2;i++)add('fish','sergeant',700+i*900,170+R()*120,fishO('#f0e040','#3a3a3a',22,15,{school:7,spd:30,rng:200,r:0}));
  for(let i=0;i<2;i++)add('fish','yellowtail',1000+i*800,230+R()*120,ytail);
  for(let i=0;i<2;i++)add('fish','hogfish',600+i*1100,fy(600+i*1100)-70,fishO('#e88a6a','#c85a4a',48,25,{spd:18,rng:160,r:0}));
  for(let i=0;i<2;i++){const x=1050+i*700;add('trumpet','trumpetfish',x,fy(x)-80,{mv:'still',r:0,z:-24})}
  {const x=1750;add('octopus','octopus',x,fy(x)-10,{mv:'still',r:0,z:14})}
  for(let i=0;i<3;i++){const x=700+i*600;add('lion','lionfish',x,fy(x)-110-R()*60,{spd:14,rng:70,hz:1,r:26,net:1})}
  add('gshark','reefshark',1300,300,{spd:65,rng:500,bob:24,hz:1,r:36});
  add('moray','moray',2150,fy(2150)-20,{mv:'still',hz:1,r:44,dir:-1});
  for(let i=0;i<2;i++){const x=900+i*800;add('lobster','lobster',x,fy(x)-9,{mv:'still',r:0,z:16})}
  add('turtle','turtle',1300,150,{spd:28,rng:400,bob:30,r:0});
  junk(4);sc.chest={x:2260,y:fy(2260)-18,kind:'chest'};
 }else if(s.id==='wreck'||s.id==='bonus'){
  const hx=s.hx||900;sc.decor.push({k:'hull',x:hx});
  add('gshark','reefshark',hx+500,s.D*.36,{spd:70,rng:430,bob:20,hz:1,r:36});
  if(s.id==='bonus')add('gshark',s.locked?'hammerhead':'reefshark',hx+700,s.D*.62,{spd:55,rng:380,bob:16,hz:1,r:36,ham:s.locked?1:0});
  for(let i=0;i<(s.id==='wreck'?2:1);i++)add('cuda','cuda',hx+350+i*350,s.D*.5+i*110,{spd:92,rng:280,bob:14,hz:1,r:34});
  add('shark','nurse',hx-280,fy(hx-280)-20,{mv:'still',r:0,z:-30});
  add('fish','grouper',hx+820,fy(hx+820)-150,grp);
  add('eagleray','eagleray',hx+300,s.D*.28,{spd:40,rng:600,bob:26,r:0,z:-80});
  add('turtle','loggerhead',hx+700,s.D*.3,logger);add('fish','yellowtail',hx+900,s.D*.45,ytail);
  if(s.locked&&s.id==='bonus')add('whaleshark','whaleshark',hx+500,s.D*.4,{spd:16,rng:700,bob:20,r:0,z:-330});
  {const x=hx+640;add('octopus','octopus',x,fy(x)-10,{mv:'still',r:0,z:20})}
  for(let i=0;i<4;i++)add('jelly','moonjelly',420+i*520,170+R()*190,{mv:'drift',hz:1,r:26});
  mow(hx+200);mow(hx+900);
  for(let i=0;i<2;i++){const x=hx+250+i*650;add('lion','lionfish',x,fy(x)-170,{spd:12,rng:60,hz:1,r:26,net:1})}
  for(let i=0;i<4;i++)add('fish','snapper',hx+150+i*300,s.D*.58+R()*90,Object.assign({school:6,spd:30,r:0},snap));
  junk(s.id==='wreck'?4:3);for(let i=0;i<10;i++){const x=hx+130+i*100+R()*40;sc.coins.push({x,y:fy(x)-30-R()*130})}
  if(s.locked)sc.key={x:hx+110,y:fy(hx+110)-70};
  sc.chest={x:hx+1060,y:fy(hx+1060)-22,kind:'chest',locked:!!s.locked};
 }else{
  add('gshark','hammerhead',1100,400,{spd:60,rng:300,bob:18,hz:1,r:36,ham:1});
  for(let i=0;i<8;i++)add('jelly','moonjelly',780+R()*640,330+i*62,{mv:'drift',hz:1,r:26});
  for(let i=0;i<2;i++)add('cuda','cuda',1100,480+i*190,{spd:85,rng:260,bob:16,hz:1,r:34});
  add('shark','nurse',1280,fy(1280)-20,{mv:'still',r:0,z:-20});
  add('fish','grouper',930,720,Object.assign({},grp,{rng:60}));
  add('eagleray','eagleray',1000,200,{spd:40,rng:600,bob:26,r:0,z:-80});
  add('squid','squid',500,210,{spd:22,rng:200,bob:14,r:0});
  add('whaleshark','whaleshark',1000,330,{spd:16,rng:700,bob:20,r:0,z:-330});add('turtle','loggerhead',600,200,logger);
  mow(700);mow(1500);
  for(let i=0;i<2;i++)add('lion','lionfish',500+i*1100,220,{spd:12,rng:60,hz:1,r:26,net:1});
  for(let i=0;i<4;i++)add('fish','parrotfish',300+i*450,180+R()*60,fishO('#2fbf9f','#e95d8f',42,19,{spd:40,rng:160,r:0}));
  for(let i=0;i<8;i++){const a=i*.8,x=1100+Math.cos(a)*(40+i*9);sc.coins.push({x,y:fy(x)-18-i%3*14})}
  junk(3);sc.chest={x:1100,y:fy(1100)-24,kind:'hoard'};
 }
 G.dive=sc;G.mode='dive';buildDive(sc);hud();$('mini').style.display='none';$('airwrap').style.display='block';$('cZone').textContent=s.eco;
 dlg('<h2>'+s.icon+' '+s.name+'</h2><p><b>Ecosystem: '+s.eco+'</b></p><p>'+s.intro+'</p><ul><li>Watch your <b>air</b> - swim back up to the surface before it runs out.</li><li>Grab <b>trash</b> to earn eco points. Net invasive <b>lionfish</b> with Space (from behind - mind the spines!).</li><li>Keep off the coral and away from stingers and teeth.</li></ul>','Dive in!');
}
function hurt(sc,from,msg){if(sc.inv>0)return;sc.inv=1.6;sc.air=Math.max(0,sc.air-13);const a=Math.atan2(sc.y-from.y,sc.x-from.x);sc.vx=Math.cos(a)*420;sc.vy=Math.sin(a)*420;toast('💥 '+msg+' You lose some air.',1,3200);sfx(140,.3,'square')}
const HMSG={gshark:'A shark bumps you to find out what you are!',upjelly:'Stung by an upside-down jellyfish!',ray:'A startled stingray whips its tail!',lion:'Ouch - lionfish spines are venomous!',moray:'The moray eel snaps at you!',cuda:'A barracuda charges past!',jelly:'Stung by a moon jellyfish!',manowar:'Zap! You brushed a man o\' war\'s tentacles!'};
function endDive(msg){G.mode='surface';disposeDive();G.dive=null;$('mini').style.display='';$('airwrap').style.display='none';hud();prompt_('');if(msg)toast(msg)}
function updDive(dt){
 const sc=G.dive,s=sc.site,[ix,iy]=axis();
 const kd=1-Math.pow(.004,dt);sc.vx+=(ix*210-sc.vx)*kd;sc.vy+=(iy*210-sc.vy)*kd;
 sc.x=clamp(sc.x+sc.vx*dt,24,s.W-24);sc.y+=sc.vy*dt;
 const f=floorY(sc,sc.x)-16;if(sc.y>f){sc.y=f;sc.vy=Math.min(0,sc.vy)}if(sc.y<6){sc.y=6;sc.vy=0}
 if(Math.abs(sc.vx)>12)sc.face=sc.vx>0?1:-1;sc.kick+=dt*(3+Math.hypot(sc.vx,sc.vy)/22);
 sc.inv-=dt;sc.air-=s.drain*dt*(sc.y<20?-12:1);sc.air=clamp(sc.air,0,100);
 $('airfill').style.width=sc.air+'%';$('airwrap').classList.toggle('low',sc.air<25);
 if(Math.random()<dt*2.2)sc.bub.push({x:sc.x+sc.face*20,y:sc.y-8,r:2+Math.random()*3});
 for(const b of sc.bub){b.y-=60*dt;b.x+=Math.sin(b.y/9)*.4}sc.bub=sc.bub.filter(b=>b.y>0);
 if(sc.air<=0){G.eco=Math.max(0,G.eco-20);endDive();dlg('<h2>🫧 Out of air!</h2><p>You make an emergency ascent and climb back aboard, coughing. Real divers always surface with air to spare. (−20 eco points)</p><p>Your tank is refilled - dive again when you are ready.</p>','Phew');return}
 let near=null,nd=1e9;
 for(const c of sc.cr){c.t+=dt;
  if(c.mv==='swim'||c.mv==='float'){c.x+=c.dir*c.spd*dt;if(c.x>c.x0+c.rng)c.dir=-1;if(c.x<c.x0-c.rng)c.dir=1;c.y=c.y0+Math.sin(c.t*1.2+c.ph)*(c.mv==='float'?1.5:c.bob)}
  else if(c.mv==='drift'){c.y=c.y0+Math.sin(c.t*.55+c.ph)*42;c.x=c.x0+Math.sin(c.t*.21+c.ph)*34}
  const d=Math.hypot(c.x-sc.x,c.y-sc.y);if(d<(c.kind==='whaleshark'?380:200)||(c.tent&&Math.abs(c.x-sc.x)<200&&sc.y<260))discover(c.sp);
  if(c.net&&d<nd){nd=d;near=c}
  if(c.hz&&d<c.r+10)hurt(sc,c,HMSG[c.kind]||'Ouch!');
  if(c.tent&&Math.abs(c.x-sc.x)<17&&sc.y<c.y+112)hurt(sc,{x:c.x,y:sc.y-1},HMSG.manowar);
 }
 for(const k of sc.coral){if(k.bg)continue;const cy=floorY(sc,k.x)-k.r*.55,d=Math.hypot(k.x-sc.x,cy-sc.y);
  if(d<230&&(k.k==='elk'||k.k==='brain'))discover(k.k==='elk'?'elkhorn':'brain');if(d<120&&k.k==='brain')discover('xmasworm');
  if((k.k==='elk'||k.k==='brain')&&d<k.r*.85+8){const a=Math.atan2(sc.y-cy,sc.x-k.x);sc.vx=Math.cos(a)*240;sc.vy=Math.sin(a)*240-40;oops('You bumped the coral! Coral is a living animal - even a touch can harm it.',15)}}
 if(s.id==='mangrove')discover('mangrove');if(s.id==='seagrass')discover('turtlegrass');
 sc.trash=sc.trash.filter(t=>{if(Math.hypot(t.x-sc.x,t.y-sc.y)<30){G.eco+=15;G.stats.trash++;D3.scene.remove(t.m);toast('♻️ '+['Plastic bottle','Plastic bag','Tangled fishing line'][t.k]+' removed! +15'+(t.k===1?'<br><small>Turtles mistake floating bags for jellyfish.</small>':t.k===2?'<br><small>Lost fishing line can entangle turtles, birds and manatees.</small>':''),0,3000);sfx(700,.1,'triangle');hud();return false}return true});
 sc.coins=sc.coins.filter(c=>{if(Math.hypot(c.x-sc.x,c.y-sc.y)<28){G.eco+=5;G.stats.coins++;D3.scene.remove(c.m);sfx(1200,.08,'triangle');hud();return false}return true});
 if(sc.key&&Math.hypot(sc.key.x-sc.x,sc.key.y-sc.y)<34){D3.scene.remove(sc.key.m);sc.key=null;s.hasKey=true;toast('🗝️ You found the captain\'s key! Now find the chest in the bow hold (right end of the wreck).');sfx(990,.2);hud()}
 const ch=sc.chest,cd=ch?Math.hypot(ch.x-sc.x,ch.y-sc.y):1e9;let pr='';
 if(!sc.got&&cd<70){
  if(ch.locked&&!s.hasKey){if(!sc.lockTip){sc.lockTip=1;toast('🔒 The chest is locked. Search the stern cabin at the other end of the wreck for a key.')}}
  else{pr=ch.kind==='bottle'?'🍾 Open the old bottle':ch.kind==='hoard'?'💰 Open the treasure chest!':'🧰 Open the chest';if(actQ)openChest(sc)}
 }else if(near&&nd<80){pr='🥅 Net the lionfish';if(actQ){
   if((sc.x-near.x)*near.dir>-10&&nd<46){hurt(sc,near,HMSG.lion)}else{sc.cr.splice(sc.cr.indexOf(near),1);D3.scene.remove(near.m);G.eco+=25;G.stats.lion++;toast('🥅 Lionfish removed! +25<br><small>Each one taken off the reef saves many young native fish.</small>',0,3600);sfx(600,.1);sfx(900,.2);hud()}}
 }else if(sc.y<30){pr='⛵ Climb aboard';if(actQ)endDive(sc.got?'':'Back on deck. Your tank is refilled.')}
 if(G.mode==='dive')prompt_(pr);
}
function openChest(sc){
 sc.got=true;const s=sc.site;sfx(660,.15);setTimeout(()=>sfx(880,.15),120);setTimeout(()=>sfx(1320,.3),240);
 if(s.id==='bonus'){s.done=true;G.eco+=75;hud();dlg('<h2>☠️ Pirate relic found!</h2><p>The lid of the chest groans open. Inside: <b>'+s.relic+'</b>!</p><p>+75 points. Pirate wrecks explored: <b>'+WRECKS.filter(w=>w.done).length+' of '+WRECKS.length+'</b>. Swim back up to your airboat.</p>','Yo ho!');return}
 if(s.id==='hole'){G.eco+=100;G.pieces=5;win();return}
 G.pieces++;G.stage++;G.eco+=50;hud();
 dlg('<h2>🗺️ Map piece '+G.pieces+' of 4!</h2><div class="pieces">'+'🟫'.repeat(G.pieces)+'⬜'.repeat(4-G.pieces)+'</div><p>'+(s.id==='mangrove'?'Inside the barnacle-crusted bottle is a scrap of sailcloth, signed <b>B. Blacktide, 1733</b>.':s.id==='seagrass'?'Under the seat of the sunken skiff: an oilskin pouch with another scrap of the map.':s.id==='reef'?'A small iron-bound chest wedged in the reef holds the third piece.':'The captain\'s key turns with a clunk. Inside: the last piece!')+'</p><p class="clue">'+s.clue+'</p><p>+50 eco points. Swim back up to your airboat.</p>','Got it');
}
function win(){
 const n=Object.keys(G.found).length,rank=G.eco>=1800?'🏆 Reef Guardian':G.eco>=1000?'🥈 Keys Naturalist':'🥉 Treasure Hunter';
 dlg('<h1>💰 Treasure found!</h1><p>The lid creaks open on a heap of silver pieces of eight, emeralds and a golden compass - Captain Bonnie Blacktide\'s lost hoard, hidden since 1733.</p><p>But the real treasure of the Florida Keys is all around you: mangroves, seagrass, coral reef and open sea, each one depending on the others.</p><ul><li>Rank: <b>'+rank+'</b></li><li>Eco points: <b>'+G.eco+'</b></li><li>Species in journal: <b>'+n+' of '+NSP+'</b></li><li>Clue treasures: <b>'+CACHES.filter(c=>c.found).length+' of '+CACHES.length+'</b> · Pirate wrecks: <b>'+WRECKS.filter(w=>w.done).length+' of '+WRECKS.length+'</b> · Doubloons: <b>'+G.stats.coins+'</b></li><li>Trash removed: <b>'+G.stats.trash+'</b> · Lionfish netted: <b>'+G.stats.lion+'</b></li><li>Oopses (coral bumps, speeding near manatees): <b>'+G.stats.oops+'</b></li></ul>','Play again',()=>{endDive();newGame();intro()});
}

/* ================= dive scene (3D) ================= */
let D3=null;
const CAUS=canvasTex(256,256,(g)=>{g.fillStyle='#000';g.fillRect(0,0,256,256);const R=rng(8),pts=[];for(let i=0;i<26;i++)pts.push([R()*256,R()*256]);
 const im=g.getImageData(0,0,256,256);for(let y=0;y<256;y++)for(let x=0;x<256;x++){let a=1e9,b=1e9;for(const p of pts){let dx=Math.abs(x-p[0]),dy=Math.abs(y-p[1]);if(dx>128)dx=256-dx;if(dy>128)dy=256-dy;const d=dx*dx+dy*dy;if(d<a){b=a;a=d}else if(d<b)b=d}
  const e=Math.sqrt(b)-Math.sqrt(a),v=Math.max(0,1-e/9);const i=(y*256+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=255*v*v;im.data[i+3]=255}g.putImageData(im,0,0)});CAUS.wrapS=CAUS.wrapT=THREE.RepeatWrapping;
function floorYZ(sc,x,z){const s=sc.site;let y=floorY(sc,x);if(z<-30){const k=clamp((-z-30)/260,0,1);if(s.id==='hole'){const rim=300+18*Math.sin(x/90);y=lerp(y,rim,clamp((-z-40)/160,0,1))}
  y-=(vnoise(x/110,z/110,s.D)-.45)*70*k+Math.max(0,-z-250)*.16}return y}
function buildDive(sc){
 const s=sc.site,R=rng(s.D+91),scn=new THREE.Scene(),d={scene:scn,tex:[]};D3=d;
 const fogc=new THREE.Color(s.c1).lerp(new THREE.Color(s.c2),.55);scn.fog=new THREE.Fog(fogc,420,1700);scn.background=fogc;
 scn.add(new THREE.HemisphereLight(0xdff6ff,new THREE.Color(s.c2).getHex(),1.5));const sun=new THREE.DirectionalLight(0xffffff,1.4);sun.position.set(.2,1,.7);scn.add(sun);
 // backdrop gradient (sky above y=0)
 const BH=s.D+2400,bt=canvasTex(8,512,(g)=>{const y0=1000/BH*512,gr=g.createLinearGradient(0,y0,0,y0+s.D/BH*512);gr.addColorStop(0,s.c1);gr.addColorStop(1,s.c2);g.fillStyle=s.c2;g.fillRect(0,0,8,512);g.fillStyle=gr;g.fillRect(0,y0,8,s.D/BH*512);g.fillStyle='#bfe9ff';g.fillRect(0,0,8,y0)});d.tex.push(bt);
 const bd=new THREE.Mesh(new THREE.PlaneGeometry(s.W+6000,BH),new THREE.MeshBasicMaterial({map:bt,fog:false}));bd.position.set(s.W/2,1000-BH/2,-1000);scn.add(bd);
 // water surface
 const surf=new THREE.Mesh(new THREE.PlaneGeometry(s.W+6000,1400),new THREE.MeshBasicMaterial({color:'#e8fbff',transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false,fog:false}));surf.rotation.x=-PI/2;surf.position.set(s.W/2,0,-450);scn.add(surf);
 // sea floor
 const zs=[-1000,-760,-560,-400,-280,-190,-120,-60,-25,0,30,60],x0=-900,x1=s.W+900,nx=Math.ceil((x1-x0)/24),pos=[],idx=[];
 const uv=[];for(let j=0;j<zs.length;j++)for(let i=0;i<=nx;i++){const x=x0+i*(x1-x0)/nx;pos.push(x,-floorYZ(sc,x,zs[j]),zs[j]);uv.push(x/330,zs[j]/330)}
 for(let j=0;j<zs.length-1;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,e=c+1;idx.push(a,c,b,b,c,e)}
 const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));fg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));fg.setIndex(idx);fg.computeVertexNormals();scn.add(new THREE.Mesh(fg,new THREE.MeshStandardMaterial({color:s.floor,flatShading:true,roughness:1})));
 const cst=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({map:CAUS,transparent:true,opacity:s.id==='mangrove'?.14:.3,blending:THREE.AdditiveBlending,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));scn.add(cst);
 const sn=[];for(let i=0;i<700;i++)sn.push(R()*(s.W+800)-400,-R()*s.D,120-R()*620);const sgm=new THREE.BufferGeometry();sgm.setAttribute('position',new THREE.Float32BufferAttribute(sn,3));d.snow=new THREE.Points(sgm,new THREE.PointsMaterial({color:'#ffffff',size:2.6,transparent:true,opacity:.4,depthWrite:false}));scn.add(d.snow);
 const sp=[],si=[];for(let i=0;i<=nx;i++){const x=x0+i*(x1-x0)/nx;sp.push(x,-floorY(sc,x),60,x,-s.D-1500,60)}for(let i=0;i<nx;i++){const a=i*2;si.push(a,a+1,a+2,a+2,a+1,a+3)}
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.setIndex(si);sg.computeVertexNormals();scn.add(new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:new THREE.Color(s.floor).multiplyScalar(.45)})));
 // sun rays
 for(let i=0;i<14;i++){const m=new THREE.Mesh(PLANE,new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.05,depthWrite:false,fog:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));m.scale.set(40+R()*90,s.D*1.3,1);m.position.set(R()*(s.W+600)-300,-s.D*.55,-90-R()*500);m.rotation.z=.28;scn.add(m)}
 // rocks
 for(let i=0;i<34;i++){const x=R()*(s.W+800)-400,z=-50-R()*650,r=12+R()*30;if(s.id==='hole'&&Math.abs(x-1100)<520)continue;scn.add(I(i%2?'#6f6a5c':'#857f6e',r,r*.6,r*.8,x,-floorYZ(sc,x,z)+r*.15,z,0,R()*3,0,{flatShading:true}))}
 // boat hull + anchor line
 scn.add(B('#8a949a',130,16,60,170,5,0),B('#6f787e',20,10,60,240,9,0,0,0,.5));const al=floorY(sc,170);scn.add(Y('#dddddd',.8,al,.8,170,-al/2,0));
 // decor
 d.sway=[];
 if(s.id==='mangrove'){
  for(const r of sc.decor)if(r.k==='root'){const cv=new THREE.QuadraticBezierCurve3(new THREE.Vector3(r.x,14,r.z),new THREE.Vector3(r.x+r.w,-160,r.z),new THREE.Vector3(r.x+r.w*1.5,-floorYZ(sc,r.x+r.w*1.5,r.z)-4,r.z));scn.add(new THREE.Mesh(new THREE.TubeGeometry(cv,9,r.z<-60?3.6:3,5),M(r.z<-60?'#4a3626':'#5b3d2a')))}
  for(let i=0;i<60;i++){const r=30+R()*26;scn.add(I(['#1f5f3a','#2b7447','#256a40'][i%3],r,r*.7,r,R()*(s.W+600)-300,34+R()*20,40-R()*500,0,0,0,{flatShading:true,fog:false}))}
 }
 if(sc.blades){const n=1100,im=new THREE.InstancedMesh(CONE,new THREE.MeshStandardMaterial({color:'#ffffff'}),n),col=new THREE.Color(),bl=[];
  for(let i=0;i<n;i++){const x=R()*(s.W+900)-450,z=i%4===0?28+R()*30:-R()*R()*520;if(Math.abs(z)<14&&R()<.7){i--;continue}bl.push({x,z,h:26+R()*52,ph:R()*6,fy:floorYZ(sc,x,z)});im.setColorAt(i,col.set(['#2f9860','#23784d','#3aa86c','#1f6b44'][i%4]))}
  im.frustumCulled=false;scn.add(im);d.blades=im;d.bl=bl}
 const hull=sc.decor.find(k=>k.k==='hull');
 if(hull){const fyv=floorY(sc,hull.x+600)+8,g=new THREE.Group();g.position.set(hull.x,-fyv,0);
  const sh=new THREE.Shape();sh.moveTo(0,250);sh.lineTo(260,250);sh.lineTo(270,150);sh.lineTo(1080,165);sh.quadraticCurveTo(1240,150,1290,235);sh.quadraticCurveTo(1220,20,1040,0);sh.lineTo(60,0);sh.quadraticCurveTo(-20,60,0,250);
  const hm=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:250,bevelEnabled:false,curveSegments:8}),M('#3b2a1c'));hm.position.z=-330;g.add(hm);
  for(let i=0;i<3;i++)g.add(B('#07182a',36,40,3,68+i*70,195,-79));for(let i=0;i<5;i++)g.add(Y('#07182a',15,3,15,400+i*140,95,-79,PI/2));
  for(let i=0;i<13;i++){const x=90+i*88;g.add(B('#52392a',8,150,7,x,76,-76,0,0,.06))}g.add(B('#2e2015',1150,7,5,640,150,-76,0,0,.018));
  g.add(Y('#3b2a1c',9,380,9,690,330,-200,0,0,-.42),Y('#3b2a1c',5,210,5,720,400,-200,0,0,PI/2-.16),Y('#1f1f1f',9,84,9,880,182,-66,0,0,PI/2),B('#3b2a1c',30,10,22,880,168,-66));
  for(let i=0;i<9;i++)g.add(B('#4a3524',60+R()*60,5,26,150+R()*900,3,-30+R()*50,0,R()*3,R()*.3-.15));
  scn.add(g)}
 const skiff=sc.decor.find(k=>k.k==='skiff');
 if(skiff){const sh=new THREE.Shape();sh.moveTo(-90,26);sh.lineTo(96,30);sh.quadraticCurveTo(80,-14,50,-14);sh.lineTo(-70,-14);sh.quadraticCurveTo(-88,-6,-90,26);
  const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:54,bevelEnabled:false}),M('#6b4a2a'));m.position.set(skiff.x,-(floorY(sc,skiff.x)-10),-70);m.rotation.z=.12;scn.add(m);
  scn.add(B('#4a3320',8,36,56,skiff.x-56,-(floorY(sc,skiff.x)-14),-43,0,0,.12),B('#4a3320',8,38,56,skiff.x+34,-(floorY(sc,skiff.x)-10),-43,0,0,.12))}
 for(const k of sc.coral){const g=new THREE.Group(),r=k.r,z=k.z;g.position.set(k.x,-floorYZ(sc,k.x,z)-2,z);
  if(k.k==='brain'){g.add(E(k.col,r,r*.85,r*.9));if(!k.bg)for(let w=0;w<3;w++){const a=.5+w*.9,wc2=['#e0457a','#f5d33b','#3b8fe0'][w],wx=Math.cos(a)*r*.8,wy=Math.sin(a)*r*.68;for(const o of[-2.6,2.6])for(let q=0;q<4;q++)g.add(Y(wc2,3.4-q*.75,1.1,3.4-q*.75,wx+o,wy+3+q*1.7,r*.42))}for(let i=1;i<4;i++)g.add(TO('#8a7340',r*.96,r*.96,r*.5,0,0,0,PI/2-.5+i*.25,i*.8,0))}
  else if(k.k==='elk'){for(let i=-2;i<=2;i++){const a=i*.5,dx=-Math.sin(a),dy=Math.cos(a),l=r*.9,zz=(i%2)*r*.3;g.add(Y(k.col,r*.13,l,r*.22,dx*l/2,dy*l/2,zz,0,0,a));
     for(const f of[.4,-.45]){const a2=a+f,l2=r*.6;g.add(Y(k.col,r*.1,l2,r*.2,dx*l-Math.sin(a2)*l2/2,dy*l+Math.cos(a2)*l2/2,zz,0,0,a2))}}}
  else if(k.k==='fan'){const f=Gp(E(k.col,r*1.05,r*.8,1.4,0,r*.8,0,0,0,0,{transparent:true,opacity:.8}),Y(k.col,1.6,r*1.5,1.6,0,r*.7,1.6));for(let i=-2;i<=2;i++)f.add(Y(k.col,1,r*1.2,1,i*r*.3,r*.85,1.6,0,0,-i*.3));g.add(f);d.sway.push([f,k.x])}
  else{for(let i=-1;i<=1;i++){const h=r*(1.2+.3*Math.abs(i));g.add(Y(k.col,r*.22,h,r*.22,i*r*.5,h/2,i*4),TO('#b89a2a',r*.2,r*.2,r*.2,i*r*.5,h,i*4,PI/2))}}
  scn.add(g)}
 // interactive objects
 for(const t of sc.trash){const ring=new THREE.Mesh(RING,new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.DoubleSide,fog:false}));ring.scale.setScalar(18);
  const g=Gp(ring);if(t.k===0)g.add(Y('#c8ebff',4.5,13,4.5,0,0,0,0,0,PI/2,{transparent:true,opacity:.85}),Y('#e04a3a',2.2,3,2.2,8,0,0,0,0,PI/2));
  else if(t.k===1)g.add(I('#ffffff',9,11,6,0,0,0,0,0,0,{transparent:true,opacity:.7,flatShading:true}));
  else g.add(TO('#d8f06a',8,8,8,0,0,0,.6),TO('#d8f06a',6,6,6,2,1,0,1.6,.5),TO('#d8f06a',7,7,7,-2,-1,0,.2,1.2));
  t.m=g;g.position.set(t.x,-t.y,0);scn.add(g)}
 for(const c of sc.coins){c.m=Gp(Y('#ffd34d',7,1.6,7,0,0,0,PI/2),Y('#e0a820',5,1.9,5,0,0,0,PI/2));c.m.position.set(c.x,-c.y,0);scn.add(c.m)}
 if(sc.key){const g=Gp(glow(110),TO('#ffd34d',7,7,7,-9,0,0),B('#ffd34d',20,2.6,2.6,7,0,0),B('#ffd34d',2.6,7,2.6,11,-4,0),B('#ffd34d',2.6,7,2.6,16,-4,0));sc.key.m=g;g.position.set(sc.key.x,-sc.key.y,0);scn.add(g)}
 const ch=sc.chest,cg=Gp(glow(170));
 if(ch.kind==='bottle'){cg.add(Y('#78be96',7,24,7,0,0,0,0,0,PI/2-.5,{transparent:true,opacity:.8}),Y('#78be96',3,10,3,13,8,0,0,0,PI/2-.5,{transparent:true,opacity:.8}),Y('#8a5a22',3.2,4,3.2,18.5,11,0,0,0,PI/2-.5),Y('#f6ecd0',4,14,4,-1,-.5,0,0,0,PI/2-.5))}
 else{const k=ch.kind==='hoard'?1.5:1,box=Gp(B('#7a4a1e',40,22,26,0,0,0),B('#e0b83a',41,3,27,0,4,0),B('#e0b83a',3,23,27,-12,0,0),B('#e0b83a',3,23,27,12,0,0)),lid=Gp(B('#93602a',40,10,26,0,5,13),B('#e0b83a',3,10.6,27,-12,5,13),B('#e0b83a',3,10.6,27,12,5,13),B('#e0b83a',7,8,2,0,2,26.6));
  lid.position.set(0,11,-13);const gold=Gp();for(let i=0;i<12;i++)gold.add(E('#ffd34d',4,4,4,-14+(i%6)*5.6,10+(i>5?3:0),-5+(i%3)*5));gold.add(E('#3fd68a',3,3,3,6,14,2),E('#e0457a',3,3,3,-8,14,-2));gold.visible=false;box.add(lid,gold);box.scale.setScalar(k);box.position.y=k*11-11;cg.add(box);d.lid=lid;d.gold=gold}
 cg.position.set(ch.x,-ch.y-4,0);scn.add(cg);
 for(const c of sc.cr){const m=MODEL[c.kind](c);c.m=m;scn.add(m)}
 d.diver=diverM();scn.add(d.diver);
 d.bub=[];for(let i=0;i<26;i++){const m=E('#ffffff',1,1,1,0,0,0,0,0,0,{transparent:true,opacity:.5});m.visible=false;scn.add(m);d.bub.push(m)}
}
function disposeDive(){if(!D3)return;D3.scene.traverse(o=>{if(o.geometry&&!o.geometry.userData.shared)o.geometry.dispose()});D3.tex.forEach(t=>t.dispose());D3=null}
const dm2=new THREE.Object3D();
function drawDive(){
 const sc=G.dive,s=sc.site,d=D3,t=G.t;
 renderer.toneMapping=THREE.NoToneMapping;if(camera.fov!==46){camera.fov=46;camera.updateProjectionMatrix()}CAUS.offset.set(t*.03,Math.sin(t*.4)*.1);d.snow.position.set(Math.sin(t*.3)*14,Math.sin(t*.2)*10,0);
 const dist=560*clamp(1.25/camera.aspect,1,1.9),cx=clamp(sc.x,260,s.W-260),cy=clamp(sc.y,150,Math.max(150,s.D-170));
 camera.position.set(cx,-cy+30,dist);camera.lookAt(cx,-cy,0);
 const dv=d.diver;dv.position.set(sc.x,-sc.y,0);dv.rotation.set(0,sc.face>0?0:PI,clamp(-sc.vy/260,-.6,.6));dv.visible=!(sc.inv>0&&Math.sin(t*30)>0);
 const k=Math.sin(sc.kick)*.4;dv.userData.legs[0].rotation.z=k;dv.userData.legs[1].rotation.z=-k;
 for(const c of sc.cr){const m=c.m;m.position.set(c.x,-c.y,c.z);if(c.kind!=='seastar')m.rotation.y=c.dir<0?PI:0;animModel(m,c,c.t)}
 for(const tr of sc.trash){tr.m.position.y=-tr.y+Math.sin(t*2+tr.x)*3;tr.m.children[1].rotation.z=Math.sin(t+tr.x)*.4;tr.m.children[0].scale.setScalar(18+Math.sin(t*4+tr.x)*1.5)}
 for(const c of sc.coins){c.m.rotation.y=t*2+c.x;c.m.position.y=-c.y+Math.sin(t*3+c.x)*2}
 if(sc.key){sc.key.m.position.y=-sc.key.y+Math.sin(t*2)*4;sc.key.m.rotation.y=Math.sin(t*1.5)*.8}
 if(d.lid){const a=sc.got?-1.9:0;d.lid.rotation.x+=(a-d.lid.rotation.x)*.08;d.gold.visible=sc.got}
 for(const f of d.sway)f[0].rotation.z=Math.sin(t+f[1])*.09;
 if(d.blades){const bl=d.bl;for(let i=0;i<bl.length;i++){const b=bl[i],a=Math.sin(t*1.3+b.ph+b.x/60)*.28;dm2.position.set(b.x-Math.sin(a)*b.h/2,-b.fy+Math.cos(a)*b.h/2-2,b.z);dm2.rotation.set(0,0,a);dm2.scale.set(2.6,b.h,.8);dm2.updateMatrix();d.blades.setMatrixAt(i,dm2.matrix)}d.blades.instanceMatrix.needsUpdate=true}
 for(let i=0;i<d.bub.length;i++){const b=sc.bub[i],m=d.bub[i];if(b){m.visible=true;m.position.set(b.x,-b.y,4);m.scale.setScalar(b.r)}else m.visible=false}
 renderer.render(d.scene,camera);
 // 2D overlay: darkness with a light around the diver, depth read-out
 ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
 const dk=clamp((sc.y-380)/(s.D-300),0,.62);if(dk>0){_v.set(sc.x,-sc.y,0).project(camera);const px=(_v.x+1)/2*W,py=(1-_v.y)/2*H,u=H/520,v=ctx.createRadialGradient(px,py,90*u,px,py,430*u);v.addColorStop(0,'rgba(0,8,20,0)');v.addColorStop(1,'rgba(0,8,20,'+dk+')');ctx.fillStyle=v;ctx.fillRect(0,0,W,H)}
 ctx.fillStyle='#fff';ctx.font='bold 12px Verdana';ctx.textAlign='right';ctx.fillText('Depth '+Math.max(0,sc.y/9|0)+' ft',W-10,H-10);
}

/* ================= surface drawing ================= */
let camA=-1.2;
function drawSurface(dt){
 const b=G.boat,t=G.t;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 if(G.cam==='chase'){let da=b.a-camA;while(da>PI)da-=TAU;while(da<-PI)da+=TAU;camA+=da*(1-Math.pow(.03,dt));const f=camera.aspect<1?74:58;if(camera.fov!==f){camera.fov=f;camera.updateProjectionMatrix()}
  const cx=Math.cos(camA),cz=Math.sin(camA);camera.position.set(b.x-cx*178,80,b.y-cz*178);camera.lookAt(b.x+cx*70,12,b.y+cz*70)}
 else{camA=-PI/2;if(camera.fov!==46){camera.fov=46;camera.updateProjectionMatrix()}const k=clamp(1.35/camera.aspect,1,2);camera.position.set(b.x,440*k,b.y+330*k);camera.lookAt(b.x,0,b.y-25)}
 S3.sky.position.set(camera.position.x,0,camera.position.z);
 S3.sun.target.position.set(b.x,0,b.y);S3.sun.position.copy(S3.sun.target.position).addScaledVector(S3.sunDir,1000);
 for(const c of S3.chunks)c.m.visible=Math.abs(c.x-camera.position.x)<3300&&Math.abs(c.z-camera.position.z)<3300;
 S3.wt.offset.set(t*.02,t*.013);
 const sp=Math.hypot(b.vx,b.vy),bm=S3.boat;bm.position.set(b.x,1.2+Math.sin(t*3)*.5,b.y);bm.rotation.set(Math.sin(t*2.1)*.02,-b.a,sp/235*.07+Math.sin(t*1.7)*.015);bm.userData.fan.rotation.x=b.fan;
 for(const w of S3.wake){const l=w.userData.l||0;if(l>0){w.userData.l=l-dt*.7;w.material.opacity=l*.6;w.scale.setScalar(3+(1-l)*11)}else w.material.opacity=0}
 for(const e of G.ents){const m=e.m;
  switch(e.kind){
   case'manatee':m.position.set(e.x,0,e.y);m.userData.b.rotation.y=-e.a;break;
   case'dolphin':{const j=Math.sin(t*1.6+e.ph);m.position.set(e.x,j>0?j*17-3:-5,e.y);m.rotation.set(0,-(e.a+PI/2),j>-.2?Math.cos(t*1.6+e.ph)*.75:0);break}
   case'flyfish':{const j=Math.sin(t*2.2+e.ph);m.position.set(e.x,j>0?j*14:-3,e.y);m.rotation.set(0,-(e.a+PI/2),j>0?Math.cos(t*2.2+e.ph)*.3:0);break}
   case'fin':m.position.set(e.x,-9.5,e.y);m.rotation.y=-(e.a+PI/2);m.userData.tail.rotation.y=Math.sin(t*4+e.ph)*.4;break;
   case'turtle':m.position.set(e.x,-4,e.y);m.rotation.y=e.ph+Math.sin(t*.2);m.userData.anim(m,e,t*.5);break;
   case'pelican':{m.scale.setScalar(.62);m.position.set(e.x,58,e.y);m.rotation.y=-e.a;const f=Math.sin(t*5+e.ph)*.5;m.userData.w[0].rotation.x=-f;m.userData.w[1].rotation.x=f;break}
   case'frigate':m.scale.setScalar(.62);m.position.set(e.x,110,e.y);m.rotation.set(Math.sin(t*.5+e.ph)*.15,-e.a,0);break;
   case'croc':m.position.set(e.x,-1.5,e.y);m.rotation.y=-e.a;m.userData.tail.rotation.y=Math.sin(t+e.ph)*.3;break;
  }}
 S3.bell.rotation.z=Math.sin(t*1.3)*.09;S3.bell.rotation.x=Math.cos(t*1.1)*.06;
 S3.sites.forEach((g,i)=>{g.visible=i<=G.stage;const done=i<G.stage;g.userData.flag.material.map=done?FLAG.done:FLAG.dive;g.userData.ball.material=M(done?'#99aaaa':'#ff7a2a');g.userData.ring.visible=!done;g.userData.beam.visible=i===G.stage&&G.cam==='chase';g.userData.ring.scale.setScalar(42+Math.sin(t*3)*6);g.position.y=Math.sin(t*2+i)*1.2});
 S3.wrecks.forEach((g,i)=>{const w=WRECKS[i];g.userData.flag.material.map=w.done?FLAG.done:FLAG.skull;g.position.y=Math.sin(t*2+i*2)*1.2});
 S3.caches.forEach((g,i)=>{const c=CACHES[i],dd=Math.hypot(c.x-b.x,c.y-b.y);g.visible=!c.found&&dd<170;g.scale.setScalar(36+Math.sin(t*5)*10)});
 renderer.render(S3.scene,camera);
 // overlay: arrow to the next dive site
 ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
 const s=SITES[G.stage];
 if(s){_v.set(s.x,0,s.y).project(camera);const sx=(_v.x+1)/2*W,sy=(1-_v.y)/2*H;if(_v.z>1||sx<30||sy<90||sx>W-30||sy>H-90){_v.set(b.x,10,b.y).project(camera);const bx=(_v.x+1)/2*W,by=(1-_v.y)/2*H,a=Math.atan2(s.y-b.y,s.x-b.x)-camA-PI/2,r=Math.min(W,H)*.2;
   ctx.save();ctx.translate(bx+Math.cos(a)*r,by+Math.sin(a)*r);ctx.rotate(a);ctx.fillStyle='#ffd34d';ctx.strokeStyle='#5a3d00';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-10,-12);ctx.lineTo(-4,0);ctx.lineTo(-10,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
   ctx.fillStyle='#fff';ctx.font='bold 12px Verdana';ctx.textAlign='center';ctx.strokeStyle='rgba(0,0,0,.6)';ctx.lineWidth=3;const tx=bx+Math.cos(a)*(r+30),ty=by+Math.sin(a)*(r+30)+4,dd=Math.round(Math.hypot(s.x-b.x,s.y-b.y)/10)+' m';ctx.strokeText(dd,tx,ty);ctx.fillText(dd,tx,ty)}}
 drawRadar();
}
function drawRadar(){
 const b=G.boat,t=G.t,m=$('mini'),g=m.getContext('2d'),N=m.width,span=1300,k=N/span;
 g.fillStyle='#0b4f8a';g.fillRect(0,0,N,N);
 const x0=b.x-span/2,y0=b.y-span/2,sx=Math.max(0,x0),sy=Math.max(0,y0),ex=Math.min(WW,x0+span),ey=Math.min(WH,y0+span);
 if(ex>sx&&ey>sy)g.drawImage(wc,sx/2,sy/2,(ex-sx)/2,(ey-sy)/2,(sx-x0)*k,(sy-y0)*k,(ex-sx)*k,(ey-sy)*k);
 const blip=(x,y,col,r,edge)=>{let dx=(x-b.x)*k,dy=(y-b.y)*k;const d=Math.hypot(dx,dy),mx=N/2-12;if(d>mx){if(!edge)return;dx*=mx/d;dy*=mx/d}g.fillStyle=col;g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.arc(N/2+dx,N/2+dy,r,0,TAU);g.fill();g.stroke()};
 for(const w of WRECKS)blip(w.x,w.y,w.done?'#8fe08f':'#111',7);
 for(const c of CACHES)if(c.found)blip(c.x,c.y,'#ffd34d',6);
 SITES.forEach((p,i)=>{if(i<G.stage)blip(p.x,p.y,'#8fe08f',7);else if(i===G.stage)blip(p.x,p.y,'#ff3b2a',9+Math.sin(t*4)*2,true)});
 g.save();g.translate(N/2,N/2);g.rotate(b.a);g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=2.5;g.beginPath();g.moveTo(15,0);g.lineTo(-10,-9);g.lineTo(-5,0);g.lineTo(-10,9);g.closePath();g.fill();g.stroke();g.restore();
 g.fillStyle='#fff';g.font='bold 20px Verdana';g.textAlign='center';g.strokeStyle='rgba(0,0,0,.7)';g.lineWidth=4;g.strokeText('N',N/2,26);g.fillText('N',N/2,26);
}
function openMap(){
 const m=$('mapc'),g=m.getContext('2d'),k=m.width/WW,b=G.boat;g.drawImage(wc,0,0,m.width,m.height);
 const mark=(x,y,txt,col,lab)=>{g.fillStyle=col;g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(x*k,y*k,9,0,TAU);g.fill();g.stroke();g.fillStyle='#fff';g.font='12px serif';g.textAlign='center';g.fillText(txt,x*k,y*k+4);
  if(lab){g.font='bold 11px Verdana';g.strokeStyle='rgba(0,0,0,.75)';g.lineWidth=3;g.strokeText(lab,x*k,y*k-13);g.fillStyle='#fff';g.fillText(lab,x*k,y*k-13)}};
 WRECKS.forEach(w=>mark(w.x,w.y,w.done?'✓':'☠',w.done?'#3a8a4a':'#111',w.done?w.name.replace('Wreck of the ',''):''));
 CACHES.forEach(c=>{if(c.found)mark(c.x,c.y,'★','#b98a12',c.lm)});
 SITES.forEach((p,i)=>{if(i<G.stage)mark(p.x,p.y,'✓','#3a8a4a',p.name);else if(i===G.stage)mark(p.x,p.y,'!','#e0291f','Next dive')});
 g.save();g.translate(b.x*k,b.y*k);g.rotate(b.a);g.fillStyle='#ffd34d';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(13,0);g.lineTo(-9,-8);g.lineTo(-4,0);g.lineTo(-9,8);g.closePath();g.fill();g.stroke();g.restore();
 $('mp').classList.add('on');G.paused=true;
}
function drawJoy(){if(joy.id===null)return;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='rgba(255,255,255,.18)';dot(ctx,joy.bx,joy.by,56);ctx.fillStyle='rgba(255,255,255,.5)';dot(ctx,joy.bx+joy.x*56,joy.by+joy.y*56,24)}

/* ---------- loop ---------- */
let last=0,fWarm=0,fAcc=0,fN=0;
function frame(ts){
 const raw=(ts-last)/1000||0,dt=Math.min(.05,raw);last=ts;
 if(!G.paused&&!window.__noAdapt&&raw<1){fWarm+=raw;if(fWarm>4){fAcc+=raw;fN++;if(fAcc>2.5){const fps=fN/fAcc;fAcc=fN=0;if(fps<24&&QL<3){QL++;if(QL===1){S3.sun.castShadow=false}else{PRmax=QL===2?1:.7;resize()}}}}}
 if(!G.paused){G.t+=dt;G.cool-=dt;if(G.mode==='surface')updSurface(dt);else updDive(dt)}
 actQ=false;
 if(G.mode==='dive'&&G.dive&&D3)drawDive();else drawSurface(dt);
 drawJoy();requestAnimationFrame(frame);
}
function intro(){
 dlg('<h1>🏝️ Keys Treasure Quest</h1><p>In 1733 the pirate captain <b>Bonnie Blacktide</b> tore her treasure map into four pieces and hid them across the <b>Florida Keys</b> - in the mangroves, the seagrass, the coral reef and a sunken galleon.</p><p>Skim the shallows in your <b>airboat</b>, <b>scuba dive</b> at each flagged site, and piece the map together. Along the way, fill your field journal with the wildlife of each ecosystem and leave the Keys cleaner than you found them.</p><ul><li><b>Drive the airboat:</b> <kbd>A</kbd>/<kbd>D</kbd> or ←/→ to steer, <kbd>W</kbd>/↑ to go, <kbd>S</kbd>/↓ to brake - or drag anywhere on a touch screen. Prefer the old top-down view? Press <kbd>V</kbd> or tap 🎥.</li><li><b>Action:</b> <kbd>Space</kbd> or the yellow button · <b>Map:</b> <kbd>M</kbd> or tap the radar · <b>Journal:</b> <kbd>J</kbd> · <b>Clues:</b> <kbd>C</kbd></li><li>Slow down inside the yellow rings - manatees!</li><li><b>📜 Clues:</b> ten riddles lead to treasures the crew hid near landmarks - a lighthouse, a skull-shaped rock and more. No arrow for those: read the clue and explore.</li><li><b>☠️ Wrecks:</b> three pirate shipwrecks (black skull flags) hold relics and doubloons - but sharks guard them.</li></ul><p class="clue">An old conch fisherman whispers: "Start where the trees walk on water, out west in the bay."</p>','Cast off!');
}
G=null;genWorld();placeLandmarks();placeSites();paintWorld();buildSurface();newGame();intro();requestAnimationFrame(frame);
window.__game={get G(){return G},renderer,S3,SITES,WRECKS,CACHES,LM,startDive,solid,tileAt};
