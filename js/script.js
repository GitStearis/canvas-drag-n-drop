var magicalDropNumber = 6;

var meals = {
  ham: {
    id: "ham",
    color: "#ee9988",
    radius: 40,
  },
  cheese: {
    id: "cheese",
    color: "#e4ce51",
    width: 80
  }
};

var canvasMeals = [];
var isDragging = false;

var releaseX = 0;
var releaseY = 0;

var ham = document.getElementById(meals.ham.id);
var cheese = document.getElementById(meals.cheese.id);
var canvas = document.getElementById("canvas");

var offsetX = canvas.getBoundingClientRect().left;
var offsetY = canvas.getBoundingClientRect().top;

var context = null;

initializePicker();
initializeCanvas(canvas);

function initializePicker() {
  dragElement(ham);
  dragElement(cheese);
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
      for (let i = canvasMeals.length - 1; i >= 0; i--) {
        switch(canvasMeals[i].type) {
          case meals.ham: {
            if (checkHam(canvasMeals[i], mouseX, mouseY)) {
              isDragging = true;
              canvasMeals[i].isDragging = true;
              return ;
            }
          } break;
          case meals.cheese: {
            if (checkCheese(canvasMeals[i], mouseX, mouseY)) {
              isDragging = true;
              canvasMeals[i].isDragging = true;
              return ;
            }
          } break;
          default: break;
        };
      }
    }
    
    function checkHam(ham, x, y) {
      const dx = ham.x - x - magicalDropNumber;
      const dy = ham.y - y;
      return (dx * dx + dy * dy < meals.ham.radius * meals.ham.radius);
    };

    function checkCheese(cheese, x, y) {
      return (x + magicalDropNumber > cheese.x - meals.cheese.width / 2
              && x + magicalDropNumber < cheese.x + meals.cheese.width / 2
              && y > cheese.y - meals.cheese.width / 2
              && y < cheese.y + meals.cheese.width / 2);
    };
  };

  function releaseFigure(event) {
    if (isDragging) {
      event.preventDefault();
      event.stopPropagation();

      releaseX = event.clientX - offsetX;
      releaseY = event.clientY - offsetY;

      isDragging = false;
      canvasMeals.forEach(figure => {
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

      canvasMeals.forEach(figure => {
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
    canvasMeals.forEach(figure => drawFigure(figure, false));
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
      case meals.ham.id: {
        return {
          x: releaseX,
          y: releaseY,
          type: meals.ham
        }
      }
      case meals.cheese.id: {
        return {
          x: releaseX,
          y: releaseY,
          type: meals.cheese
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
    case meals.ham: {
      drawHam(figure.x, figure.y);
      if (isCreated) {
        registerFigure(figure.x, figure.y, meals.ham);
      }
    } break;
    case meals.cheese: {
      drawCheese(figure.x, figure.y);
      if (isCreated) {
        registerFigure(figure.x, figure.y, meals.cheese);
      }
    } break;
    default: break;
  };

  function drawHam(x, y) {
    if (context) {
      context.beginPath();
        context.arc(x, y, meals.ham.radius, 0, 2 * Math.PI, false);
        context.fillStyle = meals.ham.color;
        context.fill();
        context.closePath();
    }
  };

  function drawCheese(x, y) {
    if (context) {
      const width = meals.cheese.width;
      const topX = x - width / 2;
      const topY = y - width / 2;

      context.beginPath();
      context.rect(topX, topY, width, width);
      context.fillStyle = meals.cheese.color;
      context.fill();
      context.closePath();
    }
  };

  function registerFigure(x, y, type) {
    canvasMeals.push({
      x,
      y,
      type,
      isDragging: false
    });
  }
};

