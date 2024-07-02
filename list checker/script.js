document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const items = json.flat();
            displayList(items);
        };
        reader.readAsArrayBuffer(file);
    }
}

function displayList(items) {
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';
    items.forEach(item => {
        if (item.trim()) {
            const listItem = createListItem(item);
            listContainer.appendChild(listItem);
        }
    });
    updateTaskCount();
}

function createListItem(item) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            listItem.classList.add('strikethrough');
        } else {
            listItem.classList.remove('strikethrough');
        }
        updateTaskCount();
    });
    listItem.appendChild(checkbox);
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = item;
    textInput.readOnly = true;
    listItem.appendChild(textInput);
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerHTML = '✎';
    editBtn.onclick = function() { editItem(textInput); };
    listItem.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '✖';
    deleteBtn.onclick = function() { removeItem(listItem); };
    listItem.appendChild(deleteBtn);
    return listItem;
}

function addItem() {
    const manualInput = document.getElementById('manualInput');
    const item = manualInput.value.trim();
    if (item) {
        const listContainer = document.getElementById('listContainer');
        const listItem = createListItem(item);
        listContainer.appendChild(listItem);
        manualInput.value = '';
        updateTaskCount();
    }
}

function editItem(input) {
    input.readOnly = false;
    input.focus();
    input.addEventListener('blur', function() {
        input.readOnly = true;
    });
}

function removeItem(item) {
    const listContainer = document.getElementById('listContainer');
    listContainer.removeChild(item);
    updateTaskCount();
}

function deleteSelected() {
    const listContainer = document.getElementById('listContainer');
    const items = listContainer.getElementsByTagName('li');
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const checkbox = item.getElementsByTagName('input')[0];
        if (checkbox.checked) {
            listContainer.removeChild(item);
        }
    }
    updateTaskCount();
}

function updateTaskCount() {
    const listContainer = document.getElementById('listContainer');
    const tasks = listContainer.getElementsByTagName('li').length;
    const completedTasks = listContainer.querySelectorAll('input[type="checkbox"]:checked').length;
    const taskCount = document.getElementById('taskCount');
    taskCount.textContent = `${completedTasks} of ${tasks} tasks done`;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
