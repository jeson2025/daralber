// ====== إعدادات الحملة ======
const CAMPAIGN = {
  goalAED: 4754000,         // هدف الحملة
  raisedAED: 4123938,       // تم جمع
  lastUpdated: "2026-01-11",

  // رابط الدفع
  paymentLink: "https://jeson2025.github.io/form-site/index.html"
};

// ====== أدوات مساعدة ======
const fmt = (n) => new Intl.NumberFormat("ar-AE").format(n);

function setText(id, text){
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function copyToClipboard(text){
  return navigator.clipboard.writeText(text);
}

function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.bottom = "18px";
  t.style.left = "18px";
  t.style.right = "18px";
  t.style.padding = "12px 14px";
  t.style.borderRadius = "14px";
  t.style.background = "rgba(0,0,0,.55)";
  t.style.border = "1px solid rgba(255,255,255,.14)";
  t.style.backdropFilter = "blur(10px)";
  t.style.color = "#fff";
  t.style.fontWeight = "800";
  t.style.zIndex = "9999";
  t.style.maxWidth = "560px";
  t.style.marginInline = "auto";
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

// ====== تهيئة بيانات التقدم ======
const goal = CAMPAIGN.goalAED;
const raised = CAMPAIGN.raisedAED;
const remaining = Math.max(goal - raised, 0);
const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

setText("goalText", `${fmt(goal)} AED`);
setText("raisedText", `${fmt(raised)} AED`);
setText("remainingText", `${fmt(remaining)} AED`);
setText("pctText", `${pct.toFixed(2)}%`);
setText("updatedText", CAMPAIGN.lastUpdated);

const bar = document.getElementById("progressBar");
if (bar) bar.style.width = ${pct}%;

// رابط الدفع
const payLink = document.getElementById("payLink");
if (payLink) payLink.href = CAMPAIGN.paymentLink;

// ====== تفاعل التبرع ======
const amountInput = document.getElementById("amountInput");

function normalizeAmount(v){
  // خليها أرقام فقط
  const onlyDigits = (v || "").toString().replace(/[^\d]/g, "");
  return onlyDigits;
}

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    const a = btn.getAttribute("data-amount");
    if (amountInput) amountInput.value = a;
  });
});

amountInput?.addEventListener("input", () => {
  amountInput.value = normalizeAmount(amountInput.value);
});

document.getElementById("copyAmountBtn")?.addEventListener("click", async () => {
  const val = normalizeAmount(amountInput?.value || "");
  if (!val) return toast("اكتب مبلغ التبرع أولاً");
  await copyToClipboard(val);
  toast("تم نسخ مبلغ التبرع");
});

document.getElementById("donateNowBtn")?.addEventListener("click", () => {
  // يوديه مباشرة لرابط الدفع المطلوب
  window.location.href = CAMPAIGN.paymentLink;
});

// ====== مشاركة/نسخ ======
async function copyLink(){
  await copyToClipboard(location.href);
  toast("تم نسخ رابط الصفحة");
}

document.getElementById("copyLinkBtn")?.addEventListener("click", copyLink);
document.getElementById("copyLinkBtn2")?.addEventListener("click", copyLink);

document.getElementById("copyMsgBtn")?.addEventListener("click", async () => {
  const msg =
`حملة دار البر — تبرع لبناء مسجد في إمارة عجمان
ساهم بالأجر وشارك الرابط:
${location.href}`;
  await copyToClipboard(msg);
  toast("تم نسخ الرسالة");
});

document.getElementById("shareBtn")?.addEventListener("click", async () => {
  const shareData = {
    title: "حملة دار البر",
    text: "حملة دار البر — تبرع لبناء مسجد في إمارة عجمان",
    url: location.href
  };

  if (navigator.share) {
    try { await navigator.share(shareData); }
    catch { /* تجاهل */ }
  } else {
    await copyLink();
  }
});
