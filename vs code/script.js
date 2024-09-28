const files = {}; // This will hold file names and their content
    const folders = {}; // This will hold folder names and their content
    let activeFile = null;

    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "htmlmixed", // Default mode
        theme: "dracula", // VS Code-like Dark Theme
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    });

    // Create a new file
    function createNewFile() {
        const fileName = prompt("Enter file name (with extension):", "newfile.js");
        if (fileName) {
            files[fileName] = '';
            addFileToExplorer(fileName);
            openFile(fileName);
        }
    }

    // Create a new folder
    function createNewFolder() {
        const folderName = prompt("Enter folder name:", "New Folder");
        if (folderName) {
            folders[folderName] = [];
            addFolderToExplorer(folderName);
        }
    }

    // Add a file to the file explorer
    function addFileToExplorer(fileName, folderName = null) {
        const fileList = folderName ? document.getElementById(`folder-${folderName}`).querySelector('ul') : document.getElementById("fileList");
        const li = document.createElement("li");
        const icon = getFileIcon(fileName);
        li.innerHTML = `<img src="${icon}" width="16" height="16"> ${fileName}`;
        li.onclick = () => openFile(fileName);
        fileList.appendChild(li);
    }

    // Add a folder to the file explorer
    function addFolderToExplorer(folderName) {
        const fileList = document.getElementById("fileList");
        const li = document.createElement("li");
        li.className = 'folder';
        li.innerHTML = `<img src="https://img.icons8.com/ios-filled/50/ffffff/folder-invoices.png" width="16" height="16"> ${folderName} <ul></ul>`;
        li.onclick = () => toggleFolder(li);
        li.id = `folder-${folderName}`;
        fileList.appendChild(li);
    }

    // Toggle folder open/close
    function toggleFolder(folderElement) {
        folderElement.classList.toggle('open');
    }

    // Open a file in the editor
    function openFile(fileName) {
        if (activeFile) saveActiveFileContent();
        activeFile = fileName;
        editor.setValue(files[fileName]);
        setEditorMode(fileName);
        updateTabs();
    }

    // Save the content of the currently active file
    function saveActiveFileContent() {
        if (activeFile) {
            files[activeFile] = editor.getValue();
        }
    }

    // Update tabs with the currently opened files
    function updateTabs() {
        const tabsContainer = document.getElementById("tabs");
        tabsContainer.innerHTML = '';

        Object.keys(files).forEach(file => {
            const tab = document.createElement("div");
            tab.className = file === activeFile ? 'active' : '';
            const icon = getFileIcon(file);
            tab.innerHTML = `<img src="${icon}" width="16" height="16"> ${file} <span class="close" onclick="closeTab(event, '${file}')">x</span>`;
            tab.onclick = () => openFile(file);
            tabsContainer.appendChild(tab);
        });
    }

    // Close a tab and remove the file from the list
    function closeTab(event, fileName) {
        event.stopPropagation();
        delete files[fileName];
        if (activeFile === fileName) {
            activeFile = null;
            editor.setValue('');
        }
        updateTabs();
    }

    // Set the editor mode based on file extension
    function setEditorMode(fileName) {
        const fileExtension = fileName.split('.').pop();
        let mode = 'htmlmixed'; // Default mode
        switch (fileExtension) {
            case 'js':
                mode = 'javascript';
                break;
            case 'css':
                mode = 'css';
                break;
            case 'html':
                mode = 'htmlmixed';
                break;
            // Add more cases for different file types if necessary
        }
        editor.setOption('mode', mode);
    }

    // Function to get file icons based on file type
    function getFileIcon(fileName) {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                return 'https://img.icons8.com/color/48/000000/javascript.png';
            case 'css':
                return 'https://img.icons8.com/color/48/css3.png';
            case 'html':
                return 'https://img.icons8.com/color/48/000000/html-5--v1.png';
            // Add more cases for different icons if necessary
            default:
                return 'https://img.icons8.com/ios-filled/50/ffffff/document.png';
        }
    }

    // Run the code - Placeholder for running JavaScript code
    document.getElementById("runCode").onclick = () => {
        if (activeFile && activeFile.endsWith('.js')) {
            const code = editor.getValue();
            try {
                eval(code);
                alert('Code executed successfully');
            } catch (error) {
                alert('Error in code execution: ' + error);
            }
        } else {
            alert('Only JavaScript files can be run');
        }
    };

    // Preview the code - Placeholder for live preview functionality
    document.getElementById("previewCode").onclick = () => {
        if (activeFile && activeFile.endsWith('.html')) {
            const code = editor.getValue();
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(code);
            previewWindow.document.close();
        } else {
            alert('Only HTML files can be previewed');
        }
    };

    // Clean up before the window is closed
    window.onbeforeunload = () => {
        saveActiveFileContent();
    };


    // Function to get the content of the specified file type
function getFileContentByType(extension) {
    let content = '';

    // Iterate through the files object to get all files of the given type
    for (const [fileName, fileContent] of Object.entries(files)) {
        if (fileName.endsWith(extension)) {
            content += fileContent + '\n';
        }
    }

    return content;
}

// Updated Preview Function to include HTML, CSS, and JS
document.getElementById("previewCode").onclick = () => {
    if (activeFile && activeFile.endsWith('.html')) {
        const htmlContent = editor.getValue();
        const cssContent = getFileContentByType('.css');
        const jsContent = getFileContentByType('.js');

        const previewWindow = window.open('', '_blank');
        
        // Construct the full HTML including CSS and JS
        const fullContent = `
            <html>
            <head>
                <style>${cssContent}</style>
            </head>
            <body>
                ${htmlContent}
                <script>${jsContent}<\/script>
            </body>
            </html>
        `;

        previewWindow.document.write(fullContent);
        previewWindow.document.close();
    } else {
        alert('Only HTML files can be previewed');
    }
};
