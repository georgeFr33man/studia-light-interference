function changeLightRange(val) {
  WHITE_VALUE = val;
  document.getElementById('whiteLightRangeLabel').innerText = "Jasność: " + val;
  createInterference();
}
