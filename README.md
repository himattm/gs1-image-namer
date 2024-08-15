# GS1 Image Renamer

GS1 Image Renamer is a simple web application that allows you to rename product images based on specific naming schemes. The application supports drag-and-drop functionality, allowing you to upload images, which are then renamed according to predefined schemes. You can download the renamed images as a ZIP file, preserving their original quality and metadata.

## Features

- **Drag-and-Drop Upload:** Easily upload images by dragging and dropping them onto the grid.
- **Custom Naming Schemes:** Switch between different naming schemes using tabs.
- **Image Preview:** See a preview of the images as they are uploaded.
- **Download as ZIP:** Download all renamed images in a single ZIP file.

## Getting Started

You can access the GS1 Image Renamer directly through GitHub Pages at the following URL:

[https://himattm.github.io/gs1-image-namer/](https://himattm.github.io/gs1-image-namer/)

### Usage

1. **Select a Naming Scheme:**
   - Use the tabs at the top of the page to switch between different naming schemes.

2. **Upload Images:**
   - Drag and drop images into the corresponding boxes in the grid. The image preview will replace the text once uploaded.

3. **Download Renamed Images:**
   - After uploading all your images, click the "Download Renamed Images" button to download a ZIP file containing the renamed images.

## Project Structure

- `index.html`: The main HTML file that loads the application.
- `styles.css`: CSS file for styling the application (if any additional styles are used).
- `schemes.js`: JavaScript file containing the naming schemes.
- `script.js`: The main JavaScript file that handles the application logic.
- `README.md`: This file, providing an overview and usage instructions.

## Adding New Schemes

To add new naming schemes, edit the `schemes.js` file. Each scheme is represented as an object with a unique key. The key corresponds to the scheme name, and the value is an array of objects, where each object contains a `token` and a `name`:

```javascript
const schemes = {
    scheme1: [
        { token: "A1C1", name: "Front angle" },
        // ...additional items
    ],
    scheme2: [
        { token: "B1", name: "Perspective 1" },
        // ...additional items
    ]
    // Add new schemes here
};
