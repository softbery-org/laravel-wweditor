<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel wwEditor - Przykład</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @stack('styles')
</head>
<body>
    <div class="container">
        <h1>Laravel wwEditor - Przykład Użycia</h1>
        
        <div class="example-section">
            <h2>Podstawowy edytor</h2>
            <x-wweditor::editor 
                id="basic-editor" 
                content="<h2>Przykładowa treść</h2><p>To jest podstawowy edytor wwEditor zintegrowany z Laravel.</p>"
                height="400px"
            />
        </div>

        <div class="example-section">
            <h2>Edytor z autozapisem</h2>
            <x-wweditor::editor 
                id="auto-save-editor" 
                content="<h2>Edytor z autozapisem</h2><p>Ten edytor automatycznie zapisuje treść co 60 sekund.</p>"
                :auto-save="true"
                height="400px"
            />
        </div>

        <div class="example-section">
            <h2>Edytor z niestandardowym toolbar</h2>
            <x-wweditor::editor 
                id="custom-toolbar-editor" 
                content="<h2>Niestandardowy toolbar</h2><p>Ten edytor ma ograniczony toolbar do podstawowych funkcji.</p>"
                :toolbar="['bold', 'italic', 'underline', '|', 'createLink', 'insertImage']"
                height="300px"
            />
        </div>

        <div class="example-section">
            <h2>Edytor tylko WYSIWYG i HTML</h2>
            <x-wweditor::editor 
                id="limited-modes-editor" 
                content="<h2>Ograniczone tryby</h2><p>Ten edytor ma tylko tryby WYSIWYG i HTML.</p>"
                :modes="['wysiwyg', 'html']"
                height="300px"
            />
        </div>
    </div>

    @stack('scripts')

    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .example-section {
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
        }
        
        .example-section:last-child {
            border-bottom: none;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 40px;
        }
        
        h2 {
            color: #34495e;
            margin-bottom: 20px;
        }
    </style>
</body>
</html>
