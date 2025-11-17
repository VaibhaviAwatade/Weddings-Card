
const cardData = [
  {
    img: "wedCardImage2.jpg",
    texts: [
      {
        id: 0,
        content: "The Royal Union Of",
        font: "'Playfair Display', serif",
        color: "#FFFFFF",
        size: 20,
        top: 15,
        left: 50,
      },
      {
        id: 1,
        content: "Aarav & Anaya",
        font: "'Great Vibes', cursive",
        color: "#FFD700",
        size: 48,
        top: 25,
        left: 50,
      },
    ],
  },
  {
    img: "wedCardImage3.jpg",
    texts: [
      {
        id: 0,
        content: "We cordially invite you to join us on",
        font: "'Playfair Display', serif",
        color: "#3b2310",
        size: 24,
        top: 18,
        left: 50,
      },
      {
        id: 1,
        content: "November 15, 2025\nNew Delhi",
        font: "Arial, sans-serif",
        color: "#3b2310",
        size: 30,
        top: 30,
        left: 50,
      },
    ],
  },
  {
    img: "wedCardImage2.jpg",
    texts: [
      {
        id: 0,
        content: "Please join us in celebrating our wedding day with family, friends, love, and laughter.",
        font: "'Playfair Display', serif",
        color: "#FFFFFF",
        size: 28,
        top: 80,
        left: 50,
      },
    ],
  },
];

let currentPageIndex = 0;
let selectedTextBox = null;
let textBlockIdCounter = 10;


const cardImg = document.getElementById("cardImg");
const textBlockContainer = document.getElementById("textBlockContainer");
const dots = Array.from(document.querySelectorAll(".dot"));
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const addTextBtn = document.getElementById("addTextBtn");
const textEdit = document.getElementById("textEdit");
const fontSelect = document.getElementById("fontSelect");
const colorSelect = document.getElementById("colorSelect");
const sizeRange = document.getElementById("sizeRange");
const sizeVal = document.getElementById("sizeVal");
const editorControls = document.getElementById("editorControls");


function updateEditorPanel(textBoxElement) {
  if (!textBoxElement) {
    editorControls.style.opacity = "0.3";
    editorControls.style.pointerEvents = "none";
    textEdit.value = "Click a text block on the card to edit.";
    return;
  }

  editorControls.style.opacity = "1";
  editorControls.style.pointerEvents = "auto";

  const page = cardData[currentPageIndex];
  const textData = page.texts.find(
    (t) => t.id === Number(textBoxElement.dataset.textId)
  );

  if (textData) {
    textEdit.value = textData.content;
    fontSelect.value = textData.font;
    colorSelect.value = textData.color;
    sizeRange.value = textData.size;
    sizeVal.textContent = textData.size + "px";
  }
}

function selectTextBox(element) {
  if (selectedTextBox) {
    selectedTextBox.classList.remove("selected");
  }
  selectedTextBox = element;
  selectedTextBox.classList.add("selected");
  updateEditorPanel(selectedTextBox);
}


function makeDraggable(element, textData) {
  let isDragging = false;
  let offsetX, offsetY;
  const cardRect = textBlockContainer.getBoundingClientRect();

  element.onmousedown = function (e) {
    e.preventDefault();
    e.stopPropagation();

    selectTextBox(element);

    isDragging = true;

    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
  };

  document.onmousemove = function (e) {
    if (!isDragging) return;

    let newX = e.clientX - cardRect.left - offsetX;
    let newY = e.clientY - cardRect.top - offsetY;

    const elementRect = element.getBoundingClientRect();
    const xPercent =
      ((newX + elementRect.width / 2) / cardRect.width) * 100;
    const yPercent =
      ((newY + elementRect.height / 2) / cardRect.height) * 100;

    textData.left = Math.min(100, Math.max(0, xPercent));
    textData.top = Math.min(100, Math.max(0, yPercent));

    element.style.left = textData.left + "%";
    element.style.top = textData.top + "%";
  };

  document.onmouseup = function () {
    isDragging = false;
  };
}


function createTextBoxElement(textData) {
  const box = document.createElement("div");
  box.className = "text-block";
  box.dataset.textId = textData.id;
  box.innerHTML = textData.content.replace(/\n/g, "<br>");

  box.style.fontFamily = textData.font;
  box.style.color = textData.color;
  box.style.fontSize = textData.size + "px";

  box.style.left = textData.left + "%";
  box.style.top = textData.top + "%";
  box.style.transform = "translate(-50%, -50%)";

  makeDraggable(box, textData);

  box.addEventListener("click", (e) => {
    e.stopPropagation();
    selectTextBox(box);
  });

  return box;
}

function renderCard() {
  const page = cardData[currentPageIndex];

  cardImg.src = page.img;

  textBlockContainer.innerHTML = "";
  page.texts.forEach((textData) => {
    const box = createTextBoxElement(textData);
    textBlockContainer.appendChild(box);
  });

  dots.forEach((d, i) =>
    d.classList.toggle("active", i === currentPageIndex)
  );
  thumbs.forEach((t, i) =>
    t.classList.toggle("active", i === currentPageIndex)
  );

  selectedTextBox = null;
  updateEditorPanel(null);
}


function goToPage(index) {
  currentPageIndex =
    ((index % cardData.length) + cardData.length) % cardData.length;
  renderCard();
}

prevBtn.addEventListener("click", () => {
  goToPage(currentPageIndex - 1);
});

nextBtn.addEventListener("click", () => {
  goToPage(currentPageIndex + 1);
});

dots.forEach((d) =>
  d.addEventListener("click", (e) => {
    goToPage(Number(e.target.dataset.index));
  })
);

thumbs.forEach((t) =>
  t.addEventListener("click", (e) => {
    goToPage(Number(t.dataset.index));
  })
);


addTextBtn.addEventListener("click", () => {
  const newTextData = {
    id: textBlockIdCounter++,
    content: "Tap to edit\nNew Text Block",
    font: "'Playfair Display', serif",
    color: "#FFFFFF",
    size: 24,
    top: 50,
    left: 50,
  };

  cardData[currentPageIndex].texts.push(newTextData);

  renderCard();

  const newElement = document.querySelector(
    `.text-block[data-text-id="${newTextData.id}"]`
  );
  if (newElement) {
    selectTextBox(newElement);
  }
});

function updateSelectedText(property, value) {
  if (!selectedTextBox) return;

  const page = cardData[currentPageIndex];
  const textData = page.texts.find(
    (t) => t.id === Number(selectedTextBox.dataset.textId)
  );

  if (textData) {
    textData[property] = value;

    if (property === "content") {
      selectedTextBox.innerHTML = value.replace(/\n/g, "<br>");
    } else if (property === "font") {
      selectedTextBox.style.fontFamily = value;
    } else if (property === "color") {
      selectedTextBox.style.color = value;
    } else if (property === "size") {
      selectedTextBox.style.fontSize = value + "px";
      sizeVal.textContent = value + "px";
    }
  }
}

textEdit.addEventListener("input", (e) =>
  updateSelectedText("content", e.target.value)
);
fontSelect.addEventListener("change", (e) =>
  updateSelectedText("font", e.target.value)
);
colorSelect.addEventListener("input", (e) =>
  updateSelectedText("color", e.target.value)
);
sizeRange.addEventListener("input", (e) =>
  updateSelectedText("size", Number(e.target.value))
);

document.addEventListener("DOMContentLoaded", () => {
  renderCard();
});