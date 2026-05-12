class WwEditorLaravel {
    constructor(editorId, options = {}) {
        this.editorId = editorId;
        this.options = {
            autoSave: options.autoSave || false,
            saveUrl: options.saveUrl || '/wweditor/save',
            loadUrl: options.loadUrl || '/wweditor/load/:id',
            listUrl: options.listUrl || '/wweditor/list',
            deleteUrl: options.deleteUrl || '/wweditor/delete/:id',
            autoSaveInterval: options.autoSaveInterval || 60,
            ...options
        };
        
        this.editor = null;
        this.htmlEditor = null;
        this.cssEditor = null;
        this.currentMode = 'wysiwyg';
        this.customCSS = '';
        this.autoSaveTimer = null;
        this.contentId = null;
        
        this.init();
    }

    init() {
        this.setupEditors();
        this.setupToolbar();
        this.setupModeSwitching();
        this.setupModals();
        this.setupEventListeners();
        this.setupAutoSave();
        this.updateWordCount();
    }

    setupEditors() {
        const container = document.getElementById(this.editorId);
        this.editor = container.querySelector(`#${this.editorId}-editor`);
        
        this.htmlEditor = CodeMirror.fromTextArea(container.querySelector(`#${this.editorId}-htmlEditor`), {
            mode: 'htmlmixed',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });

        this.cssEditor = CodeMirror.fromTextArea(container.querySelector(`#${this.editorId}-cssEditor`), {
            mode: 'css',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true
        });

        this.htmlEditor.on('change', () => {
            this.editor.innerHTML = this.htmlEditor.getValue();
            this.updateWordCount();
        });

        this.cssEditor.on('change', () => {
            this.customCSS = this.cssEditor.getValue();
        });
    }

    setupToolbar() {
        const container = document.getElementById(this.editorId);
        const toolbar = container.querySelector('.editor-toolbar');
        
        toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeCommand(command);
            });
        });

        toolbar.querySelectorAll('.toolbar-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const command = select.dataset.command;
                if (command === 'formatBlock') {
                    document.execCommand('formatBlock', false, e.target.value);
                } else if (command === 'fontSize') {
                    document.execCommand('fontSize', false, e.target.value);
                }
            });
        });

        toolbar.querySelectorAll('.toolbar-color').forEach(input => {
            input.addEventListener('change', (e) => {
                const command = input.dataset.command;
                if (command === 'textColor') {
                    document.execCommand('foreColor', false, e.target.value);
                } else if (command === 'bgColor') {
                    document.execCommand('hiliteColor', false, e.target.value);
                }
            });
        });
    }

    setupModeSwitching() {
        const container = document.getElementById(this.editorId);
        const modeBtns = container.querySelectorAll('.mode-btn');
        
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchMode(mode);
                
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchMode(mode) {
        const container = document.getElementById(this.editorId);
        const panes = {
            wysiwyg: `${this.editorId}-wysiwygPane`,
            html: `${this.editorId}-htmlPane`,
            css: `${this.editorId}-cssPane`,
            preview: `${this.editorId}-previewPane`
        };

        Object.values(panes).forEach(paneId => {
            const pane = container.querySelector(`#${paneId}`);
            if (pane) pane.classList.add('hidden');
        });

        const activePane = container.querySelector(`#${panes[mode]}`);
        if (activePane) activePane.classList.remove('hidden');

        if (mode === 'html' && this.htmlEditor) {
            this.htmlEditor.setValue(this.editor.innerHTML);
        } else if (mode === 'preview') {
            this.updatePreview();
        }

        this.currentMode = mode;
        const statusMode = container.querySelector('.current-mode');
        if (statusMode) {
            statusMode.textContent = `Tryb: ${mode.toUpperCase()}`;
        }
    }

    setupModals() {
        this.setupLinkModal();
        this.setupImageModal();
        this.setupTableModal();
    }

    setupLinkModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-linkModal`);
        const insertBtn = container.querySelector('.insert-link-btn');
        const cancelBtn = container.querySelector('.cancel-link-btn');

        insertBtn.addEventListener('click', () => {
            const url = modal.querySelector('.link-url').value;
            const text = modal.querySelector('.link-text').value;
            
            if (url) {
                const selection = window.getSelection();
                const linkText = text || selection.toString() || url;
                const link = `<a href="${url}" target="_blank">${linkText}</a>`;
                document.execCommand('insertHTML', false, link);
            }
            
            this.closeModal(modal);
        });

        cancelBtn.addEventListener('click', () => this.closeModal(modal));
    }

    setupImageModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-imageModal`);
        const insertBtn = container.querySelector('.insert-image-btn');
        const cancelBtn = container.querySelector('.cancel-image-btn');

        insertBtn.addEventListener('click', () => {
            const url = modal.querySelector('.image-url').value;
            const alt = modal.querySelector('.image-alt').value;
            const width = modal.querySelector('.image-width').value;
            const height = modal.querySelector('.image-height').value;
            
            if (url) {
                let img = `<img src="${url}" alt="${alt || ''}"`;
                if (width) img += ` width="${width}"`;
                if (height) img += ` height="${height}"`;
                img += ' style="max-width: 100%; height: auto;"';
                img += '>';
                document.execCommand('insertHTML', false, img);
            }
            
            this.closeModal(modal);
        });

        cancelBtn.addEventListener('click', () => this.closeModal(modal));
    }

    setupTableModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-tableModal`);
        const insertBtn = container.querySelector('.insert-table-btn');
        const cancelBtn = container.querySelector('.cancel-table-btn');

        insertBtn.addEventListener('click', () => {
            const rows = parseInt(modal.querySelector('.table-rows').value);
            const cols = parseInt(modal.querySelector('.table-cols').value);
            
            let table = '<table style="border-collapse: collapse; width: 100%;">';
            
            for (let i = 0; i < rows; i++) {
                table += '<tr>';
                for (let j = 0; j < cols; j++) {
                    table += '<td style="border: 1px solid #ddd; padding: 8px;">Komórka ' + (i + 1) + '-' + (j + 1) + '</td>';
                }
                table += '</tr>';
            }
            
            table += '</table><br>';
            document.execCommand('insertHTML', false, table);
            
            this.closeModal(modal);
        });

        cancelBtn.addEventListener('click', () => this.closeModal(modal));
    }

    setupEventListeners() {
        this.editor.addEventListener('input', () => {
            this.updateWordCount();
        });

        this.editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
            document.execCommand('insertHTML', false, text);
            this.updateWordCount();
        });

        const container = document.getElementById(this.editorId);
        const saveBtn = container.querySelector('.save-btn');
        const exportBtn = container.querySelector('.export-btn');
        const applyCssBtn = container.querySelector('.apply-css-btn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveContent();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportContent();
            });
        }

        if (applyCssBtn) {
            applyCssBtn.addEventListener('click', () => {
                this.applyCustomCSS();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveContent();
                        break;
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline');
                        break;
                    case 'z':
                        if (e.shiftKey) {
                            e.preventDefault();
                            document.execCommand('redo');
                        }
                        break;
                }
            }
        });
    }

    setupAutoSave() {
        if (this.options.autoSave) {
            this.autoSaveTimer = setInterval(() => {
                this.saveContent(true);
            }, this.options.autoSaveInterval * 1000);
        }
    }

    executeCommand(command) {
        switch(command) {
            case 'createLink':
                this.showLinkModal();
                break;
            case 'insertImage':
                this.showImageModal();
                break;
            case 'insertTable':
                this.showTableModal();
                break;
            case 'undo':
                document.execCommand('undo');
                break;
            case 'redo':
                document.execCommand('redo');
                break;
            default:
                document.execCommand(command, false, null);
        }
        
        this.editor.focus();
        this.updateWordCount();
    }

    showLinkModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-linkModal`);
        const selection = window.getSelection().toString();
        modal.querySelector('.link-text').value = selection;
        modal.classList.add('show');
    }

    showImageModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-imageModal`);
        modal.classList.add('show');
    }

    showTableModal() {
        const container = document.getElementById(this.editorId);
        const modal = container.querySelector(`#${this.editorId}-tableModal`);
        modal.classList.add('show');
    }

    closeModal(modal) {
        modal.classList.remove('show');
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
    }

    updateWordCount() {
        const text = this.editor.innerText || this.editor.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        
        const container = document.getElementById(this.editorId);
        const wordCount = container.querySelector('.word-count');
        const charCount = container.querySelector('.char-count');
        
        if (wordCount) wordCount.textContent = `Słowa: ${words}`;
        if (charCount) charCount.textContent = `Znaki: ${chars}`;
    }

    updatePreview() {
        const container = document.getElementById(this.editorId);
        const iframe = container.querySelector(`#${this.editorId}-previewFrame`);
        const content = this.editor.innerHTML;
        const css = this.customCSS || '';
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    ${css}
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
        
        iframe.srcdoc = html;
    }

    applyCustomCSS() {
        const styleElement = document.getElementById(`${this.editorId}-customStyles`) || document.createElement('style');
        styleElement.id = `${this.editorId}-customStyles`;
        styleElement.textContent = this.customCSS;
        
        if (!document.getElementById(`${this.editorId}-customStyles`)) {
            document.head.appendChild(styleElement);
        }
        
        this.showNotification('Style CSS zostały zastosowane');
    }

    async saveContent(silent = false) {
        try {
            const content = {
                id: this.contentId || null,
                content: this.editor.innerHTML,
                css: this.customCSS,
                title: 'Editor Content',
                description: 'Content created with wwEditor'
            };

            const response = await fetch(this.options.saveUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify(content)
            });

            const result = await response.json();
            
            if (result.success) {
                this.contentId = result.data.id;
                if (!silent) {
                    this.showNotification('Treść została zapisana');
                }
            } else {
                this.showNotification('Błąd podczas zapisu', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Błąd podczas zapisu', 'error');
        }
    }

    async loadContent(id) {
        try {
            const url = this.options.loadUrl.replace(':id', id);
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                const data = result.data;
                this.editor.innerHTML = data.content;
                this.customCSS = data.css || '';
                this.contentId = data.id;
                
                if (this.cssEditor) {
                    this.cssEditor.setValue(this.customCSS);
                }
                
                this.updateWordCount();
                this.showNotification('Treść została wczytana');
            } else {
                this.showNotification('Nie znaleziono treści', 'error');
            }
        } catch (error) {
            console.error('Load error:', error);
            this.showNotification('Błąd podczas wczytywania', 'error');
        }
    }

    exportContent() {
        const content = this.editor.innerHTML;
        const css = this.customCSS;
        
        let exportContent = '';
        if (css) {
            exportContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        ${css}
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
        } else {
            exportContent = content;
        }
        
        const blob = new Blob([exportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wweditor-content-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Treść została wyeksportowana');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        if (this.htmlEditor) {
            this.htmlEditor.toTextArea();
        }
        
        if (this.cssEditor) {
            this.cssEditor.toTextArea();
        }
    }
}
