const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function addTable(groupName, currentTable) {
  $('#result').append(`<h3>${groupName}</h3>`);
  let tbody = '';
  for (let i = 0; i < currentTable.length; i++) {
    const textCells = currentTable[i].join('</td><td>');
    tbody += '<tr><td>' + textCells + '</td></tr>';
  }
  const table = `<table><tbody>${tbody}</tbody></table>`;
  $('#result').append(table);
}

function printSheet(worksheet) {
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
  let firstRow = 0;
  let lastRow = 0;
  let firstCol = 100;
  for (let i = 0; i < parsed[0].length; i++) {
    colValueCount[i] = {};
    for (let j = 0; j < parsed.length; j++) {
      const isYear = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020].includes(parsed[j][i]);
      if (firstRow === 0 && isYear) {
        firstRow = j;
      }
      if (parsed[j] === undefined) {
        lastRow = j - 1;
        continue;
      }
      if (typeof parsed[j][i] === 'number') continue;
      if (parsed[j][i] !== undefined) {
        firstCol = firstCol < i ? firstCol : i;
      }
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

  let max = -1;
  for (let i = 0; i < groupCols.length; i++) {
    if (groupCols[i] === undefined) continue;
    max = max > groupCols[i] ? max : groupCols[i];
  }
  const groupColIndex = groupCols.indexOf(max);

  parsed.forEach(row => row.length = maxCol + 1);

  const groups = [];
  for (let i = firstRow; parsed.length; i++) {
    const value = parsed[i][groupColIndex];
    if (!groups.includes(value)) {
      groups.push(value);
    }
  }
  const cleanedTable = [];
  for (let i = firstRow; i <= lastRow; i++) {
    cleanedTable[i] = [];
    for (let j = firstCol; j < maxCol; j++) {
      cleanedTable[i][j] = parsed[i][j];
    }
    cleanedTable[i].splice(groupColIndex, 1);
  }
  groups.forEach(group => {
    const currentTable = cleanedTable.filter(row => row[groupColIndex] === group);
    addTable(group, currentTable);
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
