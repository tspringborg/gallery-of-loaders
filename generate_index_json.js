const fs = require('fs');
const path = require('path');

const directoryPath = 'loaders'; // Replace with the path to your directory
const outputFilePath = 'index.json';

// Function to recursively list all folders in a directory
function listFolders(dir) {
    const folders = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            folders.push(file);
            const subFolders = listFolders(filePath);
            if (subFolders.length > 0) {
                folders.push(...subFolders.map(subFolder => path.join(file, subFolder)));
            }
        }
    }

    return folders;
}

// Get the list of folders
const foldersList = listFolders(directoryPath);

// Write the list to a JSON file
fs.writeFileSync(outputFilePath, JSON.stringify(foldersList, null, 2));

console.log(`List of folders written to ${outputFilePath}`);
