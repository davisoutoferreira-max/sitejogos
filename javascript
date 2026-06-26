// ========== UTILITÁRIOS ==========
function getCanvas(id) { return document.getElementById(id); }
function getCtx(id) { const c = getCanvas(id); return c ? c.getContext('2d') : null; }

// ========== JOGO 1: COBRINHA ==========
function initSnake() {
    const canvas = getCanvas('snakeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 20;
    const cols = Math.floor(canvas.width / size);
    const rows = Math.floor(canvas.height / size);

    let snake = [{ x: 8, y: 8 }];
    let direction = { dx: 1, dy: 0 };
    let nextDirection = { dx: 1, dy: 0 };
    let food = { x: 12, y: 8 };
    let gameOver = false;
    let score = 0;
    let gameInterval = null;
    let gameRunning = false;

    function randomFood() {
        const free = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (!snake.some(seg => seg.x === i && seg.y === j)) free.push({ x: i, y: j });
            }
        }
        if (free.length === 0) return null;
        return free[Math.floor(Math.random() * free.length)];
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // grade
        ctx.strokeStyle = '#2b4d5a';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * size);
            ctx.lineTo(canvas.width, i * size);
            ctx.stroke();
        }

        // cobrinha
        snake.forEach((seg, idx) => {
            ctx.fillStyle = idx === 0 ? '#b3e5a0' : '#77b87a';
            ctx.shadowColor = '#b3ffb3';
            ctx.shadowBlur = 8;
            ctx.fillRect(seg.x * size + 1, seg.y * size + 1, size - 2, size - 2);
        });
        ctx.shadowBlur = 0;

        // comida
        ctx.fillStyle = '#ff7b7b';
        ctx.shadowColor = '#ffb3b3';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        document.getElementById('snakeStatus').innerText = gameOver ? '💀 Game Over' : `🐍 ${score}`;
    }

    function move() {
        if (gameOver || !gameRunning) return;
        direction = { ...nextDirection };
        const head = { x: snake[0].x + direction.dx, y: snake[0].y + direction.dy };

        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            gameOver = true;
            stopGame();
            draw();
            return;
        }

        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOver = true;
            stopGame();
            draw();
            return;
        }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            const newFood = randomFood();
            if (newFood) food = newFood;
            else { gameOver = true;
                stopGame();
                draw(); return; }
        } else {
            snake.pop();
        }
        draw();
    }

    function stopGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        gameRunning = false;
    }

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        gameRunning = true;
        gameOver = false;
        gameInterval = setInterval(move, 140);
    }

    function resetSnake() {
        stopGame();
        snake = [{ x: 8, y: 8 }];
        direction = { dx: 1, dy: 0 };
        nextDirection = { dx: 1, dy: 0 };
        score = 0;
        gameOver = false;
        const newFood = randomFood();
        if (newFood) food = newFood;
        draw();
        startGame();
    }

    function keyHandler(e) {
        if (!gameRunning || gameOver) return;
        const key = e.key;
        e.preventDefault();
        if (key === 'ArrowUp' && direction.dy !== 1) nextDirection = { dx: 0, dy: -1 };
        else if (key === 'ArrowDown' && direction.dy !== -1) nextDirection = { dx: 0, dy: 1 };
        else if (key === 'ArrowLeft' && direction.dx !== 1) nextDirection = { dx: -1, dy: 0 };
        else if (key === 'ArrowRight' && direction.dx !== -1) nextDirection = { dx: 1, dy: 0 };
    }

    window.addEventListener('keydown', keyHandler);
    document.getElementById('snakeReset').addEventListener('click', resetSnake);
    resetSnake();
}

