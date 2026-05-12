# Laravel wwEditor Package

Zaawansowany edytor treści dla Laravela, podobny do CKEditor, z pełną integracją z frameworkiem.

## Instalacja

### 1. Instalacja przez Composer

```bash
composer require softbery/laravel-wweditor
```

### 2. Publikacja zasobów

```bash
php artisan vendor:publish --tag=wweditor-assets
php artisan vendor:publish --tag=wweditor-config
```

### 3. Dodanie Service Providera

W `config/app.php` dodaj:

```php
'providers' => [
    // ...
    Softbery\WwEditor\WwEditorServiceProvider::class,
],
```

## Podstawowe Użycie

### Użycie w Blade

```php
<x-wweditor::editor 
    id="my-editor" 
    content="<h1>Hello World</h1>" 
    height="500px"
    :auto-save="true"
/>
```

### Użycie w Controller

```php
use Softbery\WwEditor\View\Components\WwEditorComponent;

public function create()
{
    return view('create', [
        'editor' => new WwEditorComponent('content-editor', '', '', '600px')
    ]);
}
```

## Konfiguracja

### Plik konfiguracyjny

Opublikuj plik konfiguracyjny:

```bash
php artisan vendor:publish --tag=wweditor-config
```

Dostosuj `config/wweditor.php`:

```php
return [
    'route_prefix' => 'wweditor',
    'middleware' => ['web'],
    'disk' => 'local',
    'auto_save' => true,
    'auto_save_interval' => 60,
    'theme' => 'default',
];
```

### Zmienne środowiskowe

W `.env`:

```env
WWEDITOR_ROUTE_PREFIX=editor
WWEDITOR_MIDDLEWARE=web,auth
WWEDITOR_DISK=public
WWEDITOR_AUTO_SAVE=true
WWEDITOR_AUTO_SAVE_INTERVAL=60
WWEDITOR_THEME=default
```

## Funkcje

### 📝 Edycja Rich Text (WYSIWYG)
- Formatowanie tekstu (pogrubienie, kursywa, podkreślenie)
- Nagłówki (H1-H6) i style paragrafów
- Listy numerowane i wypunktowane
- Wyrównywanie tekstu
- Wstawianie linków, obrazów i tabel
- Kolory tekstu i tła
- Rozmiary czcionek

### 🎨 Tryby Edycji
- **WYSIWYG** - Podgląd na żywo z edycją wizualną
- **HTML** - Edycja kodu źródłowego HTML z podświetlaniem składni
- **CSS** - Dodawanie niestandardowych stylów CSS
- **Podgląd** - Podgląd finalnego wyglądu strony

### 💾 Zarządzanie Treścią
- Autozapis z konfigurowalnym interwałem
- Zapis w storage Laravela
- Wczytywanie zapisanej treści
- Eksport do pliku HTML
- Licznik słów i znaków

### ⌨️ Skróty Klawiszowe
- `Ctrl/Cmd + S` - Zapisz treść
- `Ctrl/Cmd + B` - Pogrubienie
- `Ctrl/Cmd + I` - Kursywa
- `Ctrl/Cmd + U` - Podkreślenie
- `Ctrl/Cmd + Z` - Cofnij
- `Ctrl/Cmd + Shift + Z` - Ponów

## API

### Endpoints

#### Zapis treści
```http
POST /wweditor/save
Content-Type: application/json

{
    "content": "<h1>Hello</h1>",
    "css": "body { color: red; }",
    "title": "My Content",
    "description": "Content description"
}
```

#### Wczytanie treści
```http
GET /wweditor/load/{id}
```

#### Lista treści
```http
GET /wweditor/list
```

#### Usunięcie treści
```http
DELETE /wweditor/delete/{id}
```

### JavaScript API

```javascript
const editor = new WwEditorLaravel('my-editor', {
    autoSave: true,
    saveUrl: '/wweditor/save',
    loadUrl: '/wweditor/load/:id',
    autoSaveInterval: 60
});

// Zapis treści
editor.saveContent();

// Wczytanie treści
editor.loadContent('content-id');

// Eksport
editor.exportContent();
```

## Dostosowywanie

### Niestandardowy toolbar

```php
<x-wweditor::editor 
    :toolbar="['bold', 'italic', 'underline', '|', 'createLink']"
/>
```

### Wyłączenie trybów

```php
<x-wweditor::editor 
    :modes="['wysiwyg', 'html']"
/>
```

### Niestandardowe style

```css
.wweditor-container {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

## Przykłady

### Prosty formularz

```php
<form method="POST" action="/save">
    @csrf
    <x-wweditor::editor id="content" :auto-save="false"/>
    <button type="submit">Zapisz</button>
</form>
```

### Integracja z modelem

```php
// Controller
public function edit(Post $post)
{
    return view('edit', [
        'post' => $post
    ]);
}

// Blade
<x-wweditor::editor 
    id="content" 
    :content="$post->content"
    :css="$post->css"
/>
```

### Wiele edytorów na jednej stronie

```php
<x-wweditor::editor id="editor1" content="Content 1"/>
<x-wweditor::editor id="editor2" content="Content 2"/>
```

## Wydajność

### Optymalizacja

- Użyj CDN dla bibliotek zewnętrznych
- Włącz kompresję zasobów
- Skonfiguruj cache dla przeglądarki

### CDN vs Local

W `.env`:

```env
WWEDITOR_USE_EXTERNAL_LIBRARIES=true  # CDN
WWEDITOR_USE_EXTERNAL_LIBRARIES=false # Local
```

## Troubleshooting

### Common Issues

1. **Assets nie ładują się**
   ```bash
   php artisan vendor:publish --tag=wweditor-assets
   php artisan optimize:clear
   ```

2. **Autozapis nie działa**
   - Sprawdź CSRF token
   - Upewnij się, że URL jest poprawny

3. **Style CSS nie są stosowane**
   - Sprawdź kolejność ładowania CSS
   - Wyczyść cache przeglądarki

## Licencja

MIT License - Możesz używać tego pakietu w projektach komercyjnych i osobistych.

## Wsparcie

- GitHub Issues: https://github.com/softbery/laravel-wweditor/issues
- Dokumentacja: https://github.com/softbery/laravel-wweditor/wiki
