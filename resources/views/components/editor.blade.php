<div id="{{ $id }}" class="wweditor-container" data-editor-id="{{ $id }}" style="height: {{ $height }}">
    <div class="editor-header">
        <h1><i class="fas fa-edit"></i> wwEditor</h1>
        <div class="header-actions">
            <button class="btn btn-primary save-btn" data-editor="{{ $id }}">
                <i class="fas fa-save"></i> Zapisz
            </button>
            <button class="btn btn-secondary export-btn" data-editor="{{ $id }}">
                <i class="fas fa-download"></i> Eksportuj
            </button>
        </div>
    </div>

    <div class="editor-toolbar">
        @foreach($toolbar as $item)
            @if($item === '|')
                <div class="toolbar-separator"></div>
            @else
                @if(in_array($item, ['formatBlock', 'fontSize']))
                    <select class="toolbar-select" data-command="{{ $item }}">
                        @if($item === 'formatBlock')
                            <option value="">Format</option>
                            <option value="h1">Nagłówek 1</option>
                            <option value="h2">Nagłówek 2</option>
                            <option value="h3">Nagłówek 3</option>
                            <option value="h4">Nagłówek 4</option>
                            <option value="h5">Nagłówek 5</option>
                            <option value="h6">Nagłówek 6</option>
                            <option value="p">Paragraf</option>
                            <option value="pre">Kod</option>
                        @elseif($item === 'fontSize')
                            <option value="1">Bardzo mały</option>
                            <option value="2">Mały</option>
                            <option value="3" selected>Normalny</option>
                            <option value="4">Średni</option>
                            <option value="5">Duży</option>
                            <option value="6">Bardzo duży</option>
                            <option value="7">Ogromny</option>
                        @endif
                    </select>
                @elseif(in_array($item, ['textColor', 'bgColor']))
                    <input type="color" class="toolbar-color" data-command="{{ $item }}" title="{{ $item === 'textColor' ? 'Kolor tekstu' : 'Kolor tła' }}">
                @else
                    <button class="toolbar-btn" data-command="{{ $item }}" title="{{ $this->getCommandTitle($item) }}">
                        <i class="fas {{ $this->getCommandIcon($item) }}"></i>
                    </button>
                @endif
            @endif
        @endforeach
    </div>

    <div class="editor-modes">
        @foreach($modes as $mode)
            <button class="mode-btn {{ $mode === 'wysiwyg' ? 'active' : '' }}" data-mode="{{ $mode }}">
                <i class="fas {{ $this->getModeIcon($mode) }}"></i> {{ $this->getModeTitle($mode) }}
            </button>
        @endforeach
    </div>

    <div class="editor-content">
        <div class="editor-pane" id="{{ $id }}-wysiwygPane">
            <div id="{{ $id }}-editor" contenteditable="true" class="editor-wysiwyg">
                {!! $content !!}
            </div>
        </div>

        @if(in_array('html', $modes))
        <div class="editor-pane hidden" id="{{ $id }}-htmlPane">
            <textarea id="{{ $id }}-htmlEditor" class="editor-code">{!! htmlspecialchars($content) !!}</textarea>
        </div>
        @endif

        @if(in_array('css', $modes))
        <div class="editor-pane hidden" id="{{ $id }}-cssPane">
            <div class="css-editor">
                <h3>Style CSS</h3>
                <textarea id="{{ $id }}-cssEditor" class="editor-code" placeholder="Wprowadź style CSS...">{{ $css }}</textarea>
                <button class="btn btn-primary apply-css-btn" data-editor="{{ $id }}">Zastosuj CSS</button>
            </div>
        </div>
        @endif

        @if(in_array('preview', $modes))
        <div class="editor-pane hidden" id="{{ $id }}-previewPane">
            <div class="preview-container">
                <h3>Podgląd strony</h3>
                <iframe id="{{ $id }}-previewFrame" class="preview-frame"></iframe>
            </div>
        </div>
        @endif
    </div>

    <div class="status-bar">
        <div class="status-info">
            <span class="word-count">Słowa: 0</span>
            <span class="char-count">Znaki: 0</span>
        </div>
        <div class="status-mode">
            <span class="current-mode">Tryb: WYSIWYG</span>
        </div>
    </div>
</div>

@push('styles')
<link href="{{ asset('vendor/wweditor/css/wweditor.css') }}" rel="stylesheet">
@if(config('wweditor.use_external_libraries', true))
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css" rel="stylesheet">
@endif
@endpush

@push('scripts')
@if(config('wweditor.use_external_libraries', true))
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"></script>
@endif
<script src="{{ asset('vendor/wweditor/js/wweditor.js') }}"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const editor = new WwEditorLaravel('{{ $id }}', {
        autoSave: {{ $autoSave ? 'true' : 'false' }},
        saveUrl: '{{ route('wweditor.save') }}',
        loadUrl: '{{ route('wweditor.load', ':id') }}',
        listUrl: '{{ route('wweditor.list') }}',
        deleteUrl: '{{ route('wweditor.delete', ':id') }}',
        autoSaveInterval: {{ config('wweditor.auto_save_interval', 60) }}
    });
});
</script>
@endpush

{{-- Modals --}}
<div id="{{ $id }}-linkModal" class="modal">
    <div class="modal-content">
        <h3>Wstaw link</h3>
        <input type="text" class="link-url" placeholder="URL linku">
        <input type="text" class="link-text" placeholder="Tekst linku">
        <div class="modal-actions">
            <button class="btn btn-primary insert-link-btn" data-editor="{{ $id }}">Wstaw</button>
            <button class="btn btn-secondary cancel-link-btn" data-editor="{{ $id }}">Anuluj</button>
        </div>
    </div>
</div>

<div id="{{ $id }}-imageModal" class="modal">
    <div class="modal-content">
        <h3>Wstaw obraz</h3>
        <input type="text" class="image-url" placeholder="URL obrazu">
        <input type="text" class="image-alt" placeholder="Tekst alternatywny">
        <input type="number" class="image-width" placeholder="Szerokość (opcjonalnie)">
        <input type="number" class="image-height" placeholder="Wysokość (opcjonalnie)">
        <div class="modal-actions">
            <button class="btn btn-primary insert-image-btn" data-editor="{{ $id }}">Wstaw</button>
            <button class="btn btn-secondary cancel-image-btn" data-editor="{{ $id }}">Anuluj</button>
        </div>
    </div>
</div>

<div id="{{ $id }}-tableModal" class="modal">
    <div class="modal-content">
        <h3>Wstaw tabelę</h3>
        <div class="table-size-selector">
            <label>Ilość wierszy:</label>
            <input type="number" class="table-rows" min="1" max="20" value="3">
            <label>Ilość kolumn:</label>
            <input type="number" class="table-cols" min="1" max="20" value="3">
        </div>
        <div class="modal-actions">
            <button class="btn btn-primary insert-table-btn" data-editor="{{ $id }}">Wstaw</button>
            <button class="btn btn-secondary cancel-table-btn" data-editor="{{ $id }}">Anuluj</button>
        </div>
    </div>
</div>
