const powerSet = arr => {
  // the power set of [] is [[]]
  if (arr.length === 0) {
    return [[]];
  }

  // remove and remember the last element of the array
  const lastElement = arr.pop();

  // take the powerset of the rest of the array
  const restPowerset = powerSet(arr);

  // for each set in the power set of arr minus its last element,
  // include that set in the powerset of arr both with and without
  // the last element of arr
  const powerset = [];
  for(let i = 0; i < restPowerset.length; i++) {
    let set = restPowerset[i];

    // without last element
    powerset.push(set);

    // with last element
    set = set.slice(); // create a new array that's a copy of set
    set.push(lastElement);
    powerset.push(set);
  }

  return powerset;
};

const subsetsEqual = (arr, number) => {
  // all subsets of arr
  const powerset = powerSet(arr);

  // subsets summing less than or equal to number
  const subsets = [];

  for(let i = 0; i < powerset.length; i++) {
    const subset = powerset[i];

    let sum = 0;
    for(let j = 0; j < subset.length; j++) {
      sum += subset[j];
    }

    if(sum === number) {
      subsets.push(subset);
    }
  }

  return subsets;
};

function update() {
  const inputNumbers = $('#inputNumbers').val();
  const inputGoal = $('#inputGoal').val();
  if (inputNumbers === '' || inputGoal === '') return;
  const rows = inputNumbers.split('\n');
  const filtered = rows.map(row => parseInt(row.replace(/[^\d-]/gi, ''), 10)).filter(n => n !== 0);
  const uniqueInput = [ ...new Set(filtered)];
  const results = subsetsEqual(uniqueInput, parseInt(inputGoal, 10));
  const sortedResults = results.sort((a, b) => a.length - b.length);
  const shortestResults = sortedResults.filter(result => result.length === sortedResults[0].length);
  const textResults = shortestResults.map(result => result.join('\n'));
  const uniqueResults = [ ...new Set(textResults)];
  const $result = $('#result');
  $result.html('');
  uniqueResults.forEach(result => $result.append(`<pre>${result}</pre>`));
}

$(document).ready(() => {
  $('#inputGoal').on('input', update);
  $('#inputNumbers').on('input', update);
});
