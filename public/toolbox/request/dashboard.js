// 見える化。閲覧トークンはこのタブの間だけ sessionStorage に置く。

const KEY = "request-box-token";
const message = document.getElementById("message");
const auth = document.getElementById("auth");
const content = document.getElementById("content");
const tokenInput = document.getElementById("token");

const show = (kind, text) => {
  message.className = `notice ${kind}`;
  message.textContent = text;
  message.hidden = false;
};

const STATUS_LABEL = { open: "未対応", published: "掲載ずみ", declined: "見送り" };
const date = (value) =>
  new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "short" })
    .format(new Date(value));

const cell = (row, text, className) => {
  const td = row.insertCell();
  td.textContent = text;
  if (className) td.className = className;
  return td;
};

function paint(data, token) {
  const { summary, records } = data;

  document.getElementById("stats").replaceChildren(
    ...[
      ["届いた総数", summary.total],
      ["未対応", summary.open],
      ["掲載ずみ", summary.published],
      ["見送り", summary.declined],
      [
        "返事までの中央値",
        summary.medianLeadTimeHours === null ? "—" : `${summary.medianLeadTimeHours}時間`,
      ],
    ].map(([label, value]) => {
      const box = document.createElement("div");
      box.className = "stat";
      const strong = document.createElement("b");
      strong.textContent = String(value);
      const span = document.createElement("span");
      span.textContent = label;
      box.append(strong, span);
      return box;
    }),
  );

  const people = document.getElementById("by-requester");
  people.replaceChildren();
  for (const person of summary.byRequester) {
    const row = people.insertRow();
    cell(row, person.name);
    cell(row, String(person.total), "num");
    cell(row, String(person.published), "num");
    cell(
      row,
      person.total ? `${Math.round((person.published / person.total) * 100)}%` : "—",
      "num",
    );
  }

  const months = document.getElementById("by-month");
  months.replaceChildren();
  for (const bucket of summary.byMonth) {
    const row = months.insertRow();
    cell(row, bucket.month);
    cell(row, String(bucket.total), "num");
    cell(row, String(bucket.published), "num");
  }

  const list = document.getElementById("records");
  list.replaceChildren();
  for (const record of records) {
    const row = list.insertRow();
    cell(row, date(record.createdAt));

    const statusCell = row.insertCell();
    const tag = document.createElement("span");
    tag.className = `tag ${record.status}`;
    tag.textContent = STATUS_LABEL[record.status] || record.status;
    statusCell.append(tag);

    cell(row, record.requesterName);

    const product = row.insertCell();
    const productLink = document.createElement("a");
    productLink.href = record.productUrl;
    productLink.target = "_blank";
    productLink.rel = "noopener noreferrer";
    productLink.textContent = record.asin || "商品ページ";
    product.append(productLink);

    const article = row.insertCell();
    if (record.articleUrl) {
      const articleLink = document.createElement("a");
      articleLink.href = record.articleUrl;
      articleLink.target = "_blank";
      articleLink.rel = "noopener noreferrer";
      articleLink.textContent = "開く";
      article.append(articleLink);
    } else {
      article.textContent = "—";
    }

    const action = row.insertCell();
    const open = document.createElement("a");
    open.href = `admin.html#id=${encodeURIComponent(record.id)}&t=${encodeURIComponent(token)}`;
    open.textContent = "対応する";
    action.append(open);
  }

  auth.hidden = true;
  content.hidden = false;
}

async function load(token) {
  let result = null;
  try {
    const response = await fetch("/api/request-box/admin/list", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    result = await response.json().catch(() => null);
    if (!response.ok) throw new Error(result?.error || "読み込めませんでした。");
  } catch (error) {
    sessionStorage.removeItem(KEY);
    show("error", error.message);
    auth.hidden = false;
    content.hidden = true;
    return;
  }
  message.hidden = true;
  sessionStorage.setItem(KEY, token);
  paint(result, token);
}

auth.addEventListener("submit", (event) => {
  event.preventDefault();
  const token = tokenInput.value.trim();
  if (token) load(token);
});

const saved = sessionStorage.getItem(KEY);
if (saved) load(saved);
