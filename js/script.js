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

var canvasFigures = [];
var isDragging = false;

var releaseX = 0;
var releaseY = 0;

var circle = document.getElementById(figures.circle.id);
var square = document.getElementById(figures.square.id);
var canvas = document.getElementById("canvas");

var offsetX = canvas.getBoundingClientRect().left;
var offsetY = canvas.getBoundingClientRect().top;

var context = null;

initializePicker();
initializeCanvas(canvas);

function initializePicker() {
  dragElement(circle);
  dragElement(square);
};

function initializeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (canvas.getContext) {
    context = canvas.getContext("2d");
  }

  setCanvasMouseInteractions(canvas);
};

function setCanvasMouseInteractions(canvas) {
  canvas.onmousedown = grabFigure;
  canvas.onmouseup = releaseFigure;
  canvas.onmousemove = dragFigure;

  var mouseX = 0;
  var mouseY = 0;

  var dragStartX = 0;
  var dragStartY = 0;

  function grabFigure(event) {
    if (!isDragging) {
      event.preventDefault();
      event.stopPropagation();
  
      mouseX = event.clientX - offsetX;
      mouseY = event.clientY - offsetY;

      dragStartX = mouseX;
      dragStartY = mouseY;
  
      isDragging = false;
      for (let i = canvasFigures.length - 1; i >= 0; i--) {
        switch(canvasFigures[i].type) {
          case figures.circle: {
            if (checkCircle(canvasFigures[i], mouseX, mouseY)) {
              isDragging = true;
              canvasFigures[i].isDragging = true;
              return ;
            }
          } break;
          case figures.square: {
            if (checkSquare(canvasFigures[i], mouseX, mouseY)) {
              isDragging = true;
              canvasFigures[i].isDragging = true;
              return ;
            }
          } break;
          default: break;
        };
      }
      canvasFigures.forEach(figure => {

      });
  
      
    }
    
    function checkCircle(circle, x, y) {
      const dx = circle.x - x - magicalDropNumber;
      const dy = circle.y - y;
      return (dx * dx + dy * dy < figures.circle.radius * figures.circle.radius);
    };

    function checkSquare(square, x, y) {
      return (x + magicalDropNumber > square.x - figures.square.width / 2
              && x < square.x + figures.square.width / 2
              && y > square.y - figures.square.width / 2
              && y < square.y + figures.square.width / 2);
    };
  };

  function releaseFigure(event) {
    if (isDragging) {
      event.preventDefault();
      event.stopPropagation();

      releaseX = event.clientX - offsetX;
      releaseY = event.clientY - offsetY;

      isDragging = false;
      canvasFigures.forEach(figure => {
        figure.isDragging = false;
      });
    }
  };

  function dragFigure(event) {
    if (isDragging) {
      event.preventDefault();
      event.stopPropagation();

      mouseX = event.clientX - offsetX;
      mouseY = event.clientY - offsetY;

      const distanceX = mouseX - dragStartX;
      const distanceY = mouseY - dragStartY;

      canvasFigures.forEach(figure => {
        if (figure.isDragging) {
          figure.x += distanceX;
          figure.y += distanceY;
        }
      });

      redrawCanvas();

      dragStartX = mouseX;
      dragStartY = mouseY;
    }
  };

  function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height); 
    canvasFigures.forEach(figure => drawFigure(figure, false));
  }
};

function dragElement(element) {
  let shiftX = 0;
  let shiftY = 0;
  let mouseX = 0;
  let mouseY = 0;

  const elementHomePosition = {
    x: element.offsetLeft,
    y: element.offsetTop
  };

  element.onmousedown = startDrag;

  function startDrag(event = window.event) {
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
    element.style.top = (element.offsetTop - shiftY) + "px";
    element.style.left = (element.offsetLeft - shiftX) + "px";
  };

  function stopElementDrag() {
    document.onmouseup = null;
    document.onmousemove = null;

    releaseX = element.offsetLeft + element.offsetWidth / 2 + magicalDropNumber;
    releaseY = element.offsetTop + element.offsetHeight / 2;

    element.style.left = elementHomePosition.x + "px";
    element.style.top = elementHomePosition.y + "px";
    
    drawFigure(figureByElementId(element.id), true);
  };

  function figureByElementId(id) {
    switch(id) {
      case figures.circle.id: {
        return {
          x: releaseX,
          y: releaseY,
          type: figures.circle
        }
      }
      case figures.square.id: {
        return {
          x: releaseX,
          y: releaseY,
          type: figures.square
        }
      }
      default: {
        return {};
      };
    }
  }
};

function drawFigure(figure, isCreated) {
  switch(figure.type) {
    case figures.circle: {
      drawCircle(figure.x, figure.y);
      if (isCreated) {
        registerFigure(figure.x, figure.y, figures.circle);
      }
    } break;
    case figures.square: {
      drawSquare(figure.x, figure.y);
      if (isCreated) {
        registerFigure(figure.x, figure.y, figures.square);
      }
    } break;
    default: break;
  };

  function drawCircle(x, y) {
    if (context) {
      context.beginPath();
        context.arc(x, y, figures.circle.radius, 0, 2 * Math.PI, false);
        context.fillStyle = figures.circle.color;
        context.fill();
        context.closePath();
    }
  };

  function drawSquare(x, y) {
    if (context) {
      const width = figures.square.width;
      const topX = x - width / 2;
      const topY = y - width / 2;

      context.beginPath();
      context.rect(topX, topY, width, width);
      context.fillStyle = figures.square.color;
      context.fill();
      context.closePath();
    }
  };

  function registerFigure(x, y, type) {
    canvasFigures.push({
      x,
      y,
      type,
      isDragging: false
    });
  }
};

