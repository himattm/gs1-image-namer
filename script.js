// REMOVED reference to checkbox

let files = {}; // Object to store files associated with their tokens
const loadingIndicator = document.getElementById('loadingIndicator'); // Get loading indicator element
const downloadButton = document.getElementById('downloadButton'); // Get download button element


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    populateTabs(); // Populate the tabs based on the schemes object
    // Find the first scheme key correctly
    const firstSchemeKey = Object.keys(schemes)[0];
    if (firstSchemeKey) {
        changeScheme(firstSchemeKey); // Load the grid for the first scheme by default
    } else {
        console.error("No schemes found to display.");
         document.getElementById('gridContainer').innerHTML = '<p>Error: No naming schemes defined in schemes.js</p>';
    }
});

// Function to dynamically populate tabs based on the schemes object
function populateTabs() {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = ''; // Clear existing tabs
    const schemeKeys = Object.keys(schemes);

    // Iterate over each scheme in the schemes object
    schemeKeys.forEach((schemeKey, index) => {
        console.log(`Adding tab for: ${schemeKey}`); // Log the schemeKey to see if it's being processed

        const tab = document.createElement('div');
        tab.textContent = schemeNames[schemeKey] || `Scheme ${index + 1}`; // Use name from schemeNames or default
        tab.setAttribute('data-scheme-key', schemeKey); // Store scheme key

        // Set the first tab as active initially
        if (index === 0) {
            tab.classList.add('active');
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
        if (tab.getAttribute('data-scheme-key') === schemeKey) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}


// Function to create the grid based on the selected scheme
// Grid clearing logic removed from here, happens on scheme change or explicitly
function createGrid(scheme) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = ''; // Clear existing grid visually

    // Iterate over each item in the selected scheme to create grid elements
    scheme.forEach(item => {
        const div = document.createElement('div');
        div.className = 'grid-cell'; // Apply the grid-cell class
        div.setAttribute('data-token', item.token); // Set the token as a data attribute
        div.textContent = item.name; // Display the slot name

        // Add drag-and-drop event listeners
        div.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow drop
            e.currentTarget.classList.add('dragover'); // Add class on dragover
        });
         div.addEventListener('dragleave', (e) => {
            e.currentTarget.classList.remove('dragover'); // Remove class on dragleave
        });
        div.addEventListener('drop', (e) => {
             e.currentTarget.classList.remove('dragover'); // Remove class on drop
             handleDrop(e);
        });

        gridContainer.appendChild(div); // Append the grid cell to the grid container
    });

     // Do NOT clear files = {} here automatically. Only clear when changing scheme or manually.

    // Reset button state
    if (downloadButton) {
        downloadButton.disabled = false;
    }
     // Ensure loading indicator is hidden
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Function to handle scheme changes, updating the grid and active tab
function changeScheme(schemeKey) {
    console.log(`Changing to scheme: ${schemeKey}`); // Log scheme change
    if (!schemes[schemeKey]) {
        console.error(`Scheme with key ${schemeKey} not found.`);
        return;
    }
    setActiveTab(schemeKey); // Highlight the selected tab
    files = {}; // Clear the files object when changing schemes
    // Create the grid for the selected scheme
    createGrid(schemes[schemeKey]);
}

// Helper function to display file preview (extracted from handleDrop)
function displayFilePreview(file, targetElement) {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Show placeholder or text immediately
    targetElement.innerHTML = ''; // Clear previous content
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    targetElement.appendChild(spinner); // Add spinner

    const reader = new FileReader();
    reader.onload = function(event) {
         if (fileExtension === 'tif' || fileExtension === 'tiff') {
            setTimeout(() => { // Use setTimeout for TIFF to allow spinner render
                try {
                    const arrayBuffer = event.target.result;
                    const ifds = UTIF.decode(arrayBuffer);
                    if (!ifds || ifds.length === 0) throw new Error("Cannot decode TIFF file.");
                    UTIF.decodeImage(arrayBuffer, ifds[0]);
                    const rgba = UTIF.toRGBA8(ifds[0]);
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
                    img.style.objectFit = 'contain';
                    targetElement.innerHTML = '';
                    targetElement.appendChild(img);
                } catch (error) {
                    console.error("Error processing TIFF file:", error);
                    targetElement.innerHTML = 'Error displaying TIFF';
                }
            }, 10);
        } else {
            const img = document.createElement('img');
            img.onload = () => {
                targetElement.innerHTML = '';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                targetElement.appendChild(img);
            };
            img.onerror = () => {
                console.error("Error loading image preview.");
                targetElement.innerHTML = 'Error displaying image';
            };
            img.src = event.target.result; // Use Data URL from reader
        }
    };

    reader.onerror = function() {
        console.error("Error reading file for preview.");
         // Remove spinner and show error on read error
        targetElement.innerHTML = 'Error reading file';
    };

    // Read the file appropriately
    if (fileExtension === 'tif' || fileExtension === 'tiff') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file); // Read as Data URL for standard images
    }
}


