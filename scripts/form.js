const formTemplate = `
    <div class="col-8 mx-auto">
        <form>
            <div class="row d-flex root-element">
                <div class="col-1 align-self-end align-content-center element-counter-box">
                    <div class="fw-bold element-counter">1.</div>
                </div>
                <div class="col-2 detectorPosition">
                    <div class="form-group mb-0">
                        <label for="detectorPosition">Położenie detektora</label>
                        <input onchange="editData(this)" type="number" class="form-control" id="detectorPosition" placeholder="0">
                    </div>
                </div>
                <div class="col-4 leftIntensity">
                    <div class="form-group mb-0">
                        <label for="leftIntensity">Natężenie światła - Lewa strona</label>
                        <input onchange="editData(this)" type="number" class="form-control" id="leftIntensity" placeholder="0">
                    </div>
                </div>
                <div class="col-4 rightIntensity">
                    <div class="form-group mb-0">
                        <label for="rightIntensity">Natężenie światła - Prawa strona</label>
                        <input onchange="editData(this)" type="number" class="form-control" id="rightIntensity" placeholder="0">
                    </div>
                </div>
                <div class="col-1 align-self-end align-content-end action-button">
                    <div class="btn btn-primary" onclick="addData(this)"><i class="fas fa-plus"></i></div>
                </div>
                <hr class="my-2">
            </div>
        </form>
    </div>
`;

function clearData() {
  data = {};
  createFormElements();
}

function editData(btn) {
  let form = btn.parentNode.parentNode.parentNode,
    index = +btn.parentNode.parentElement.parentElement.parentElement.parentElement.getAttribute('index'),
    detectorPosition = +form.getElementsByClassName('detectorPosition')[0]
      .getElementsByTagName('input')[0].value,
    leftIntensity = +form.getElementsByClassName('leftIntensity')[0]
      .getElementsByTagName('input')[0].value,
    rightIntensity = +form.getElementsByClassName('rightIntensity')[0]
      .getElementsByTagName('input')[0].value;
  delete data[Object.keys(data)[index - 1]];
  data[detectorPosition] = {
    right: rightIntensity,
    left: leftIntensity,
  }
  createFormElements();
}

function addData(btn) {
  let form = btn.parentNode.parentNode.parentNode;
  let detectorPosition = +form.firstElementChild.getElementsByClassName('detectorPosition')[0]
    .getElementsByTagName('input')[0].value,
    leftIntensity = +form.firstElementChild.getElementsByClassName('leftIntensity')[0]
      .getElementsByTagName('input')[0].value,
    rightIntensity = +form.firstElementChild.getElementsByClassName('rightIntensity')[0]
      .getElementsByTagName('input')[0].value;
  data[detectorPosition] = {
    left: leftIntensity,
    right: rightIntensity
  };
  createFormElements();
}

function removeData(btn, index = -1) {
  let form = btn.parentNode.parentNode.parentNode, detectorPosition;
  if (index !== -1) {
    detectorPosition = +Object.keys(data)[index];
  } else {
    detectorPosition = +form.firstElementChild.getElementsByClassName('detectorPosition')[0]
      .getElementsByTagName('input')[0].value;
  }

  delete data[detectorPosition];
  createFormElements();
}

function createFormElements() {
  const rootElement = document.getElementById('root');
  rootElement.innerHTML = '';
  createInterference();
  let node = createElement(formTemplate);
  rootElement.append(node);
  Object.keys(data).forEach((detectorPosition, index) => {
    let clone = node.cloneNode(true);
    clone.setAttribute('index', index + 1);
    clone = setInnerFormData(clone, {index: index + 1, detectorPosition, data: data[detectorPosition]});
    rootElement.append(clone);
  });
}

function setInnerFormData(node, nodeData) {
  let form = node.firstElementChild.firstElementChild;
  form.getElementsByClassName('detectorPosition')[0]
    .getElementsByTagName('input')[0].setAttribute('value', nodeData.detectorPosition);
  form.getElementsByClassName('leftIntensity')[0]
    .getElementsByTagName('input')[0].setAttribute('value', nodeData.data.left);
  form.getElementsByClassName('rightIntensity')[0]
    .getElementsByTagName('input')[0].setAttribute('value', nodeData.data.right);
  form.getElementsByClassName('element-counter-box')[0].firstElementChild.innerText = nodeData.index + 1;
  let actionButton = form.getElementsByClassName('action-button')[0].firstElementChild;
  actionButton.classList.remove('btn-primary');
  actionButton.classList.add('btn-danger');
  actionButton.firstElementChild.classList.remove('fa-plus');
  actionButton.firstElementChild.classList.add('fa-minus');
  actionButton.setAttribute('onclick', 'removeData(this)');
  return node;
}

function createElement(htmlString) {
  let template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

