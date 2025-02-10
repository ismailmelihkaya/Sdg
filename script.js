const PUZZLE_ROWS = 3;
const PUZZLE_COLS = 3;
const PUZZLE_SIZE = 100; // Her bir parçanın boyutu (px)
const imagePath = "images/mor_derin_bakan_kadin.jpg"; // Hanımefendinin çizimi

const puzzleContainer = document.getElementById("puzzle-container");
const message = document.getElementById("message");

let pieces = []; // Puzzle parçalarını saklamak için dizi
let draggedPiece = null; // Sürüklenen parçayı saklamak için

// Puzzle parçalarını oluştur
function createPuzzle() {
    for (let row = 0; row < PUZZLE_ROWS; row++) {
        for (let col = 0; col < PUZZLE_COLS; col++) {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.backgroundImage = `url('${imagePath}')`;
            piece.style.backgroundPosition = `-${col * PUZZLE_SIZE}px -${row * PUZZLE_SIZE}px`;
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.draggable = true; // Sürüklenebilir yap

            // Sürükle-bırak olaylarını ekle
            piece.addEventListener("dragstart", dragStart);
            piece.addEventListener("dragover", dragOver);
            piece.addEventListener("drop", drop);
            piece.addEventListener("dragend", dragEnd);

            pieces.push(piece);
        }
    }
    shufflePieces();
    renderPuzzle();
}

// Puzzle parçalarını karıştır
function shufflePieces() {
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
}

// Puzzle parçalarını ekrana yerleştir
function renderPuzzle() {
    puzzleContainer.innerHTML = "";
    pieces.forEach(piece => puzzleContainer.appendChild(piece));
}

// Sürükleme başladığında
function dragStart(event) {
    draggedPiece = event.target;
    event.dataTransfer.setData("text/plain", ""); // Bazı tarayıcılar için gerekli
    setTimeout(() => {
        event.target.classList.add("hidden"); // Sürüklenen parçayı gizle
    }, 0);
}

// Sürüklenen parça üzerine gelindiğinde
function dragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("hovered"); // Hedef parçayı vurgula
}

// Parça bırakıldığında
function drop(event) {
    event.preventDefault();
    const targetPiece = event.currentTarget;

    // Sürüklenen parça ile hedef parçanın yerini değiştir
    if (targetPiece.classList.contains("puzzle-piece")) {
        swapPieces(draggedPiece, targetPiece);
        if (isPuzzleSolved()) {
            showMessage();
        }
    }
}

// Sürükleme bittiğinde
function dragEnd(event) {
    event.target.classList.remove("hidden"); // Sürüklenen parçayı tekrar göster
    event.target.classList.remove("hovered"); // Vurgulamayı kaldır
}

// İki parçanın yerini değiştir
function swapPieces(piece1, piece2) {
    // Background image'leri değiştir
    const tempBackground = piece1.style.backgroundImage;
    piece1.style.backgroundImage = piece2.style.backgroundImage;
    piece2.style.backgroundImage = tempBackground;

    // Dataset değerlerini değiştir
    const tempRow = piece1.dataset.row;
    const tempCol = piece1.dataset.col;
    piece1.dataset.row = piece2.dataset.row;
    piece1.dataset.col = piece2.dataset.col;
    piece2.dataset.row = tempRow;
    piece2.dataset.col = tempCol;
}

// Puzzle tamamlandı mı kontrol et
function isPuzzleSolved() {
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const expectedRow = Math.floor(i / PUZZLE_COLS);
        const expectedCol = i % PUZZLE_COLS;
        if (
            parseInt(piece.dataset.row) !== expectedRow ||
            parseInt(piece.dataset.col) !== expectedCol
        ) {
            return false;
        }
    }
    return true;
}

// Doğum günü mesajını göster
function showMessage() {
    message.classList.remove("hidden");
    message.classList.add("visible");
}

// Oyunu başlat
createPuzzle();