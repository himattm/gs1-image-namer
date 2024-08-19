let files = {}; // Object to store files associated with their tokens

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    populateTabs(); // Populate the tabs based on the schemes object
    changeScheme('scheme1'); // Load the grid for the first scheme by default
});

// Function to dynamically populate tabs based on the schemes object
function populateTabs() {
  const tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = ''; // Clear existing tabs

  // Iterate over each scheme in the schemes object
  Object.keys(schemes).forEach((schemeKey, index) => {
      console.log(`Adding tab for: ${schemeKey}`); // Log the schemeKey to see if it's being processed

      const tab = document.createElement('div');
      tab.textContent = schemeNames[schemeKey]; // Display scheme number as tab label
      
      if (schemeKey === 'scheme1') {
          tab.classList.add('active'); // Only add 'active' if it's the first scheme
      }

      tab.addEventListener('click', () => changeScheme(schemeKey)); // Add click event to switch schemes

      tabsContainer.appendChild(tab); // Append the tab to the tabs container
  });
}

// Function to set the active tab by highlighting the selected one
function setActiveTab(schemeKey) {
    const tabs = document.querySelectorAll('.tabs div');
    tabs.forEach(tab => {
        // Highlight the active tab and remove the highlight from others
        if (tab.textContent === schemeNames[schemeKey]) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Function to create the grid based on the selected scheme
function createGrid(scheme) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = ''; // Clear existing grid

    // Iterate over each item in the selected scheme to create grid elements
    scheme.forEach(item => {
        const div = document.createElement('div');
        div.setAttribute('data-token', item.token); // Set the token as a data attribute
        div.textContent = item.name; // Display the name in the grid cell

        // Add drag-and-drop event listeners
        div.addEventListener('dragover', (e) => e.preventDefault());
        div.addEventListener('drop', handleDrop);

        gridContainer.appendChild(div); // Append the grid cell to the grid container
    });

    files = {}; // Clear the current files when switching schemes
}

// Function to handle scheme changes, updating the grid and active tab
function changeScheme(schemeKey) {
    setActiveTab(schemeKey); // Highlight the selected tab
    createGrid(schemes[schemeKey]); // Create the grid for the selected scheme
}

// Function to handle image drop events
function handleDrop(e) {
    e.preventDefault(); // Prevent the default behavior

    const token = e.currentTarget.getAttribute('data-token');
    const file = e.dataTransfer.files[0];
    if (!file) return;

    files[token] = file;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    const targetElement = e.currentTarget;

    if (fileExtension === 'tif' || fileExtension === 'tiff') {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const arrayBuffer = event.target.result;
                const ifds = UTIF.decode(arrayBuffer); // Decode the TIFF file
                UTIF.decodeImage(arrayBuffer, ifds[0]); // Decode the first image frame
                const rgba = UTIF.toRGBA8(ifds[0]); // Convert the image to RGBA format
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = ifds[0].width;
                canvas.height = ifds[0].height;
                const imgData = ctx.createImageData(canvas.width, canvas.height);
                imgData.data.set(rgba);
                ctx.putImageData(imgData, 0, 0);
                const img = document.createElement('img');
                img.src = canvas.toDataURL();
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                targetElement.innerHTML = '';
                targetElement.appendChild(img);
            } catch (error) {
                console.error("Error processing TIFF file:", error);
                targetElement.innerHTML = 'Error displaying image';
            }
        };
        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    } else {
        // Handle non-TIFF images (e.g., PNG, JPEG)
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        targetElement.innerHTML = '';
        targetElement.appendChild(img);
    }
}

// Function to download renamed images as a ZIP file
function downloadImages() {
    // Check if no images have been uploaded
    if (Object.keys(files).length === 0) {
        alert('Error: No images have been uploaded. Please drag and drop images into the grid before downloading.');
        return;
    }

    const zip = new JSZip(); // Create a new JSZip instance
    let originalFilenameBase = ""; // Variable to store the original filename base

    // Iterate over each file to rename and add to the ZIP
    Object.keys(files).forEach(token => {
        const file = files[token];
        const originalName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();

        // Truncate the number and replace it with the token
        const newNameParts = originalName.split('_');
        const baseName = newNameParts.slice(0, -1).join('_'); // Everything except the last part (number)
        const newFilename = `${baseName}_${token}.${extension}`; // Create the new filename with the token

        zip.file(newFilename, file); // Add the file to the ZIP with the new filename

        // Set the original filename base (used for the ZIP filename)
        if (!originalFilenameBase) {
            originalFilenameBase = baseName;
        }
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: 'blob' }).then(content => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `${originalFilenameBase}_renamed_images.zip`;
        a.click();
    });
}