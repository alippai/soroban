$(document).ready(() => {
  $('#file').change(e => {
    const f = e.target.files[0];

    const reader = new FileReader();
    reader.onload = datae => {
      const data = datae.target.result;

      const workbook = XLSX.read(data, {type: 'binary'});

      const first_sheet_name = workbook.SheetNames[0];

      /* Get worksheet */
      const worksheet = workbook.Sheets[first_sheet_name];
      const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      const cells = Object.keys(worksheet).filter(key => key[0] !== '!');
      const parsed = [];
      let maxCol = 0;
      cells.forEach(cell => {
        const col = abc.indexOf(cell.substring(0, 1));
        maxCol = maxCol < col ? col : maxCol;
        const row = parseInt(cell.substring(1));
        if (parsed[row] === undefined) parsed[row] = [];
        parsed[row][col] = worksheet[cell].v;
      });
      parsed.forEach(row => row.length = maxCol + 1);
      const emptyRow = '&nbsp</td><td>'.repeat(maxCol) + '&nbsp';
      for (let i = 0; i < parsed.length; i++) {
        const textCells = parsed[i] ? parsed[i].join('</td><td>') : emptyRow;
        const textRow = '<tr><td>' + textCells + '</td></tr>';
        $('#tbody').append(textRow);
      }
      const colHeads = [];
      for (let i = 0; i <= maxCol; i++) {
        colHeads.push(abc[i]);
      }
      $('#thead').append('<tr><th>' + colHeads.join('</th><th>') + '</th></tr>');
      /*
      $('#result').DataTable({
        paging: false
      });
      */
    };
    reader.readAsBinaryString(f);
  })
});
