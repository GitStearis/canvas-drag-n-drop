var magicalDropNumber = 6;

var figures = {
  circle: {
    id: "circle",
    color: "#ee9988",
    radius: 40,
  },
  square: {
    id: "square",
    color: "#88dd86",
    width: 80
  }
};

var circle = document.getElementById(figures.circle.id);
var square = document.getElementById(figures.square.id);
var canvas = document.getElementById("canvas");

var context = initializeCanvas(canvas);

var releaseX = 0;
var releaseY = 0;

dragElement(circle);
dragElement(square);

function initializeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (canvas.getContext) {
    return canvas.getContext('2d');
  }
};

function drawFigure(type) {
  switch(type) {
    case figures.circle.id: {
      drawCircle();
    } break;
    case figures.square.id: {
      drawSquare();
    } break;
    default: break;
  };

  function drawCircle() {
    if (context) {
      if (releaseX && releaseY) {
        context.beginPath();
        context.arc(releaseX, releaseY, figures.circle.radius, 0, 2 * Math.PI, false);
        context.fillStyle = figures.circle.color;
        context.fill();
        context.closePath();
      }
    }
  };

  function drawSquare() {
    if (context) {
      if (releaseX && releaseY) {
        const width = figures.square.width;
        const topX = releaseX - width / 2;
        const topY = releaseY - width / 2;

        context.beginPath();
        context.rect(topX, topY, width, width);
        context.fillStyle = figures.square.color;
        context.fill();
        context.closePath();
      }
    }
  };
};

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

    releaseX = magicalDropNumber + figure.offsetLeft + figure.offsetWidth / 2;
    releaseY = figure.offsetTop + figure.offsetHeight / 2;

    figure.style.left = figureHomePosition.x + "px";
    figure.style.top = figureHomePosition.y + "px";
    
    drawFigure(figure.id);
  };
};

