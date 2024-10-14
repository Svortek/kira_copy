document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem('username');
    document.getElementById('user-username').innerText = username;

    const repoContainer = document.querySelector('.repo-container');
    const createRepoBtn = document.getElementById('create-repo-btn');
    const createRepoModal = document.getElementById('create-repo-modal');
    const closeCreateRepoBtn = document.getElementById('close-create-repo');
    const createRepoForm = document.getElementById('create-repo-form');
    const workspacePlaceholder = document.querySelector('.workspace-placeholder');
    const fileSidebar = document.getElementById('file-sidebar');
    const repoNameHeader = document.getElementById('repo-name-header');
    const hideFileSidebarBtn = document.getElementById('hide-file-sidebar');
    const editor = document.getElementById('editor');
    const editorContent = document.getElementById('editor-content');
    const editorFileName = document.getElementById('editor-file-name');
    const closeEditorBtn = document.getElementById('close-editor');
    const saveEditorBtn = document.getElementById('save-editor');
    const addFileBtnInside = document.getElementById('add-file-btn-inside');
    const addFileModal = document.getElementById('add-file-modal');
    const closeAddFileBtn = document.getElementById('close-add-file');
    const addFileForm = document.getElementById('add-file-form');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteBtn = document.getElementById('delete-confirm-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const deleteTimer = document.getElementById('delete-timer');
    const userMenu = document.getElementById('user-menu');
    const userUsername = document.getElementById('user-username');
    const settingsLink = document.getElementById('settings-link');
    const logout = document.getElementById('logout');
    const renameModal = document.getElementById('rename-modal');
    const closeRenameModalBtn = document.getElementById('close-rename-modal');
    const renameForm = document.getElementById('rename-form');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const contactTelegramBtn = document.getElementById('contact-telegram-btn');
    const contactDiscordBtn = document.getElementById('contact-discord-btn');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeChangePasswordModalBtn = document.getElementById('close-change-password-modal');
    const changePasswordForm = document.getElementById('change-password-form');

    const repositories = [];
    const maxStorage = 3 * 1024 * 1024 * 1024; 

    createRepoBtn.addEventListener('click', () => {
        createRepoModal.style.display = 'block';
        document.getElementById('repo-name').value = '';
        document.getElementById('repo-directory').value = '';
        document.getElementById('repo-files').value = '';
        document.getElementById('folder-name').innerText = 'No folder selected';
        document.getElementById('file-name').innerText = 'No file selected';
    });

    closeCreateRepoBtn.addEventListener('click', () => {
        createRepoModal.style.display = 'none';
    });

    closeRenameModalBtn.addEventListener('click', () => {
        renameModal.style.display = 'none';
    });

    closeSettingsModalBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    closeChangePasswordModalBtn.addEventListener('click', () => {
        changePasswordModal.style.display = 'none';
    });

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        settingsModal.style.display = 'block';
        document.getElementById('personal-username').innerText = localStorage.getItem('username');
        document.getElementById('personal-email').innerText = 'user@example.com';
    });

    changePasswordBtn.addEventListener('click', () => {
        changePasswordModal.style.display = 'block';
    });

    contactTelegramBtn.addEventListener('click', () => {
        window.location.href = 'https://t.me/RegisterMann';
    });

    contactDiscordBtn.addEventListener('click', () => {
        window.location.href = 'https://discord.gg/a9YNWxxM';
    });

    changePasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Password changed successfully!'); 
        changePasswordModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === createRepoModal) {
            createRepoModal.style.display = 'none';
        }
        if (event.target === confirmDeleteModal) {
            confirmDeleteModal.style.display = 'none';
        }
        if (event.target === addFileModal) {
            addFileModal.style.display = 'none';
        }
        if (event.target === renameModal) {
            renameModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
        }
    });

    document.getElementById('repo-directory').addEventListener('change', (event) => {
        const folderName = event.target.files.length ? event.target.files[0].webkitRelativePath.split('/')[0] : 'No folder selected';
        document.getElementById('folder-name').innerText = folderName;
    });

    document.getElementById('repo-files').addEventListener('change', (event) => {
        const fileName = event.target.files.length ? event.target.files[0].name : 'No file selected';
        document.getElementById('file-name').innerText = fileName;
    });

    createRepoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const repoName = document.getElementById('repo-name').value;
        const repoFiles = document.getElementById('repo-directory').files;
        const additionalFiles = document.getElementById('repo-files').files;

        if (repositories.find(r => r.name === repoName)) {
            alert('A repository with this name already exists. Please choose a different name.');
            return;
        }

        if (repoFiles.length > 0 || additionalFiles.length > 0) {
            const repoItem = document.createElement('div');
            repoItem.classList.add('repo-item');
            repoItem.innerHTML = `
                ${repoName}
                <div>
                    <i class="fas fa-pen rename-icon"></i>
                    <i class="fas fa-download download-icon"></i>
                    <i class="fas fa-trash delete-icon"></i>
                </div>
            `;
            repoItem.addEventListener('click', () => {
                displayRepository(repoName);
            });
            repoItem.querySelector('.download-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadRepository(repoName);
            });
            repoItem.querySelector('.delete-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteModal(() => deleteRepository(repoName, repoItem));
            });
            repoItem.querySelector('.rename-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                showRenameModal(repoName, renameRepo);
            });
            repoContainer.appendChild(repoItem);

            const repo = { name: repoName, files: [] };

            Array.from(repoFiles).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    repo.files.push({ name: file.webkitRelativePath || file.name, content: e.target.result, size: file.size });
                    updateStorageUsage();
                };
                reader.readAsText(file);
            });

            Array.from(additionalFiles).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    repo.files.push({ name: file.name, content: e.target.result, size: file.size });
                    updateStorageUsage();
                };
                reader.readAsText(file);
            });

            repositories.push(repo);
            createRepoModal.style.display = 'none';
        } else {
            alert('Please select files or folders to upload.');
        }
    });

    hideFileSidebarBtn.addEventListener('click', () => {
        fileSidebar.style.display = 'none';
        workspacePlaceholder.style.display = 'block';
        editor.style.display = 'none';
    });

    closeEditorBtn.addEventListener('click', () => {
        editor.style.display = 'none';
        editorContent.value = '';
        const img = editor.querySelector('.editor-image');
        if (img) img.remove();
        const docxViewer = editor.querySelector('.editor-docx');
        if (docxViewer) docxViewer.remove();
    });

    saveEditorBtn.addEventListener('click', () => {
        const filePath = editorFileName.dataset.filePath;
        const repoName = editorFileName.dataset.repoName;
        const repo = repositories.find(r => r.name === repoName);
        const file = repo.files.find(f => f.name === filePath);
        file.content = editorContent.value;
        alert('Changes saved!');
    });

    addFileBtnInside.addEventListener('click', () => {
        addFileModal.style.display = 'block';
        addFileModal.dataset.currentFolder = '';
        document.getElementById('new-folder').value = '';
        document.getElementById('new-file').value = '';
        document.getElementById('new-folder-name').innerText = 'No folder selected';
        document.getElementById('new-file-name').innerText = 'No file selected';
    });

    closeAddFileBtn.addEventListener('click', () => {
        addFileModal.style.display = 'none';
    });

    document.getElementById('new-folder').addEventListener('change', (event) => {
        const folderName = event.target.files.length ? event.target.files[0].webkitRelativePath.split('/')[0] : 'No folder selected';
        document.getElementById('new-folder-name').innerText = folderName;
    });

    document.getElementById('new-file').addEventListener('change', (event) => {
        const fileName = event.target.files.length ? event.target.files[0].name : 'No file selected';
        document.getElementById('new-file-name').innerText = fileName;
    });

    addFileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const currentFolder = addFileModal.dataset.currentFolder || '';
        const repoName = repoNameHeader.innerText;
        const repo = repositories.find(r => r.name === repoName);

        const newFolder = document.getElementById('new-folder').files;
        const newFiles = document.getElementById('new-file').files;

        if (newFolder.length > 0 || newFiles.length > 0) {
            Array.from(newFolder).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const filePath = `${currentFolder}${currentFolder ? '/' : ''}${file.webkitRelativePath || file.name}`;
                    repo.files.push({ name: filePath, content: e.target.result, size: file.size });
                    displayRepository(repoName);
                    updateStorageUsage();
                };
                reader.readAsText(file);
            });

            Array.from(newFiles).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const filePath = `${currentFolder}${currentFolder ? '/' : ''}${file.name}`;
                    repo.files.push({ name: filePath, content: e.target.result, size: file.size });
                    displayRepository(repoName);
                    updateStorageUsage();
                };
                reader.readAsText(file);
            });

            document.getElementById('new-folder').value = '';
            document.getElementById('new-file').value = '';
            document.getElementById('new-folder-name').innerText = 'No folder selected';
            document.getElementById('new-file-name').innerText = 'No file selected';
            
            addFileModal.style.display = 'none';
        } else {
            alert('Please select files or folders to upload.');
        }
    });

    function displayRepository(repoName) {
        workspacePlaceholder.style.display = 'none';
        fileSidebar.style.display = 'block';
        repoNameHeader.innerText = repoName;

        const fileStructure = fileSidebar.querySelector('.file-structure');
        fileStructure.innerHTML = '';

        const repo = repositories.find(r => r.name === repoName);
        if (!repo) return;

        const folderMap = {};

        repo.files.forEach(file => {
            const pathParts = file.name.split('/');
            let currentFolder = fileStructure;

            pathParts.forEach((part, index) => {
                if (index === pathParts.length - 1) {
                    const fileItem = document.createElement('p');
                    fileItem.classList.add('file-item');
                    fileItem.innerHTML = `
                        <span class="file-name">${part}</span>
                        <div class="file-icons">
                            <i class="fas fa-pen rename-icon"></i>
                            <i class="fas fa-trash delete-file-icon"></i>
                        </div>
                    `;
                    fileItem.querySelector('.rename-icon').addEventListener('click', (e) => {
                        e.stopPropagation();
                        showRenameModal(file.name, renameFile);
                    });
                    fileItem.querySelector('.delete-file-icon').addEventListener('click', (e) => {
                        e.stopPropagation();
                        showDeleteModal(() => deleteFile(repoName, file.name, fileItem));
                    });
                    fileItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openEditor(file, repoName);
                    });
                    currentFolder.appendChild(fileItem);
                } else {
                    if (!folderMap[part]) {
                        const folderItem = document.createElement('div');
                        folderItem.classList.add('folder-item');
                        folderItem.innerHTML = `
                            <span class="folder-name">${part}</span>
                            <div>
                                <i class="fas fa-plus add-icon"></i>
                                <i class="fas fa-pen rename-icon"></i>
                                <i class="fas fa-trash delete-file-icon"></i>
                            </div>
                            <div class="folder-contents" style="display: none;"></div>
                        `;
                        folderItem.querySelector('.folder-name').addEventListener('click', () => {
                            const contents = folderItem.querySelector('.folder-contents');
                            contents.style.display = contents.style.display === 'none' ? 'block' : 'none';
                        });
                        folderItem.querySelector('.add-icon').addEventListener('click', (e) => {
                            e.stopPropagation();
                            addFileModal.style.display = 'block';
                            addFileModal.dataset.currentFolder = `${folderItem.querySelector('.folder-name').innerText}`;
                        });
                        folderItem.querySelector('.delete-file-icon').addEventListener('click', (e) => {
                            e.stopPropagation();
                            showDeleteModal(() => deleteFolder(repoName, part, folderItem));
                        });
                        folderItem.querySelector('.rename-icon').addEventListener('click', (e) => {
                            e.stopPropagation();
                            showRenameModal(part, renameFolder);
                        });
                        currentFolder.appendChild(folderItem);
                        folderMap[part] = folderItem.querySelector('.folder-contents');
                    }
                    currentFolder = folderMap[part];
                }
            });
        });
    }

    function openEditor(file, repoName) {
        editor.style.display = 'flex';
        editorFileName.innerHTML = `
            Editing: ${file.name}
        `;
        editorFileName.dataset.filePath = file.name;
        editorFileName.dataset.repoName = repoName;

        if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            editorContent.style.display = 'none';
            const img = document.createElement('img');
            img.src = `data:image;base64,${btoa(file.content)}`;
            img.alt = file.name;
            img.classList.add('editor-image');
            editor.appendChild(img);
        } else if (file.name.match(/\.docx$/i)) {
            editorContent.style.display = 'none';
            const docxViewer = document.createElement('iframe');
            docxViewer.src = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${btoa(file.content)}`;
            docxViewer.classList.add('editor-docx');
            editor.appendChild(docxViewer);
        } else {
            editorContent.style.display = 'block';
            editorContent.value = file.content;
        }
    }

    function downloadRepository(repoName) {
        alert(`Downloading repository: ${repoName}`);
    }

    function deleteRepository(repoName, repoItem) {
        const index = repositories.findIndex(r => r.name === repoName);
        if (index > -1) {
            repositories.splice(index, 1);
            repoItem.remove();
            if (repoNameHeader.innerText === repoName) {
                fileSidebar.style.display = 'none';
                workspacePlaceholder.style.display = 'block';
                editor.style.display = 'none';
                editorContent.value = '';
            }
            confirmDeleteModal.style.display = 'none'; 
            updateStorageUsage();
        }
    }

    function deleteFile(repoName, fileName, fileItem) {
        const repo = repositories.find(r => r.name === repoName);
        const fileIndex = repo.files.findIndex(f => f.name === fileName);
        if (fileIndex > -1) {
            repo.files.splice(fileIndex, 1);
            fileItem.remove(); 
            if (editorFileName.dataset.filePath === fileName && editorFileName.dataset.repoName === repoName) {
                editor.style.display = 'none';
                editorContent.value = '';
            }
            confirmDeleteModal.style.display = 'none'; 
            updateStorageUsage();
        }
    }

    function deleteFolder(repoName, folderName, folderItem) {
        const repo = repositories.find(r => r.name === repoName);
        repo.files = repo.files.filter(f => !f.name.startsWith(folderName));
        folderItem.remove();
        if (editorFileName.dataset.filePath.startsWith(folderName) && editorFileName.dataset.repoName === repoName) {
            editor.style.display = 'none';
            editorContent.value = '';
        }
        confirmDeleteModal.style.display = 'none'; 
        updateStorageUsage();
    }

    function showDeleteModal(deleteCallback) {
        confirmDeleteModal.style.display = 'block';
        confirmDeleteBtn.classList.add('btn-disabled');
        confirmDeleteBtn.disabled = true;

        let timer = 5;
        deleteTimer.innerText = timer;

        const interval = setInterval(() => {
            timer -= 1;
            deleteTimer.innerText = timer;
            if (timer === 0) {
                clearInterval(interval);
                confirmDeleteBtn.classList.remove('btn-disabled');
                confirmDeleteBtn.disabled = false;
            }
        }, 1000);

        confirmDeleteBtn.onclick = () => {
            deleteCallback();
            confirmDeleteModal.style.display = 'none';
        };

        cancelDeleteBtn.onclick = () => {
            confirmDeleteModal.style.display = 'none';
        };
    }

    function showRenameModal(currentName, renameCallback) {
        renameModal.style.display = 'block';
        const renameInput = document.getElementById('rename-input');
        renameInput.value = currentName.split('/').pop();

        renameForm.onsubmit = (event) => {
            event.preventDefault();
            const newName = renameInput.value;
            if (currentName.includes('/') !== newName.includes('/')) {
                alert('Cannot change type of item. Use a valid name.');
                return;
            }
            renameCallback(currentName, newName);
            renameModal.style.display = 'none';
        };
    }

    function renameRepo(oldName, newName) {
        const repo = repositories.find(r => r.name === oldName);
        if (repo) {
            repo.name = newName;
            displayRepositories();
            if (repoNameHeader.innerText === oldName) {
                repoNameHeader.innerText = newName;
            }
        }
    }

    function renameFile(oldName, newName) {
        const repoName = repoNameHeader.innerText;
        const repo = repositories.find(r => r.name === repoName);
        const file = repo.files.find(f => f.name === oldName);
        if (file) {
            const pathParts = oldName.split('/');
            pathParts.pop();
            pathParts.push(newName);
            file.name = pathParts.join('/');
            displayRepository(repoName);
            if (editorFileName.dataset.filePath === oldName && editorFileName.dataset.repoName === repoName) {
                editorFileName.innerHTML = `
                    Editing: ${file.name}
                `;
                editorFileName.dataset.filePath = file.name;
            }
        }
    }

    function renameFolder(oldName, newName) {
        const repoName = repoNameHeader.innerText;
        const repo = repositories.find(r => r.name === repoName);
        repo.files.forEach(file => {
            if (file.name.startsWith(oldName)) {
                file.name = file.name.replace(oldName, newName);
            }
        });
        displayRepository(repoName);
    }

    function displayRepositories() {
        repoContainer.innerHTML = '';
        repositories.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.classList.add('repo-item');
            repoItem.innerHTML = `
                ${repo.name}
                <div>
                    <i class="fas fa-pen rename-icon"></i>
                    <i class="fas fa-download download-icon"></i>
                    <i class="fas fa-trash delete-icon"></i>
                </div>
            `;
            repoItem.addEventListener('click', () => {
                displayRepository(repo.name);
            });
            repoItem.querySelector('.download-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadRepository(repo.name);
            });
            repoItem.querySelector('.delete-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteModal(() => deleteRepository(repo.name, repoItem));
            });
            repoItem.querySelector('.rename-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                showRenameModal(repo.name, renameRepo);
            });
            repoContainer.appendChild(repoItem);
        });
    }

    userUsername.addEventListener('click', (event) => {
        event.stopPropagation();
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });

    logout.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    window.addEventListener('click', (event) => {
        if (event.target !== userUsername && !userMenu.contains(event.target)) {
            userMenu.style.display = 'none';
        }
    });

    function updateStorageUsage() {
        let totalSize = 0;
        repositories.forEach(repo => {
            repo.files.forEach(file => {
                totalSize += file.size;
            });
        });

        const storageFill = document.querySelector('.storage-fill');
        const storageText = document.querySelector('.storage-text');
        const usedGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
        const usedPercentage = (totalSize / maxStorage) * 100;

        storageFill.style.width = `${usedPercentage}%`;
        storageText.innerText = `${usedGB} GB of 3 GB used`;
    }
});
