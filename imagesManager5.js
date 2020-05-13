//var dropZone = document.getElementById('dropZone');
var dropInSnake = document.getElementById('dropInSnake');

var photoInput = document.createElement("input");
photoInput.type = "file";
photoInput.accept = "image/*";
photoInput.multiple = false; // nous permissions qu'un seul image 

dropInSnake.addEventListener('click', function() {
    photoInput.click();
}); 

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropInSnake.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropInSnake.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) {
        if (file.type.match(/image.*/)) {
            var reader = new FileReader();

            reader.onload = function(e2) {
                // finished reading file data.
                var img = document.createElement('img');
                img.src= e2.target.result;
                dropInSnake.appendChild(img);
                //document.body.appendChild(img);
            }

            reader.readAsDataURL(file); // start reading the file data.
        }
    }
});