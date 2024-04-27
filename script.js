let fields = [
  'null', 'null', 'null',
  'null', 'null', 'null',
  'null', 'null', 'null'
];

let currentPlayer = 'cross'; // Startspieler

function init() {
  render();
}

function render() {
  let container = document.getElementById('container');
  let tableHtml = '<table>';

  for (let i = 0; i < 3; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < 3; j++) {
          let index = i * 3 + j;
          tableHtml += renderCell(fields[index], index);
      }
      tableHtml += '</tr>';
  }

  tableHtml += '</table>';
  container.innerHTML = tableHtml;
}

function renderCell(field, index) {
  return `<td id="cell-${index}" onclick="handleClick(${index})">${field === 'cross' ? renderCross() : (field === 'circle' ? renderCircle() : '')}</td>`;
}

function handleClick(index) {
  if (fields[index] === 'null') {
      fields[index] = currentPlayer;
      renderCellAndUpdate(index);
      currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross'; // Spieler wechseln
      checkAndUpdateWinner(); // Gewinner überprüfen
  }
}

function renderCellAndUpdate(index) {
  let cell = document.getElementById('cell-' + index);
  if (cell) {
      cell.innerHTML = fields[index] === 'cross' ? renderCross() : (fields[index] === 'circle' ? renderCircle() : '');
  }
}

function renderCircle() {
  return '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="100" cy="100" r="50" fill="transparent" stroke="#3c4fe0" stroke-width="3">' +
      '<animate attributeName="fill" from="transparent" to="#3c4fe0" dur="0.5s" fill="freeze" />' +
      '<animate attributeName="stroke-opacity" from="0" to="1" dur="0.5s" begin="0s" fill="freeze" />' +
      '</circle>' +
      '</svg>';
}

function renderCross() {
  return '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">' +
      '<line x1="50" y1="50" x2="150" y2="150" stroke="#f78125" stroke-width="5">' +
      '<animate attributeName="stroke" from="transparent" to="#f78125" dur="0.5s" fill="freeze" />' +
      '</line>' +
      '<line x1="50" y1="150" x2="150" y2="50" stroke="#f78125" stroke-width="5">' +
      '<animate attributeName="stroke" from="transparent" to="#f78125" dur="0.5s" fill="freeze" />' +
      '</line>' +
      '</svg>';
}


function checkAndUpdateWinner() {
  let { winner, winningCells } = checkWinner();
  if (winner) {
      if (winner === 'draw') {
          alert('Unentschieden!');
      } else {
          alert(winner + ' hat gewonnen!');
          // Durchgestrichene Felder für den Gewinner rendern
          for (let cellIndex of winningCells) {
            renderWinnerLine(cellIndex);
          }
      }
      resetGame(); // Zurücksetzen des Spiels
  }
}

function checkWinner() {
  // Mögliche Gewinnkombinationen
  const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
      [0, 4, 8], [2, 4, 6] // Diagonale Reihen
  ];
  for (let condition of winConditions) {
    let [a, b, c] = condition;
    if (fields[a] !== 'null' && fields[a] === fields[b] && fields[a] === fields[c]) {
        // Eine Gewinnkombination wurde gefunden
        return { winner: fields[a], winningCells: condition };
    }
}

// Überprüfe auf Unentschieden
if (!fields.includes('null')) {
    return { winner: 'draw' };
}

// Das Spiel geht weiter
return { winner: null };
}

function renderWinnerLine(cellIndex) {
  let container = document.getElementById('container');
  if (container) {
    let line = document.createElement('div');
    line.classList.add('winner-line');

    // Berechne die Position der Linie basierend auf der Position des Containers und der Zelle
    let containerRect = container.getBoundingClientRect();
    let cell = document.getElementById('cell-' + cellIndex);
    let cellRect = cell.getBoundingClientRect();

    let lineLeft = cellRect.left - containerRect.left + cellRect.width / 2;
    let lineTop = cellRect.top - containerRect.top + cellRect.height / 2;

    // Setze die Position der Linie
    line.style.left = lineLeft + 'px';
    line.style.top = lineTop + 'px';

    // Füge die Linie zum Container hinzu
    container.appendChild(line);
  }
}
