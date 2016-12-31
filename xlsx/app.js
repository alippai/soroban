function printSheet(worksheet) {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const cells = Object.keys(worksheet).filter(key => key[0] !== '!');
  const parsed = [];

  let maxCol = 0;
  cells.forEach(cell => {
    const col = abc.indexOf(cell.substring(0, 1));
    maxCol = maxCol < col ? col : maxCol;
    const row = parseInt(cell.substring(1)) - 1;
    if (parsed[row] === undefined) parsed[row] = [];
    parsed[row][col] = worksheet[cell].v;
  });


  const colValueCount = [];
  for (let i = 0; i < parsed[0].length; i++) {
    colValueCount[i] = {};
    for (let j = 0; j < parsed.length; j++) {
      if (parsed[j] === undefined) continue;
      if (colValueCount[i][parsed[j][i]] === undefined) {
        colValueCount[i][parsed[j][i]] = 1;
      } else {
        colValueCount[i][parsed[j][i]] += 1;
      }
    }
  }

  const groupCols = [];

  colValueCount.forEach((col, i) => {
    const values = Object.keys(col);
    let match = 0;
    values.forEach(value => {
      if (col[value] > 2) {
        match++;
      }
    });
    if (match > 2) groupCols[i] = match;
  });

  debugger;

  parsed.forEach(row => row.length = maxCol + 1);
  const emptyRow = '&nbsp</td><td>'.repeat(maxCol) + '&nbsp';
  for (let i = 0; i < 10; i++) {
    const textCells = parsed[i] ? parsed[i].join('</td><td>') : emptyRow;
    const textRow = '<tr><td>' + textCells + '</td></tr>';
    $('#tbody').append(textRow);
  }
  const colHeads = [];
  for (let i = 0; i <= maxCol; i++) {
    colHeads.push(abc[i]);
  }
  $('#thead').append('<tr><th>' + colHeads.join('</th><th>') + '</th></tr>');
  $('#rowSelector tr').click(event => {
    return false;
  });
}

$(document).ready(() => {
  $('#file').change(e => {
    const f = e.target.files[0];

    const reader = new FileReader();
    reader.onload = datae => {
      const data = datae.target.result;

      const workbook = XLSX.read(data, {type: 'binary'});

      for (let i = 0; i < workbook.SheetNames.length; i++) {
        const sheetName = workbook.SheetNames[i];
        const isGL = /GL/g.test(sheetName) ? 'isGL' : 'isNotGL';
        $('#sheetselector').append(`<li class="${isGL}">${sheetName}</li>`);
      }

      $('#sheetselector li').click(e => {
        const target = e.target;
        $('#sheetselector').hide();
        $('#rowSelector').show();
        /* Get worksheet */
        const worksheet = workbook.Sheets[target.innerText];

        printSheet(worksheet);
        return false;
      });
    };
    reader.readAsBinaryString(f);
  })
});
