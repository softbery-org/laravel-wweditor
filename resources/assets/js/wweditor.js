class WWEditor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.htmlEditor = null;
        this.cssEditor = null;
        this.currentMode = 'wysiwyg';
        this.customCSS = '';
        this.init();
    }

    init() {
        this.setupToolbar();
        this.setupModeSwitching();
        this.setupModals();
        this.setupCodeEditors();
        this.setupEventListeners();
        this.updateWordCount();
        this.setupAutoSave();
    }

    setupToolbar() {
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeCommand(command);
            });
        });

        document.getElementById('formatBlock').addEventListener('change', (e) => {
            document.execCommand('formatBlock', false, e.target.value);
        });

        document.getElementById('fontSize').addEventListener('change', (e) => {
            document.execCommand('fontSize', false, e.target.value);
        });

        document.getElementById('textColor').addEventListener('change', (e) => {
            document.execCommand('foreColor', false, e.target.value);
        });

        document.getElementById('bgColor').addEventListener('change', (e) => {
            document.execCommand('hiliteColor', false, e.target.value);
        });
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

    setupModeSwitching() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchMode(mode);
                
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchMode(mode) {
        const panes = {
            wysiwyg: 'wysiwygPane',
            html: 'htmlPane',
            css: 'cssPane',
            preview: 'previewPane'
        };

        Object.values(panes).forEach(paneId => {
            document.getElementById(paneId).classList.add('hidden');
        });

        document.getElementById(panes[mode]).classList.remove('hidden');

        if (mode === 'html' && this.htmlEditor) {
            this.htmlEditor.setValue(this.editor.innerHTML);
        } else if (mode === 'preview') {
            this.updatePreview();
        }

        this.currentMode = mode;
        document.getElementById('currentMode').textContent = `Tryb: ${mode.toUpperCase()}`;
    }

    setupCodeEditors() {
        this.htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
            mode: 'htmlmixed',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true
        });

        this.cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
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

    setupModals() {
        this.setupLinkModal();
        this.setupImageModal();
        this.setupTableModal();
    }

    setupLinkModal() {
        const modal = document.getElementById('linkModal');
        const linkBtn = document.querySelector('[data-command="createLink"]');
        const insertBtn = document.getElementById('insertLinkBtn');
        const cancelBtn = document.getElementById('cancelLinkBtn');

        insertBtn.addEventListener('click', () => {
            const url = document.getElementById('linkUrl').value;
            const text = document.getElementById('linkText').value;
            
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
        const modal = document.getElementById('imageModal');
        const insertBtn = document.getElementById('insertImageBtn');
        const cancelBtn = document.getElementById('cancelImageBtn');

        insertBtn.addEventListener('click', () => {
            const url = document.getElementById('imageUrl').value;
            const alt = document.getElementById('imageAlt').value;
            const width = document.getElementById('imageWidth').value;
            const height = document.getElementById('imageHeight').value;
            
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
        const modal = document.getElementById('tableModal');
        const insertBtn = document.getElementById('insertTableBtn');
        const cancelBtn = document.getElementById('cancelTableBtn');

        insertBtn.addEventListener('click', () => {
            const rows = parseInt(document.getElementById('tableRows').value);
            const cols = parseInt(document.getElementById('tableCols').value);
            
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

    showLinkModal() {
        const modal = document.getElementById('linkModal');
        const selection = window.getSelection().toString();
        document.getElementById('linkText').value = selection;
        modal.classList.add('show');
    }

    showImageModal() {
        const modal = document.getElementById('imageModal');
        modal.classList.add('show');
    }

    showTableModal() {
        const modal = document.getElementById('tableModal');
        modal.classList.add('show');
    }

    closeModal(modal) {
        modal.classList.remove('show');
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
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

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveContent();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportContent();
        });

        document.getElementById('applyCss').addEventListener('click', () => {
            this.applyCustomCSS();
        });

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

    updateWordCount() {
        const text = this.editor.innerText || this.editor.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        
        document.getElementById('wordCount').textContent = `Słowa: ${words}`;
        document.getElementById('charCount').textContent = `Znaki: ${chars}`;
    }

    updatePreview() {
        const iframe = document.getElementById('previewFrame');
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
        const styleElement = document.getElementById('customStyles') || document.createElement('style');
        styleElement.id = 'customStyles';
        styleElement.textContent = this.customCSS;
        
        if (!document.getElementById('customStyles')) {
            document.head.appendChild(styleElement);
        }
        
        this.showNotification('Style CSS zostały zastosowane');
    }

    saveContent() {
        const content = {
            html: this.editor.innerHTML,
            css: this.customCSS,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('wwEditorContent', JSON.stringify(content));
        this.showNotification('Treść została zapisana');
    }

    loadContent() {
        const saved = localStorage.getItem('wwEditorContent');
        if (saved) {
            const content = JSON.parse(saved);
            this.editor.innerHTML = content.html;
            this.customCSS = content.css || '';
            
            if (this.cssEditor) {
                this.cssEditor.setValue(this.customCSS);
            }
            
            this.updateWordCount();
            this.showNotification('Treść została wczytana');
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
        a.download = `editor-content-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Treść została wyeksportowana');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
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

    setupAutoSave() {
        setInterval(() => {
            this.saveContent();
        }, 60000);
        
        window.addEventListener('beforeunload', () => {
            this.saveContent();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editor = new WWEditor();
    editor.loadContent();
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
