const fileContainer = document.getElementById('fileContainer');
const addFileBtn = document.getElementById('addFileBtn');
const buildBtn = document.getElementById('buildBtn');

// Function to add a new file input
function createFileInput() {
    const div = document.createElement('div');
    div.className = 'fileEntry';
    div.innerHTML = `
        <input type="text" placeholder="Folder/File path (e.g., js/content.js)" class="filePath">
        <textarea placeholder="Code here..." class="fileCode"></textarea>
        <button class="removeBtn">Remove</button>
        <hr>
    `;
    div.querySelector('.removeBtn').onclick = () => div.remove();
    fileContainer.appendChild(div);
}

addFileBtn.onclick = createFileInput;

// Build ZIP and download
buildBtn.onclick = async () => {
    const zip = new JSZip();

    // Create manifest.json
    const manifest = {
        manifest_version: 3,
        name: document.getElementById('extName').value || "My Extension",
        version: document.getElementById('extVersion').value || "1.0.0",
        description: document.getElementById('extDesc').value || "",
        action: { default_popup: "popup.html" },
        permissions: []
    };
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

    // Add user files
    document.querySelectorAll('.fileEntry').forEach(entry => {
        const path = entry.querySelector('.filePath').value.trim();
        const code = entry.querySelector('.fileCode').value;
        if(path) zip.file(path, code);
    });

    // Generate ZIP and trigger download
    const content = await zip.generateAsync({type:"blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "extension.zip";
    link.click();
};
