var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function a(t){return document.createTextNode(t)}function d(){return a(" ")}function f(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function m(t,e){t.value=null==e?"":e}let g;function $(t){g=t}const y=[],b=[],x=[],v=[],B=Promise.resolve();let C=!1;function S(t){x.push(t)}const _=new Set;let k=0;function w(){const t=g;do{for(;k<y.length;){const t=y[k];k++,$(t),E(t.$$)}for($(null),y.length=0,k=0;b.length;)b.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];_.has(e)||(_.add(e),e())}x.length=0}while(y.length);for(;v.length;)v.pop()();C=!1,_.clear(),$(t)}function E(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}const j=new Set;function T(t,e){-1===t.$$.dirty[0]&&(y.push(t),C||(C=!0,B.then(w)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(c,l,i,s,a,d,f,p=[-1]){const h=g;$(c);const m=c.$$={fragment:null,ctx:null,props:d,update:t,not_equal:a,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(h?h.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:l.target||h.$$.root};f&&f(m.root);let y=!1;if(m.ctx=i?i(c,l.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return m.ctx&&a(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),y&&T(c,t)),e})):[],m.update(),y=!0,o(m.before_update),m.fragment=!!s&&s(m.ctx),l.target){if(l.hydrate){const t=function(t){return Array.from(t.childNodes)}(l.target);m.fragment&&m.fragment.l(t),t.forEach(u)}else m.fragment&&m.fragment.c();l.intro&&((b=c.$$.fragment)&&b.i&&(j.delete(b),b.i(x))),function(t,n,c,l){const{fragment:i,on_mount:u,on_destroy:s,after_update:a}=t.$$;i&&i.m(n,c),l||S((()=>{const n=u.map(e).filter(r);s?s.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(S)}(c,l.target,l.anchor,l.customElement),w()}var b,x;$(h)}var A=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","0"],I=["𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭","𝟭","𝟮","𝟯","𝟰","𝟱","𝟲","𝟳","𝟴","𝟵","𝟬"],O=["𝙖","𝙗","𝙘","𝙙","𝙚","𝙛","𝙜","𝙝","𝙞","𝙟","𝙠","𝙡","𝙢","𝙣","𝙤","𝙥","𝙦","𝙧","𝙨","𝙩","𝙪","𝙫","𝙬","𝙭","𝙮","𝙯","𝘼","𝘽","𝘾","𝘿","𝙀","𝙁","𝙂","𝙃","𝙄","𝙅","𝙆","𝙇","𝙈","𝙉","𝙊","𝙋","𝙌","𝙍","𝙎","𝙏","𝙐","𝙑","𝙒","𝙓","𝙔","𝙕","1","2","3","4","5","6","7","8","9","0"],F=["🄰","🄱","🄲","🄳","🄴","🄵","🄶","🄷","🄸","🄹","🄺","🄻","🄼","🄽","🄾","🄿","🅀","🅁","🅂","🅃","🅄","🅅","🅆","🅇","🅈","🅉","🄰","🄱","🄲","🄳","🄴","🄵","🄶","🄷","🄸","🄹","🄺","🄻","🄼","🄽","🄾","🄿","🅀","🅁","🅂","🅃","🅄","🅅","🅆","🅇","🅈","🅉","1","2","3","4","5","6","7","8","9","0"],W=["🅰","🅱","🅲","🅳","🅴","🅵","🅶","🅷","🅸","🅹","🅺","🅻","🅼","🅽","🅾","🅿","🆀","🆁","🆂","🆃","🆄","🆅","🆆","🆇","🆈","🆉","🅰","🅱","🅲","🅳","🅴","🅵","🅶","🅷","🅸","🅹","🅺","🅻","🅼","🅽","🅾","🅿","🆀","🆁","🆂","🆃","🆄","🆅","🆆","🆇","🆈","🆉","1","2","3","4","5","6","7","8","9","0"],N=["ⓐ","ⓑ","ⓒ","ⓓ","ⓔ","ⓕ","ⓖ","ⓗ","ⓘ","ⓙ","ⓚ","ⓛ","ⓜ","ⓝ","ⓞ","ⓟ","ⓠ","ⓡ","ⓢ","ⓣ","ⓤ","ⓥ","ⓦ","ⓧ","ⓨ","ⓩ","Ⓐ","Ⓑ","Ⓒ","Ⓓ","Ⓔ","Ⓕ","Ⓖ","Ⓗ","Ⓘ","Ⓙ","Ⓚ","Ⓛ","Ⓜ","Ⓝ","Ⓞ","Ⓟ","Ⓠ","Ⓡ","Ⓢ","Ⓣ","Ⓤ","Ⓥ","Ⓦ","Ⓧ","Ⓨ","Ⓩ","①","②","③","④","⑤","⑥","⑦","⑧","⑨","⓪,"],q=["𝒶","𝒷","𝒸","𝒹","𝑒","𝒻","𝑔","𝒽","𝒾","𝒿","𝓀","𝓁","𝓂","𝓃","𝑜","𝓅","𝓆","𝓇","𝓈","𝓉","𝓊","𝓋","𝓌","𝓍","𝓎","𝓏","𝒜","𝐵","𝒞","𝒟","𝐸","𝐹","𝒢","𝐻","𝐼","𝒥","𝒦","𝐿","𝑀","𝒩","𝒪","𝒫","𝒬","𝑅","𝒮","𝒯","𝒰","𝒱","𝒲","𝒳","𝒴","𝒵","𝟣","𝟤","𝟥","𝟦","𝟧","𝟨","𝟩","𝟪","𝟫","𝟢"],L=["𝓪","𝓫","𝓬","𝓭","𝓮","𝓯","𝓰","𝓱","𝓲","𝓳","𝓴","𝓵","𝓶","𝓷","𝓸","𝓹","𝓺","𝓻","𝓼","𝓽","𝓾","𝓿","𝔀","𝔁","𝔂","𝔃","𝓐","𝓑","𝓒","𝓓","𝓔","𝓕","𝓖","𝓗","𝓘","𝓙","𝓚","𝓛","𝓜","𝓝","𝓞","𝓟","𝓠","𝓡","𝓢","𝓣","𝓤","𝓥","𝓦","𝓧","𝓨","𝓩","1","2","3","4","5","6","7","8","9","0"],U=["𝔞","𝔟","𝔠","𝔡","𝔢","𝔣","𝔤","𝔥","𝔦","𝔧","𝔨","𝔩","𝔪","𝔫","𝔬","𝔭","𝔮","𝔯","𝔰","𝔱","𝔲","𝔳","𝔴","𝔵","𝔶","𝔷","𝔄","𝔅","ℭ","𝔇","𝔈","𝔉","𝔊","ℌ","ℑ","𝔍","𝔎","𝔏","𝔐","𝔑","𝔒","𝔓","𝔔","ℜ","𝔖","𝔗","𝔘","𝔙","𝔚","𝔛","𝔜","ℨ","1","2","3","4","5","6","7","8","9","0"],D=["𝖆","𝖇","𝖈","𝖉","𝖊","𝖋","𝖌","𝖍","𝖎","𝖏","𝖐","𝖑","𝖒","𝖓","𝖔","𝖕","𝖖","𝖗","𝖘","𝖙","𝖚","𝖛","𝖜","𝖝","𝖞","𝖟","𝕬","𝕭","𝕮","𝕯","𝕰","𝕱","𝕲","𝕳","𝕴","𝕵","𝕶","𝕷","𝕸","𝕹","𝕺","𝕻","𝕼","𝕽","𝕾","𝕿","𝖀","𝖁","𝖂","𝖃","𝖄","𝖅","1","2","3","4","5","6","7","8","9","0"],M=["𝘢","𝘣","𝘤","𝘥","𝘦","𝘧","𝘨","𝘩","𝘪","𝘫","𝘬","𝘭","𝘮","𝘯","𝘰","𝘱","𝘲","𝘳","𝘴","𝘵","𝘶","𝘷","𝘸","𝘹","𝘺","𝘻","𝘈","𝘉","𝘊","𝘋","𝘌","𝘍","𝘎","𝘏","𝘐","𝘑","𝘒","𝘓","𝘔","𝘕","𝘖","𝘗","𝘘","𝘙","𝘚","𝘛","𝘜","𝘝","𝘞","𝘟","𝘠","𝘡","1","2","3","4","5","6","7","8","9","0"],P=["a̷","b̷","c̷","d̷","e̷","f̷","g̷","h̷","i̷","j̷","k̷","l̷","m̷","n̷","o̷","p̷","q̷","r̷","s̷","t̷","u̷","v̷","w̷","x̷","y̷","z̷","A̷","B̷","C̷","D̷","E̷","F̷","G̷","H̷","I̷","J̷","K̷","L̷","M̷","N̷","O̷","P̷","Q̷","R̷","S̷","T̷","U̷","V̷","W̷","X̷","Y̷","Z̷","1̷","2̷","3̷","4̷","5̷","6̷","7̷","8̷","9̷","0̷"],Q=["𝕒","𝕓","𝕔","𝕕","𝕖","𝕗","𝕘","𝕙","𝕚","𝕛","𝕜","𝕝","𝕞","𝕟","𝕠","𝕡","𝕢","𝕣","𝕤","𝕥","𝕦","𝕧","𝕨","𝕩","𝕪","𝕫","𝔸","𝔹","ℂ","𝔻","𝔼","𝔽","𝔾","ℍ","𝕀","𝕁","𝕂","𝕃","𝕄","ℕ","𝕆","ℙ","ℚ","ℝ","𝕊","𝕋","𝕌","𝕍","𝕎","𝕏","𝕐","ℤ","𝟙","𝟚","𝟛","𝟜","𝟝","𝟞","𝟟","𝟠","𝟡","𝟘"],Y=["a̶","b̶","c̶","d̶","e̶","f̶","g̶","h̶","i̶","j̶","k̶","l̶","m̶","n̶","o̶","p̶","q̶","r̶","s̶","t̶","u̶","v̶","w̶","x̶","y̶","z̶","A̶","B̶","C̶","D̶","E̶","F̶","G̶","H̶","I̶","J̶","K̶","L̶","M̶","N̶","O̶","P̶","Q̶","R̶","S̶","T̶","U̶","V̶","W̶","X̶","Y̶","Z̶","1̶","2̶","3̶","4̶","5̶","6̶","7̶","8̶","9̶","0̶"],Z=["𝚊","𝚋","𝚌","𝚍","𝚎","𝚏","𝚐","𝚑","𝚒","𝚓","𝚔","𝚕","𝚖","𝚗","𝚘","𝚙","𝚚","𝚛","𝚜","𝚝","𝚞","𝚟","𝚠","𝚡","𝚢","𝚣","𝙰","𝙱","𝙲","𝙳","𝙴","𝙵","𝙶","𝙷","𝙸","𝙹","𝙺","𝙻","𝙼","𝙽","𝙾","𝙿","𝚀","𝚁","𝚂","𝚃","𝚄","𝚅","𝚆","𝚇","𝚈","𝚉","𝟷","𝟸","𝟹","𝟺","𝟻","𝟼","𝟽","𝟾","𝟿","𝟶"],z=["ａ","ｂ","ｃ","ｄ","ｅ","ｆ","ｇ","ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ","ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ","ｖ","ｗ","ｘ","ｙ","ｚ","Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ","１","２","３","４","５","６","７","８","９","０"],H=["ᵃ","ᵇ","ᶜ","ᵈ","ᵉ","ᶠ","ᵍ","ʰ","ᶦ","ʲ","ᵏ","ˡ","ᵐ","ⁿ","ᵒ","ᵖ","ᵠ","ʳ","ˢ","ᵗ","ᵘ","ᵛ","ʷ","ˣ","ʸ","ᶻ","ᴬ","ᴮ","ᶜ","ᴰ","ᴱ","ᶠ","ᴳ","ᴴ","ᴵ","ᴶ","ᴷ","ᴸ","ᴹ","ᴺ","ᴼ","ᴾ","ᵠ","ᴿ","ˢ","ᵀ","ᵁ","ⱽ","ᵂ","ˣ","ʸ","ᶻ","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹","⁰"],J=["ₐ","ᵦ","𝒸","𝒹","ₑ","𝒻","𝓰","ₕ","ᵢ","ⱼ","ₖ","ₗ","ₘ","ₙ","ₒ","ₚ","ᵩ","ᵣ","ₛ","ₜ","ᵤ","ᵥ","𝓌","ₓ","ᵧ","𝓏","ₐ","B","C","D","ₑ","F","G","ₕ","ᵢ","ⱼ","ₖ","ₗ","ₘ","ₙ","ₒ","ₚ","Q","ᵣ","ₛ","ₜ","ᵤ","ᵥ","W","ₓ","Y","Z","₁","₂","₃","₄","₅","₆","₇","₈","₉","₀"];const K={};A.forEach(((t,e)=>{K[t]={Bold:I[e],"Bold Italic":O[e],Box:F[e],"Box Filled":W[e],Circle:N[e],Cursive:q[e],"Cursive Bold":L[e],Goth:U[e],"Goth Bold":D[e],Italic:M[e],Slash:P[e],Stem:Q[e],Strike:Y[e],Subscript:J[e],Superscript:H[e],Typewriter:Z[e],Wide:z[e]}}));const R=A,V=(t,e)=>t.map((t=>R.includes(t)?K[t][e]:t)).join("");function X(t,e,n){const o=t.slice();return o[6]=e[n],o}function tt(t){let e,n,o,r=t[2][t[6]]+"";return{c(){e=s("div"),n=a(r),p(e,"data-style",o=t[6])},m(t,o){i(t,e,o),l(e,n)},p(t,c){4&c&&r!==(r=t[2][t[6]]+"")&&h(n,r),4&c&&o!==(o=t[6])&&p(e,"data-style",o)},d(t){t&&u(e)}}}function et(t){let e,n,o,r,c,p,m,g=t[6]+"",$=t[1]&&tt(t);function y(){return t[5](t[6])}return{c(){e=s("p"),n=s("small"),o=a(g),r=d(),$&&$.c(),c=d()},m(t,u){i(t,e,u),l(e,n),l(n,o),l(e,r),$&&$.m(e,null),l(e,c),p||(m=f(e,"click",y),p=!0)},p(n,r){t=n,4&r&&g!==(g=t[6]+"")&&h(o,g),t[1]?$?$.p(t,r):($=tt(t),$.c(),$.m(e,c)):$&&($.d(1),$=null)},d(t){t&&u(e),$&&$.d(),p=!1,m()}}}function nt(e){let n,o,r,c,a,h,g,$=Object.keys(e[2]),y=[];for(let t=0;t<$.length;t+=1)y[t]=et(X(e,$,t));return{c(){n=s("input"),o=d(),r=s("main"),c=s("small"),c.textContent="Click/tap to copy",a=d();for(let t=0;t<y.length;t+=1)y[t].c();p(n,"placeholder","type something...")},m(t,u){i(t,n,u),m(n,e[0]),i(t,o,u),i(t,r,u),l(r,c),l(r,a);for(let t=0;t<y.length;t+=1)y[t].m(r,null);h||(g=f(n,"input",e[4]),h=!0)},p(t,[e]){if(1&e&&n.value!==t[0]&&m(n,t[0]),14&e){let n;for($=Object.keys(t[2]),n=0;n<$.length;n+=1){const o=X(t,$,n);y[n]?y[n].p(o,e):(y[n]=et(o),y[n].c(),y[n].m(r,null))}for(;n<y.length;n+=1)y[n].d(1);y.length=$.length}},i:t,o:t,d(t){t&&u(n),t&&u(o),t&&u(r),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(y,t),h=!1,g()}}}function ot(t,e,n){let o,r;const c=t=>{const e=document.querySelector(`[data-style="${t}"]`);navigator.clipboard.writeText(e.innerText)};let l="";return t.$$.update=()=>{1&t.$$.dirty&&n(2,o=(t=>{const e=t.split("");return{Bold:V(e,"Bold"),"Bold Italic":V(e,"Bold Italic"),Box:V(e,"Box"),"Box Filled":V(e,"Box Filled"),Circle:V(e,"Circle"),Cursive:V(e,"Cursive"),"Cursive Bold":V(e,"Cursive Bold"),Goth:V(e,"Goth"),"Goth Bold":V(e,"Goth Bold"),Italic:V(e,"Italic"),Slash:V(e,"Slash"),Stem:V(e,"Stem"),Strike:V(e,"Strike"),Subscript:V(e,"Subscript"),Superscript:V(e,"Superscript"),Typewriter:V(e,"Typewriter"),Wide:V(e,"Wide"),"Alternating Case One":e.map(((t,e)=>e%2==0?t:t.toUpperCase())).join(""),"Alternating Case Two":e.map(((t,e)=>e%2==0?t.toUpperCase():t)).join("")}})(l)),1&t.$$.dirty&&n(1,r=0!==l.length)},[l,r,o,c,function(){l=this.value,n(0,l)},t=>c(t)]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),G(this,t,ot,nt,c,{})}}({target:document.body})}();