// ========== JOGO 2: JOGO DA VELHA ==========
function initTicTacToe() {
    const canvas = getCanvas('tttCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let board = Array(9).fill(null);
    let player = 'X';
    let gameOver = false;
    let winner = null;
    const size = canvas.width / 3;

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#b0d0e0';
        ctx.lineWidth = 3;
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * size);
            ctx.lineTo(canvas.width, i * size);
            ctx.stroke();
        }
        board.forEach((val, idx) => {
            const x = (idx % 3) * size + size / 2;
            const y = Math.floor(idx / 3) * size + size / 2;
            ctx.font = `${size * 0.6}px 'Segoe UI', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (val === 'X') {
                ctx.fillStyle = '#7fc7ff';
                ctx.fillText('X', x, y + 4);
            } else if (val === 'O') {
                ctx.fillStyle = '#ffbe76';
                ctx.fillText('O', x, y + 4);
            }
        });
        const statusEl = document.getElementById('tttStatus');
        if (gameOver) {
            statusEl.innerText = winner ? `🏆 ${winner} venceu!` : '🤝 Empate!';
        } else {
            statusEl.innerText = `Vez de ${player}`;
        }
    }

    function checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (board.every(v => v !== null)) return 'draw';
        return null;
    }

    function handleClick(e) {
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const col = Math.floor(mouseX / size);
        const row = Math.floor(mouseY / size);
        const idx = row * 3 + col;
        if (idx < 0 || idx > 8 || board[idx] !== null) return;
        board[idx] = player;
        const win = checkWinner();
        if (win) {
            gameOver = true;
            if (win !== 'draw') winner = win;
            drawBoard();
            return;
        }
        player = (player === 'X' ? 'O' : 'X');
        drawBoard();
    }

    function resetTTT() {
        board = Array(9).fill(null);
        player = 'X';
        gameOver = false;
        winner = null;
        drawBoard();
    }

    canvas.addEventListener('click', handleClick);
    document.getElementById('tttReset').addEventListener('click', resetTTT);
    resetTTT();
}

// ========== JOGO 3: CAMPO MINADO ==========
function initMinesweeper() {
    const canvas = getCanvas('mineCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rows = 8,
        cols = 8;
    const cellSize = canvas.width / cols;
    let board = [];
    let revealed = [];
    let gameOver = false;
    let firstClick = true;
    let mineCount = 8;

    function initBoard() {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        revealed = Array(rows).fill().map(() => Array(cols).fill(false));
        gameOver = false;
        firstClick = true;
        drawBoard();
        document.getElementById('mineStatus').innerText = '💣 Clique em uma célula';
    }

    function placeMines(excludeRow, excludeCol) {
        let placed = 0;
        while (placed < mineCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            if (board[r][c] === -1 || (r === excludeRow && c === excludeCol)) continue;
            board[r][c] = -1;
            placed++;
        }
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c] === -1) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr,
                            nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === -1) count++;
                    }
                }
                board[r][c] = count;
            }
        }
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * cellSize,
                    y = r * cellSize;
                ctx.fillStyle = revealed[r][c] ? '#2e4f5e' : '#1f3a47';
                ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
                ctx.strokeStyle = '#1d3340';
                ctx.strokeRect(x, y, cellSize, cellSize);
                if (revealed[r][c]) {
                    const val = board[r][c];
                    if (val === -1) {
                        ctx.fillStyle = '#ff5e5e';
                        ctx.font = `${cellSize*0.6}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('💣', x + cellSize / 2, y + cellSize / 2);
                    } else if (val > 0) {
                        ctx.fillStyle = '#d4f0ff';
                        ctx.font = `bold ${cellSize*0.6}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
                    }
                }
            }
        }
        if (gameOver) {
            document.getElementById('mineStatus').innerText = '💀 Game Over!';
        }
    }

    function reveal(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (revealed[r][c]) return;
        revealed[r][c] = true;
        if (board[r][c] === -1) {
            gameOver = true;
            drawBoard();
            return;
        }
        if (board[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++)
                for (let dc = -1; dc <= 1; dc++)
                    if (dr !== 0 || dc !== 0) reveal(r + dr, c + dc);
        }
        drawBoard();
        let total = rows * cols;
        let revealedCount = 0;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                if (revealed[i][j]) revealedCount++;
        if (revealedCount === total - mineCount) {
            gameOver = true;
            document.getElementById('mineStatus').innerText = '🎉 Você venceu!';
        }
    }

    function handleMineClick(e) {
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const c = Math.floor(mx / cellSize);
        const r = Math.floor(my / cellSize);
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if (firstClick) {
            placeMines(r, c);
            firstClick = false;
        }
        reveal(r, c);
        drawBoard();
    }

    canvas.addEventListener('click', handleMineClick);
    document.getElementById('mineReset').addEventListener('click', initBoard);
    initBoard();
}

// ========== JOGO 4: QUEBRA-CABEÇA 15 ==========
function initPuzzle15() {
    const canvas = getCanvas('puzzleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 4;
    const cellSize = canvas.width / size;
    let tiles = [];
    let empty = { x: 3, y: 3 };

    function initTiles() {
        tiles = [];
        for (let i = 0; i < size * size; i++) tiles.push(i);
        empty = { x: 3, y: 3 };
        for (let i = 0; i < 300; i++) {
            const moves = [
                { x: 0, y: -1 }, { x: 0, y: 1 },
                { x: -1, y: 0 }, { x: 1, y: 0 }
            ];
            const valid = moves.filter(m => {
                const nx = empty.x + m.x,
                    ny = empty.y + m.y;
                return nx >= 0 && nx < size && ny >= 0 && ny < size;
            });
            const move = valid[Math.floor(Math.random() * valid.length)];
            const nx = empty.x + move.x,
                ny = empty.y + move.y;
            const idx1 = empty.y * size + empty.x;
            const idx2 = ny * size + nx;
            [tiles[idx1], tiles[idx2]] = [tiles[idx2], tiles[idx1]];
            empty.x = nx;
            empty.y = ny;
        }
        drawPuzzle();
    }

    function drawPuzzle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2b5a6b';
        ctx.lineWidth = 2;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const val = tiles[row * size + col];
                const x = col * cellSize,
                    y = row * cellSize;
                if (val === 0) {
                    ctx.fillStyle = '#162b36';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    continue;
                }
                ctx.fillStyle = '#3b7b8f';
                ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                ctx.fillStyle = '#e3f0fa';
                ctx.font = `bold ${cellSize*0.5}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
            }
        }
        let win = true;
        for (let i = 0; i < size * size - 1; i++)
            if (tiles[i] !== i + 1) win = false;
        document.getElementById('puzzleStatus').innerText = win ? '🎉 Completo!' : '🧩 Mova as peças';
    }

    function handlePuzzleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;
        const mx = (e.clientX - rect.left) * scale;
        const my = (e.clientY - rect.top) * scale;
        const col = Math.floor(mx / cellSize);
        const row = Math.floor(my / cellSize);
        if (row < 0 || row >= size || col < 0 || col >= size) return;
        const dx = Math.abs(col - empty.x),
            dy = Math.abs(row - empty.y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            const idx1 = row * size + col;
            const idx2 = empty.y * size + empty.x;
            [tiles[idx1], tiles[idx2]] = [tiles[idx2], tiles[idx1]];
            empty.x = col;
            empty.y = row;
            drawPuzzle();
        }
    }

    canvas.addEventListener('click', handlePuzzleClick);
    document.getElementById('puzzleReset').addEventListener('click', initTiles);
    initTiles();
}

