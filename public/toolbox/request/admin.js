// 対応画面。認証情報は URL のフラグメント（#）で受け取る。
// フラグメントはサーバーへ送られないため、アクセスログにもRefererにも残らない。

const params = new URLSearchParams(location.hash.slice(1));
const id = params.get("id") || "";
const token = params.get("t") || "";

const message = document.getElementById("message");
const recordBox = document.getElementById("record");
const workflow = document.getElementById("workflow");
const form = document.getElementById("form");
const previewBox = document.getElementById("preview-box");
const buttons = ["preview", "publish", "decline"].map((key) =>
  document.getElementById(key),
);

const show = (kind, text) => {
  message.className = `notice ${kind}`;
  message.textContent = text;
  message.hidden = false;
};
const setBusy = (busy) => buttons.forEach((button) => (button.disabled = busy));

const STATUS_LABEL = { open: "未対応", published: "掲載ずみ", declined: "見送り" };
const jst = (value) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", dateStyle: "medium", timeStyle: "short",
  }).format(new Date(value));

const api = (options = {}) =>
  fetch(`/api/request-box/admin/request?id=${encodeURIComponent(id)}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });

function paint(record) {
  const status = document.getElementById("r-status");
  status.textContent = STATUS_LABEL[record.status] || record.status;
  status.className = `tag ${record.status}`;
  document.getElementById("r-name").textContent = record.requesterName;
  document.getElementById("r-email").textContent = record.requesterEmail;
  const link = document.getElementById("r-url");
  link.textContent = record.productUrl;
  link.href = record.productUrl;
  document.getElementById("r-asin").textContent = record.asin || "（短縮URLのため未特定）";
  document.getElementById("r-note").textContent = record.productNote || "（記載なし）";
  document.getElementById("r-created").textContent = jst(record.createdAt);
  document.getElementById("r-id").textContent = record.id;
  if (record.articleUrl) document.getElementById("articleUrl").value = record.articleUrl;
  if (record.replyMessage) document.getElementById("msg").value = record.replyMessage;

  recordBox.hidden = false;
  workflow.hidden = false;
  form.hidden = false;

  if (record.status !== "open")
    show(
      "info",
      `この件は「${STATUS_LABEL[record.status]}」で記録ずみです（${
        record.repliedAt ? jst(record.repliedAt) : "日時不明"
      }）。内容を直してもう一度送ることもできます。`,
    );
}

async function act(action, preview) {
  setBusy(true);
  previewBox.hidden = true;
  let result = null;
  try {
    const response = await api({
      method: "POST",
      body: JSON.stringify({
        action,
        preview,
        articleUrl: document.getElementById("articleUrl").value,
        message: document.getElementById("msg").value,
      }),
    });
    result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error || "送信できませんでした。");
  } catch (error) {
    show("error", error.message);
    setBusy(false);
    return;
  }

  if (preview) {
    document.getElementById("p-to").textContent =
      document.getElementById("r-email").textContent;
    document.getElementById("p-subject").textContent = result.preview.subject;
    document.getElementById("p-text").textContent = result.preview.text;
    previewBox.hidden = false;
    show("info", "この内容で送られます。問題なければボタンを押してください。");
  } else if (result.local) {
    show("ok", "ローカル確認のため、実際のメールは送っていません。記録だけ更新しました。");
  } else {
    show(
      "ok",
      action === "publish"
        ? "掲載したことを依頼者へ送りました。"
        : "今回は見送ることを依頼者へ送りました。",
    );
  }
  setBusy(false);
}

async function boot() {
  if (!id || !token) {
    show("error", "リンクが不完全です。通知メールのリンクをそのまま開いてください。");
    return;
  }
  let result = null;
  try {
    const response = await api();
    result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error || "読み込めませんでした。");
  } catch (error) {
    show("error", error.message);
    return;
  }
  paint(result.record);
}

document.getElementById("preview").addEventListener("click", () => {
  const action = document.getElementById("articleUrl").value.trim()
    ? "publish"
    : "decline";
  act(action, true);
});
document.getElementById("publish").addEventListener("click", () => act("publish", false));
document.getElementById("decline").addEventListener("click", () => {
  if (confirm("今回は見送ることを依頼者へ送ります。よろしいですか？"))
    act("decline", false);
});

boot();
