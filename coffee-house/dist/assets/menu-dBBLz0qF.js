import{b as R,g as U,i as y,c as J}from"./api-CuwP49r_.js";/* empty css             */const N=u("#ifLoadError"),A=document.createElement("div");A.className="loader";A.innerHTML=`
  <svg xmlns="http:
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="loader-icon">
    <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/>
    <path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/>
    <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
    <path d="m4.9 4.9 2.9 2.9"/>
  </svg>
`;function V(){N.replaceChildren(A)}function Y(){N.replaceChildren()}V();function u(e,t=document){const n=t.querySelector(e);if(!n)throw new Error(`Element not found: ${e}`);return n}function Q(e,t=document){return Array.from(t.querySelectorAll(e))}function D(e){return`/images/${e.id}.jpg`}let v=[],f="coffee",b=4;const q=Q(".tab"),$=u("#product-list"),H=u("#load-more"),j=document.getElementById("cartBtn"),z=document.getElementById("cartCount");W();function M(e,t){$.innerHTML="";const n=e.filter(o=>o.category===t),i=window.innerWidth<=768;(i?n.slice(0,b):n).forEach(o=>{const s=document.createElement("div");s.className="product-card";const c=(()=>{const a=Number(o.price).toFixed(2),m=o.discountPrice?Number(o.discountPrice).toFixed(2):null;return y()&&m?`<span class="price-old">$${a}</span> <span class="price-new">$${m}</span>`:`$${a}`})();s.innerHTML=`
      <div class="product-inner">
        <img
          src="${D(o)}"
          alt="${o.name}"
          class="product-img"
          draggable="false"
        />
        <div class="product-info">
          <div>
            <h3>${o.name}</h3>
            <p>${o.description}</p>
          </div>
          <span class="price">${c}</span>
        </div>
      </div>
    `,$.appendChild(s)}),i&&b<n.length?H.style.display="block":H.style.display="none"}(async()=>{try{const{data:e}=await R();v=e,M(v,f),Y(),q.forEach(t=>{t.addEventListener("click",()=>{q.forEach(n=>n.classList.remove("active")),t.classList.add("active"),t.classList.contains("coffee")&&(f="coffee"),t.classList.contains("tea")&&(f="tea"),t.classList.contains("dessert")&&(f="dessert"),b=4,M(v,f)})})}catch(e){N.innerHTML=`
     <div style="
    width:95%;
    text-align:center;
    color:#ff3b30;
    font-weight:600;
   
  ">
    Something went wrong. Please, refresh the page
  </div>
`,console.error(e)}})();H.addEventListener("click",()=>{b+=4,M(v,f)});window.addEventListener("resize",()=>M(v,f));const x=document.getElementById("burger"),k=document.getElementById("burger-icon"),l=document.getElementById("mobile-menu"),X=document.getElementById("mobile-backdrop"),Z=document.getElementById("mobile-close"),_=document.getElementById("mobile-sheet");function ee(){l instanceof HTMLElement&&(l.classList.add("is-open"),x?.setAttribute("aria-expanded","true"),k instanceof HTMLImageElement&&(k.src="./assets/header/State=active.png"),document.body.classList.add("no-scroll"))}function L(){l instanceof HTMLElement&&(l.classList.remove("is-open"),x?.setAttribute("aria-expanded","false"),k instanceof HTMLImageElement&&(k.src="./assets/header/State=default.png"),document.body.classList.remove("no-scroll"))}x&&x.addEventListener("click",()=>{l instanceof HTMLElement&&(l.classList.contains("is-open")?L():ee())});X?.addEventListener("click",L);Z?.addEventListener("click",L);document.addEventListener("keydown",e=>{e.key==="Escape"&&l instanceof HTMLElement&&l.classList.contains("is-open")&&L()});_?.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLElement))return;const n=t.closest("a");if(!(n instanceof HTMLAnchorElement))return;const i=n.getAttribute("href")??"",r=i.startsWith("#");if(L(),r){e.preventDefault();const o=i.slice(1),s=document.getElementById(o);if(!s)return;const c=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h"))||0,a=s.getBoundingClientRect().top+window.scrollY-c-8;window.scrollTo({top:a,behavior:"smooth"})}});window.addEventListener("resize",()=>{window.innerWidth>768&&l instanceof HTMLElement&&l.classList.contains("is-open")&&L()});const d=u("#product-modal"),E=u("#modal-img"),I=u("#modal-title"),S=u("#modal-desc"),T=u("#modal-price"),w=u("#addsGroup"),h=u("#sizesGroup");function te(){I.textContent="",S.textContent="",h.innerHTML=`
    <div class="loader">
      <svg xmlns="http:
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="loader-icon">
        <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/>
        <path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/>
        <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
        <path d="m4.9 4.9 2.9 2.9"/>
      </svg>
    </div>`,w.innerHTML="",T.textContent=""}function G(e,t){const n=e?Number(e):0,i=t?Number(t):NaN;return y()&&!Number.isNaN(i)?`${n.toFixed(2)} → ${i.toFixed(2)}`:`$${n.toFixed(2)}`}function ne(e,t){return e.length!==t.length?!1:[...e].sort().join("|")===[...t].sort().join("|")}function se(e){const t=localStorage.getItem("cart"),n=t?JSON.parse(t):[],i=n.findIndex(r=>r.productId===e.productId&&r.sizeKey===e.sizeKey&&ne(r.additives,e.additives)&&r.unitFinalCents===e.unitFinalCents&&r.unitBaseCents===e.unitBaseCents);i>=0?n[i].count+=e.count:n.push(e),localStorage.setItem("cart",JSON.stringify(n))}function ie(e,t){d.classList.add("is-open"),document.body.classList.add("body--lock"),d.setAttribute("aria-hidden","false"),E.src=t,E.alt="",I.textContent="",S.textContent="",te(),J(e).then(({data:n})=>{E.alt=n.name,I.textContent=n.name,S.textContent=n.description??"";const i=["s","m","l"],r=i.find(s=>n.sizes[s]);h.innerHTML=i.map((s,c)=>{const a=n.sizes[s];if(!a)return`
            <label class="seg-item" title="Not available">
              <input type="radio" name="size" value="${s.toUpperCase()}" disabled>
              <span class="seg-content">
                <img src="./assets/menu/modal-icons/sizes/${s}.png" alt="${s}" width="30" height="30">
                <span>${s.toUpperCase()}</span>
              </span>
            </label>`;const m=(r?s===r:c===0)?"checked":"",g=m?"is-active":"",p=G(a.price,a.discountPrice??void 0);return`
          <label class="seg-item ${g}" title="${p}">
            <input type="radio" name="size" value="${s.toUpperCase()}"
                   data-price="${a.price}" data-discount="${a.discountPrice??""}" ${m}>
            <span class="seg-content">
              <img src="./assets/menu/modal-icons/sizes/${s}.png" alt="${s}" width="30" height="30">
              <span>${a.size}</span>
            </span>
          </label>`}).join(""),w.innerHTML=(n.additives??[]).map((s,c)=>`
          <label class="seg-item" title="${G(s.price,s.discountPrice??void 0)}">
            <input type="checkbox" data-price="${s.price}" data-discount="${s.discountPrice??""}" value="${s.name}">
            <span class="seg-content">
              <img src="./assets/menu/modal-icons/sizes/${c+1}.png" alt="${c+1}" width="30" height="30">
              <span>${s.name}</span>
            </span>
          </label>`).join(""),C(),h.addEventListener("change",s=>{const c=s.target;c&&c.name==="size"&&(h.querySelectorAll(".seg-item").forEach(a=>a.classList.remove("is-active")),c.closest(".seg-item")?.classList.add("is-active"),C())}),w.addEventListener("change",()=>{C()});const o=document.getElementById("addToCart")??d.querySelector(".pm-add");o&&(o.onclick=()=>{const s=d.querySelector('input[name="size"]:checked');if(!s)return;const c=s.value.toLowerCase(),a=h.querySelector(".is-active .seg-content span:last-child")?.textContent||c.toUpperCase(),m=Array.from(d.querySelectorAll('#addsGroup input[type="checkbox"]:checked')).map(B=>B.value),{baseCents:g,finalCents:p}=K();se({productId:n.id,name:n.name,category:n.category,img:E.src,sizeKey:c,sizeLabel:a,additives:m,unitBaseCents:g,unitFinalCents:p,count:1}),P()})}).catch(()=>{const n=d.querySelector(".modal-info");n&&(n.innerHTML=`
      <div style="
        width:95%;
        margin: 12px auto;
        text-align:center;
        color:#ff3b30;
        font-weight:600;
        font-size: 15px;
      ">
        Something went wrong. Please, refresh the page
      </div>
    `),h.innerHTML="",w.innerHTML="",T.textContent=""})}function P(){W(),document.activeElement instanceof HTMLElement&&d.contains(document.activeElement)&&document.activeElement.blur(),d.classList.remove("is-open"),document.body.classList.remove("body--lock"),d.setAttribute("aria-hidden","true")}$.addEventListener("click",e=>{const t=e.target;if(!t)return;const n=t.closest(".product-card");if(!n)return;const i=Array.from($.children).indexOf(n),r=v.filter(c=>c.category===f),o=window.innerWidth<=768?r.slice(0,b)[i]:r[i];if(!o)return;const s=D(o);ie(o.id,s)});d.addEventListener("change",e=>{const t=e.target;if(t){if(t.name==="size"&&(h.querySelectorAll(".seg-item").forEach(n=>n.classList.remove("is-active")),t.closest(".seg-item")?.classList.add("is-active")),t.type==="checkbox"&&t.closest("#addsGroup")){const n=t.closest(".seg-item");n&&(t.checked?n.classList.add("is-active"):n.classList.remove("is-active"))}C()}});d.addEventListener("click",e=>{const t=e.target;t&&t.hasAttribute("data-close")&&P()});window.addEventListener("keydown",e=>{e.key==="Escape"&&d.classList.contains("is-open")&&P()});function oe(){if(!j)return;const e=y(),t=U()>0;j.style.display=e||t?"inline-flex":"none"}function W(){if(!z)return;const e=U();z.textContent=String(e),z.hidden=e===0,oe()}function K(){const e=y(),t=d.querySelector('input[name="size"]:checked'),n=Number(t?.dataset.price??0),i=t?.dataset.discount,r=e&&i?Number(i):n,o=Array.from(d.querySelectorAll('#addsGroup input[type="checkbox"]:checked')),s=o.reduce((g,p)=>g+Number(p.dataset.price??0),0),c=o.reduce((g,p)=>{const B=Number(p.dataset.price??0),F=p.dataset.discount,O=e&&F?Number(F):B;return g+O},0),a=n+s,m=r+c;return{baseCents:Math.round(a*100),finalCents:Math.round(m*100)}}function C(){const{baseCents:e,finalCents:t}=K(),n=(e/100).toFixed(2),i=(t/100).toFixed(2);y()&&t<e?T.innerHTML=`<span class="price-new">$${i}</span> <span class="price-old">$${n}</span>`:T.innerHTML=`$${i}`}
