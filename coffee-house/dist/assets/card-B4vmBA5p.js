import{g as w,i as f,d as $}from"./api-CuwP49r_.js";const I=document.getElementById("cartBtn"),h=document.getElementById("cartCount");function x(){if(!I)return;const e=f(),t=w()>0;I.style.display=e||t?"inline-flex":"block"}function M(){if(!h)return;const e=w();h.textContent=String(e),h.hidden=e===0,x()}M();const v="cart";function E(){try{return JSON.parse(localStorage.getItem(v)||"[]")}catch{return[]}}function H(e){localStorage.setItem(v,JSON.stringify(e));const t=document.getElementById("cartCount");if(t){const n=e.reduce((o,r)=>o+(r.count??0),0);t.textContent=String(n),t.hidden=n===0}}function S(e){const t=E();t[e]&&(t.splice(e,1),H(t))}function l(e){return`$${(e/100).toFixed(2)}`}function k(e,t,n){return n&&t<e?`<span class="price-old">${l(e)}</span>
            <span class="price-new">${l(t)}</span>`:`${l(t)}`}const m=document.getElementById("cartList"),N=document.getElementById("cartTotal"),u=document.getElementById("cartActions"),C=document.getElementById("cart-summary");function p(){const e=E();if(m.innerHTML="",e.length===0)m.innerHTML='<div class="cart-empty" style="padding:24px 0;text-align:center;opacity:.7"></div>';else{const r=f();e.forEach((s,a)=>{const i=document.createElement("div");i.className="cart-item";const y=[s.sizeLabel||"",s.additives?.length?s.additives.join(", "):null].filter(Boolean).join(", "),B=s.unitBaseCents*(s.count||1),T=s.unitFinalCents*(s.count||1);i.innerHTML=`
        <button class="trash" aria-label="Remove" data-i="${a}">
          <img src="./assets/card/trash.svg" alt="Remove" width="24" height="24">
        </button>

        <img class="thumb" src="${s.img}" alt="" width="100" height="100" />

        <div class="infoItem">
          <div class="title">${s.name}</div>
          <div>
            <div class="sub">${y}</div>
            ${s.count>1?`<div class="qty">x${s.count}</div>`:""}
          </div>
        </div>

        <div class="price">
          ${k(B,T,r)}
        </div>
      `,m.appendChild(i)}),m.addEventListener("click",s=>{const a=s.target.closest(".trash");if(!a)return;const i=Number(a.dataset.i||-1);i>=0&&(S(i),p())},{once:!0})}const t=f(),n=e.reduce((r,s)=>(r.base+=s.unitBaseCents*(s.count||1),r.final+=s.unitFinalCents*(s.count||1),r),{base:0,final:0}),o=t&&n.final<n.base;N.innerHTML=o?`<span class="price-old">${l(n.base)}</span>
       <span class="price-new">${l(n.final)}</span>`:l(n.final),A(e.length>0)}function O(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}function A(e){const t=f();function n(){try{const r=localStorage.getItem("userProfile");return r?JSON.parse(r):null}catch{return null}}const o=n();if(t&&o?C.innerHTML=`
      <div class="cart-summary">
        <span class="label">Address:</span>
        <span class="value">${o.city}, ${o.street}, ${o.houseNumber}</span>
      </div>
      <div class="cart-summary">
        <span class="label">Pay by:</span>
        <span class="value">${O(o.paymentMethod)}</span>
      </div>`:C.innerHTML="",u.innerHTML="",!t){u.innerHTML=`
      <div class="auth-actions">
        <a class="btn" href="./signin.html">Sign In</a>
        <a class="btn" href="./register.html">Registration</a>
      </div>`;return}e?(u.innerHTML='<button id="confirmOrder" class="auth-actions btn">Confirm order</button>',document.getElementById("confirmOrder")?.addEventListener("click",D)):u.innerHTML=""}async function D(){J();const e=document.getElementById("confirmOrder");e&&(e.disabled=!0,e.textContent="Processing…");try{const t=E();if(t.length===0){b("Your cart is empty."),e&&(e.disabled=!1,e.textContent="Confirm order");return}const n={items:t.map(i=>({productId:i.productId,size:i.sizeKey,additives:i.additives||[],quantity:i.count||1})),totalPrice:Y(t)},o=await $(n);localStorage.removeItem("cart"),p();const r=o?.data?.message??"Order confirmed",s=o?.data?.orderId??null;let a=r;s&&(a+=`
Order ID: ${s}`),b(a,"success")}catch(t){const n=t instanceof Error&&t.message?t.message:"Something went wrong. Please, try again";b(n,"error")}finally{e&&(e.disabled=!1,e.textContent="Confirm order")}}p();window.addEventListener("storage",e=>{e.key===v&&p()});const L=document.getElementById("burger"),g=document.getElementById("burger-icon"),c=document.getElementById("mobile-menu"),F=document.getElementById("mobile-backdrop"),P=document.getElementById("mobile-close"),z=document.getElementById("mobile-sheet");function R(){if(!c)throw new Error("#mobile-menu not found");c.classList.add("is-open"),L?.setAttribute("aria-expanded","true"),g instanceof HTMLImageElement&&(g.src="./assets/header/State=active.png"),document.body.classList.add("no-scroll")}function d(){if(!c)throw new Error("#mobile-menu not found");c.classList.remove("is-open"),L?.setAttribute("aria-expanded","false"),g instanceof HTMLImageElement&&(g.src="./assets/header/State=default.png"),document.body.classList.remove("no-scroll")}if(!c)throw new Error("#mobile-menu not found");L?.addEventListener("click",()=>{c.classList.contains("is-open")?d():R()});F?.addEventListener("click",d);P?.addEventListener("click",d);document.addEventListener("keydown",e=>{e.key==="Escape"&&c.classList.contains("is-open")&&d()});z?.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLElement))return;const n=t.closest("a");if(!(n instanceof HTMLAnchorElement))return;const o=n.getAttribute("href")??"",r=o.startsWith("#");if(d(),r){e.preventDefault();const s=o.slice(1),a=document.getElementById(s);if(!a)return;const i=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h"))||0,y=a.getBoundingClientRect().top+window.scrollY-i-8;window.scrollTo({top:y,behavior:"smooth"})}});window.addEventListener("resize",()=>{window.innerWidth>768&&c.classList.contains("is-open")&&d()});function b(e,t="error"){let n=document.getElementById("cartNotice");n||(n=document.createElement("div"),n.id="cartNotice",n.style.cssText="width:100%;text-align:center;margin:12px 0;font-weight:600;",u.parentElement?.prepend(n)),n.style.color=t==="error"?"#ff3b30":"#2ecc71",n.textContent=e}function J(){const e=document.getElementById("cartNotice");e?.parentElement&&e.parentElement.removeChild(e)}function Y(e){return+(e.reduce((n,o)=>n+(o.unitFinalCents??o.unitBaseCents)*(o.count||1),0)/100).toFixed(2)}