// ========== JOGO 5: JOGO DA MEMÓRIA ==========
function initMemory() {
    const canvas = getCanvas('memoryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [];
    let firstIndex = null;
    let lock = false;
    const cols = 4,
        rows = 4;
    const cellSize = canvas.width / cols;

    function initCards() {
        const deck = [...emojis, ...emojis];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        cards = deck.map((emoji) => ({ emoji, matched: false, flipped: false }));
        firstIndex = null;
        lock = false;
        drawMemory();
        document.getElementById('memoryStatus').innerText = '🃏 Encontre os pares';
    }

    function drawMemory() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < cards.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * cellSize,
                y = row * cellSize;
            ctx.fillStyle = '#1d3f4d';
            ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
            ctx.strokeStyle = '#1f4d5a';
            ctx.strokeRect(x, y, cellSize, cellSize);
            if (cards[i].flipped || cards[i].matched) {
                ctx.fillStyle = '#344f5e';
                ctx.fillRect(x + 2, y + 2, cellSize - 6, cellSize - 6);
                ctx.font = `${cellSize*0.7}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#f5f9ff';
                ctx.fillText(cards[i].emoji, x + cellSize / 2, y + cellSize / 2 + 2);
            }
        }
        if (cards.every(c => c.matched)) {
            document.getElementById('memoryStatus').innerText = '🎉 Parabéns!';
        }
    }

    function handleMemoryClick(e) {
        if (lock) return;
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;
        const mx = (e.clientX - rect.left) * scale;
        const my = (e.clientY - rect.top) * scale;
        const col = Math.floor(mx / cellSize);
        const row = Math.floor(my / cellSize);
        const idx = row * cols + col;
        if (idx < 0 || idx >= cards.length) return;
        if (cards[idx].flipped || cards[idx].matched) return;
        if (firstIndex === null) {
            cards[idx].flipped = true;
            firstIndex = idx;
            drawMemory();
        } else {
            cards[idx].flipped = true;
            drawMemory();
            lock = true;
            const idx1 = firstIndex,
                idx2 = idx;
            setTimeout(() => {
                if (cards[idx1].emoji === cards[idx2].emoji) {
                    cards[idx1].matched = true;
                    cards[idx2].matched = true;
                    if (cards.every(c => c.matched)) {
                        document.getElementById('memoryStatus').innerText = '🎉 Parabéns!';
                    }
                } else {
                    cards[idx1].flipped = false;
                    cards[idx2].flipped = false;
                }
                firstIndex = null;
                lock = false;
                drawMemory();
            }, 500);
        }
    }

    canvas.addEventListener('click', handleMemoryClick);
    document.getElementById('memoryReset').addEventListener('click', initCards);
    initCards();
}

// ========== INICIALIZAR TODOS OS JOGOS ==========
window.onload = function() {
    initSnake();
    initTicTacToe();
    initMinesweeper();
    initPuzzle15();
    initMemory();
};
