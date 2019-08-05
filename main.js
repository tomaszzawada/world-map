const image = document.querySelector(".image");
const imageFit = document.querySelector(".image-fit");
const points = document.querySelectorAll(".point");
const cities = document.querySelectorAll(".list>ul>.city");

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

window.addEventListener("load", () => {
  adjustImage();
  adjustPoints();
});

window.addEventListener(
  "resize",
  debounce(() => {
    adjustImage();
    adjustPoints();
  }, 100)
);

const adjustImage = () => {
  const innerRatio = window.innerWidth / window.innerHeight;
  const imageRatio = image.clientWidth / image.clientHeight;

  if (imageRatio >= innerRatio) {
    image.style.height = window.innerHeight + "px";
    imageFit.style.height = window.innerHeight + "px";
    image.style.width = "auto";
    centerImage();
  } else if (imageRatio < innerRatio) {
    image.style.width = window.innerWidth + "px";
    imageFit.style.height = window.innerHeight + "px";
    image.style.height = "auto";
    centerImage();
  }
};

const adjustPoints = () => {
  const pointsArray = [...points];
  pointsArray.forEach((point, i) => {
    const crd = point.dataset.coordinates.split(", ");
    const x = crd[0];
    const y = crd[1];
    const marginLeft = parseFloat(image.style.left);
    const marginTop = parseFloat(image.style.top);
    const left = image.clientWidth * x + marginLeft;
    const top = image.clientHeight * y + marginTop;

    point.style.left = left + "px";
    point.style.top = top + "px";
  });
};

const centerOnPoint = point => {
  const horizontalCenter = window.innerWidth / 2;
  const selectedP = document.getElementById(point);
  const pointLeft = parseFloat(selectedP.style.left);
  const imageLeft = parseFloat(image.style.left);
  const crd = selectedP.dataset.coordinates.split(", ");
  const imageRight = image.clientWidth - image.clientWidth * crd[0];
  const moveP = horizontalCenter - pointLeft;

  if (Math.abs(imageLeft) > moveP) {
    if (imageRight < horizontalCenter) {
      image.style.left = window.innerWidth - image.clientWidth + "px";
      adjustPoints();
    } else {
      image.style.left = imageLeft + moveP + "px";
      adjustPoints();
    }
  } else {
    image.style.left = "0";
    adjustPoints();
  }
};

const centerImage = () => {
  const left = (image.clientWidth - window.innerWidth) / 2;
  image.style.left = -left + "px";
  image.style.top = "0px";
};

//**** onmouseover****/
Array.from(cities).forEach(city => {
  city.onmouseover = city.onmouseout = handler;

  function handler(event) {
    if (event.type == "mouseover") {
      Array.from(points).forEach(point => {
        if (point.id == event.target.dataset.point) {
          point.className += " active";
          centerOnPoint(point.id);
        }
      });
    }
    if (event.type == "mouseout") {
      Array.from(points).forEach(point => {
        if (point.id == event.target.dataset.point) {
          point.classList.remove("active");
        }
      });
    }
  }
});
