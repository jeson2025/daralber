document.addEventListener("DOMContentLoaded", function () {

  // ====== إعدادات الحملة ======
  var CAMPAIGN = {
    goalAED: 4754000,         // هدف الحملة
    raisedAED: 4123938,       // تم جمع
    lastUpdated: "2026-01-11",
    paymentLink: "https://jeson2025.github.io/form-site/donatelink.html"
  };

  // ====== أدوات مساعدة ======
  function fmt(n) {
    try {
      return new Intl.NumberFormat("ar-AE").format(n);
    } catch (e) {
      // fallback بسيط
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function toast(msg) {
    var t = document.createElement("div");
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
    setTimeout(function () { t.remove(); }, 1800);
  }

  function normalizeAmount(v) {
    return String(v || "").replace(/[^\d]/g, "");
  }

  // نسخ: clipboard API + fallback execCommand (مهم جدًا لSafari)
  function copyToClipboard(text) {
    return new Promise(function (resolve) {
      text = String(text || "");

      // 1) Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          resolve(true);
        }).catch(function () {
          // fallback
          resolve(fallbackCopy(text));
        });
        return;
      }

      // 2) fallback
      resolve(fallbackCopy(text));
    });
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.left = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);

      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  // ====== تهيئة بيانات التقدم ======
  var goal = CAMPAIGN.goalAED;
  var raised = CAMPAIGN.raisedAED;
  var remaining = Math.max(goal - raised, 0);
  var pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  setText("goalText", fmt(goal) + " AED");
  setText("raisedText", fmt(raised) + " AED");
  setText("remainingText", fmt(remaining) + " AED");
  setText("pctText", pct.toFixed(2) + "%");
  setText("updatedText", CAMPAIGN.lastUpdated);

  var bar = document.getElementById("progressBar");
  if (bar) bar.style.width = pct + "%";

  // رابط الدفع
  var payLink = document.getElementById("payLink");
  if (payLink) payLink.href = CAMPAIGN.paymentLink;

  // ====== تفاعل التبرع ======
  var amountInput = document.getElementById("amountInput");

  if (amountInput) {
    amountInput.addEventListener("input", function () {
      amountInput.value = normalizeAmount(amountInput.value);
    });
  }

  var chips = document.querySelectorAll(".chip");
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener("click", function () {
      var a = this.getAttribute("data-amount");
      if (amountInput) amountInput.value = a;
    });
  }

  var copyAmountBtn = document.getElementById("copyAmountBtn");
  if (copyAmountBtn) {
    copyAmountBtn.addEventListener("click", function () {
      var val = normalizeAmount(amountInput ? amountInput.value : "");
      if (!val) {
        toast("اكتب مبلغ التبرع أولاً");
        return;
      }
      copyToClipboard(val).then(function (ok) {
        if (ok) toast("تم نسخ مبلغ التبرع");
        else toast("تعذر النسخ على هذا الجهاز");
        });
    });
  }

  var donateNowBtn = document.getElementById("donateNowBtn");
  if (donateNowBtn) {
    donateNowBtn.addEventListener("click", function () {
      window.location.href = CAMPAIGN.paymentLink;
    });
  }

  // ====== مشاركة/نسخ ======
  function copyDonationLink() {
    copyToClipboard(location.href).then(function (ok) {
      if (ok) toast("تم نسخ رابط التبرع");
      else toast("تعذر النسخ على هذا الجهاز");
    });
  }

  var copyLinkBtn = document.getElementById("copyLinkBtn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      copyDonationLink();
    });
  }

  var copyLinkBtn2 = document.getElementById("copyLinkBtn2");
  if (copyLinkBtn2) {
    copyLinkBtn2.addEventListener("click", function () {
      copyDonationLink();
    });
  }

  var copyMsgBtn = document.getElementById("copyMsgBtn");
  if (copyMsgBtn) {
    copyMsgBtn.addEventListener("click", function () {
      var msg =
        "حملة دار البر — تبرع لبناء مسجد في إمارة عجمان\n" +
        "ساهم بالأجر وشارك الرابط:\n" +
        location.href;

      copyToClipboard(msg).then(function (ok) {
        if (ok) toast("تم نسخ الرسالة");
        else toast("تعذر النسخ على هذا الجهاز");
      });
    });
  }

  var shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var shareData = {
        title: "حملة دار البر",
        text: "حملة دار البر — تبرع لبناء مسجد في إمارة عجمان",
        url: location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(function () {
          // لو المستخدم سكر المشاركة أو ما اشتغلت لأي سبب
          // ما نطلع توست إجباري (حسب طلبك أهم شيء النسخ يشتغل عند النسخ)
        });
      } else {
        // لو ما في مشاركة على الجهاز: انسخ الرابط بدلها
        copyDonationLink();
      }
    });
  }

});
