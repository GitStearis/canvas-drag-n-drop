var circle = document.getElementById("circle");
var square = document.getElementById("square");

dragElement(circle);
dragElement(square);

function dragElement(figure) {
  let shiftX = 0;
  let shiftY = 0;
  let mouseX = 0;
  let mouseY = 0;

  const figureHomePosition = {
    x: figure.offsetLeft,
    y: figure.offsetTop
  };

  figure.onmousedown = dragMouseDown;

  function dragMouseDown(event = window.event) {
    event.preventDefault();
    mouseX = event.clientX;
    mouseY = event.clientY;

    document.onmouseup = stopElementDrag;
    document.onmousemove = dragElement;
  };

  function dragElement(event = window.event) {
    event.preventDefault();
    shiftX = mouseX - event.clientX;
    shiftY = mouseY - event.clientY;
    mouseX = event.clientX;
    mouseY = event.clientY;
    figure.style.top = (figure.offsetTop - shiftY) + "px";
    figure.style.left = (figure.offsetLeft - shiftX) + "px";
  };

  function stopElementDrag() {
    document.onmouseup = null;
    document.onmousemove = null;

    figure.style.left = figureHomePosition.x + "px";
    figure.style.top = figureHomePosition.y + "px";
  };
};