// Function to handle image drop events
function handleDrop(e) {
    e.preventDefault(); // Prevent the default browser behavior

    const token = e.currentTarget.getAttribute('data-token');
    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Basic file type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/webp'];
    const activeSchemeKey = getActiveSchemeKey(); // Get current scheme key for error message restoration
    const currentScheme = activeSchemeKey ? schemes[activeSchemeKey] : null;

    if (!allowedTypes.includes(file.type)) {
        alert(`Unsupported file type: ${file.type}. Please upload JPG, PNG, GIF, TIFF, or WEBP images.`);
        // Restore original cell content if drop is invalid
         const schemeItem = currentScheme ? currentScheme.find(item => item.token === token) : null;
         if (schemeItem) {
             e.currentTarget.textContent = schemeItem.name;
         } else {
             e.currentTarget.textContent = 'Drop image here'; // Fallback
         }
        return;
    }

    files[token] = file; // Store the file reference
    displayFilePreview(file, e.currentTarget); // Use the helper function
}

// Helper to get the currently active scheme key
function getActiveSchemeKey() {
    const activeTab = document.querySelector('.tabs div.active');
    return activeTab ? activeTab.getAttribute('data-scheme-key') : null;
}


// Function to download renamed images as a ZIP file
function downloadImages() {
    const uploadedFilesCount = Object.keys(files).length;
    if (uploadedFilesCount === 0) {
        alert('Error: No images have been uploaded. Please drag and drop images into the grid before downloading.');
        return;
    }

    // Show loading indicator and disable button
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (downloadButton) downloadButton.disabled = true;


    const zip = new JSZip();
    let originalFilenameBase = "";
    let activeSchemeKey = getActiveSchemeKey(); // Use helper
    let filesAddedToZip = 0;

    if (!activeSchemeKey) {
        console.error("Could not determine the active scheme.");
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (downloadButton) downloadButton.disabled = false;
        alert("Error: Could not determine the active naming scheme.");
        return;
    }

    const currentScheme = schemes[activeSchemeKey];
    if (!currentScheme) {
         console.error(`Scheme ${activeSchemeKey} data not found.`);
         if (loadingIndicator) loadingIndicator.style.display = 'none';
         if (downloadButton) downloadButton.disabled = false;
         alert(`Error: Naming scheme data for '${schemeNames[activeSchemeKey] || activeSchemeKey}' not found.`);
         return;
    }

    // Iterate over scheme slots and add existing files
    const addFilePromises = currentScheme.map(item => {
        return new Promise((resolve) => {
            const token = item.token;
            const file = files[token];

            if (file) {
                const originalName = file.name;
                const extension = originalName.split('.').pop().toLowerCase();
                 const nameParts = originalName.replace(`.${extension}`, '').split(/[._-]/);
                 let potentialBase = nameParts.slice(0, -1).join('_');
                 if (!originalFilenameBase && potentialBase) {
                     originalFilenameBase = potentialBase;
                 } else if (!originalFilenameBase && nameParts.length > 0) {
                     originalFilenameBase = nameParts[0];
                 }
                const safeToken = String(token).replace(/[^a-zA-Z0-9_-]/g, '');
                const safeItemName = item.name.replace(/[^a-zA-Z0-9_-]/g, '_');
                const newFilename = `${safeItemName}_${safeToken}.${extension}`;
                zip.file(newFilename, file);
                filesAddedToZip++;
            }
            resolve();
        });
    });

    // Process ZIP generation
    Promise.all(addFilePromises)
        .then(() => {
            if (filesAddedToZip === 0) {
                 const message = uploadedFilesCount > 0
                    ? "Warning: Images were uploaded, but none matched the slots required by the current naming scheme. No ZIP file generated."
                    : "No images were found to download.";
                 alert(message);
                 if (loadingIndicator) loadingIndicator.style.display = 'none';
                 if (downloadButton) downloadButton.disabled = false;
                 return null; // Indicate no content to generate
            }
            console.log(`Generating ZIP with ${filesAddedToZip} file(s).`);
            return zip.generateAsync({ type: 'blob', compression: "DEFLATE", compressionOptions: { level: 6 } });
        })
        .then(content => {
             if (!content) return; // Stop if no content was generated

             // Hide loading indicator immediately after generation starts
             if (loadingIndicator) loadingIndicator.style.display = 'none';

            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            const zipFilename = `${originalFilenameBase || 'renamed_images'}_${activeSchemeKey}.zip`;
            a.download = zipFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);

            // --- Ask user if they want to clear the grid using a dialog --- 
            setTimeout(() => {
                 // Re-enable the button before showing the potentially blocking dialog
                 if (downloadButton) downloadButton.disabled = false;

                const clearConfirmed = window.confirm("Download complete. Clear the grid?");
                if (clearConfirmed) {
                    console.log("Clearing grid based on user confirmation.");
                    // Recreate the grid for the current scheme (clears files object)
                    const currentActiveSchemeKey = getActiveSchemeKey();
                    if (currentActiveSchemeKey && schemes[currentActiveSchemeKey]) {
                        // Need to clear files explicitly before calling createGrid
                        files = {};
                        createGrid(schemes[currentActiveSchemeKey]); 
                    } else {
                        // Fallback: clear visually and the files object
                        document.getElementById('gridContainer').innerHTML = '';
                        files = {};
                    }
                    // Note: createGrid re-enables the button and hides loader
                }
                // else: If not clearing, the button is already re-enabled above.
            }, 100); // Small delay 

        })
        .catch(error => {
             console.error("Error during ZIP creation or file adding:", error);
             alert(`Error creating ZIP file: ${error.message}`);
             // Ensure UI is reset on error
             if (loadingIndicator) loadingIndicator.style.display = 'none';
             if (downloadButton) downloadButton.disabled = false;
        });
}
