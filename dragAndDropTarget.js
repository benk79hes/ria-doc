const placeForTarget = document.getElementById("placeForTarget");

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
    
const target = document.createElement("target");
placeForTarget.appendChild(target);   
ev.target.appendChild(document.getElementById(data));
}