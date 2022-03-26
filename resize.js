var paragraphs = document.querySelectorAll("p");

for (let i = 0; i < paragraphs.length; i++) {
  let table = document.createElement("table");
  let tr = table.appendChild(document.createElement("tr"));
  for (let j = 0; j < 3; j++) tr.appendChild(document.createElement("th"));
  tr = table.appendChild(document.createElement("tr"));
  let td1 = tr.appendChild(document.createElement("td"));
  let td2 = tr.appendChild(document.createElement("td"));
  let td3 = tr.appendChild(document.createElement("td"));
  td1.setAttribute("style", "width:15%");
  td2.setAttribute("style", "width:70%");
  td3.setAttribute("style", "width:15%");
  let clone = paragraphs[i].cloneNode([true]);
  let parent = paragraphs[i].parentNode;
  td2.appendChild(clone);
  parent.replaceChild(table, paragraphs[i]);
}
