let WHITE_VALUE = 100;

let data = {
  0: {right: 10.78, left: 10.77},
  500: {right: 9.6, left: 10.77},
  1000: {right: 4.31, left: 8.7},
  1500: {right: 1.4, left: 5},
  2000: {right: 0.08, left: 2.03},
  2500: {right: 0.06, left: 1.86},
  3000: {right: 0.44, left: 0.05},
  3500: {right: 0.81, left: 0.01},
  4000: {right: 0.85, left: 0.09},
  4500: {right: 0.52, left: 0.27},
  5000: {right: 0.3, left: 0.25},
  5500: {right: 0.07, left: 0.06},
  6000: {right: 0.13, left: 0.01},
  6500: {right: 0.15, left: 0.01},
  7000: {right: 0.24, left: 0.01},
};

const dataOptions = {
  newMax: 1,
  newMin: 0,

  min: (data) => {
    return Math.min.apply(Math, data)
  },
  max: (data) => {
    return Math.max.apply(Math, data)
  },

  convertKey(key) {
    const max = this.max(Object.keys(data));
    const min = -this.max(Object.keys(data));
    if (max - min !== 0) {
      return ((key - min) / (max - min)) * (this.newMax - this.newMin) + this.newMin;
    }
    return key;
  },

  get dataToArray() {
    let arr = [];
    Object.keys(data).forEach(value => {
      let dataElement = data[value];
      arr.push(dataElement.right);
      arr.push(dataElement.left);
    });
    return arr;
  },

  get convertedData() {
    const newData = {};
    const max = this.max(this.dataToArray);
    const min = this.min(this.dataToArray);

    Object.keys(data).forEach((value) => {
      let dataElement = data[value];
      let rightElement = dataElement.right;
      let leftElement = dataElement.left;
      if (max !== min) {
        rightElement = ((dataElement.right - min) / (max - min)) * (this.newMax - this.newMin) + this.newMin;
        leftElement = ((dataElement.left - min) / (max - min)) * (this.newMax - this.newMin) + this.newMin;
      }
      newData[this.convertKey(parseInt(value))] = rightElement;
      newData[this.convertKey(-parseInt(value))] = leftElement;
    });

    return newData;
  }
}

function createInterference() {
  const c = document.getElementById("gradientCanvas");
  const ctx = c.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 1368, 0);
  if (Object.keys(data).length > 0) {
    Object.keys(dataOptions.convertedData).forEach(offset => {
      let value = dataOptions.convertedData[offset];
      let color = lightenColor('#000000', value * WHITE_VALUE);
      grd.addColorStop(parseFloat(offset), `#${color}`);
    });
  } else {
    grd.addColorStop(0, 'black');
    grd.addColorStop(1, 'black');
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1368, 447);
}

function lightenColor(color, percent) {
  let num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;

  return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}
