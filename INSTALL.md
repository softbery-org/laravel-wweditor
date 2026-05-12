# Laravel 12 wwEditor Installation Guide

## Szybka Instalacja

### 1. Użyj skryptu instalacyjnego

Najprostszy sposób na zainstalowanie wwEditor w Laravel 12:

```bash
# Pobierz i uruchom skrypt instalacyjny
curl -s https://raw.githubusercontent.com/softbery/laravel-wweditor/main/install.sh | bash

# Lub pobierz skrypt i uruchom ręcznie
wget https://raw.githubusercontent.com/softbery/laravel-wweditor/main/install.sh
chmod +x install.sh
./install.sh
```

### 2. Ręczna instalacja

Jeśli wolisz ręczną instalację:

```bash
# 1. Zainstaluj pakiet
composer require softbery/laravel-wweditor

# 2. Opublikuj zasoby
php artisan vendor:publish --tag=wweditor-assets --force
php artisan vendor:publish --tag=wweditor-config --force
php artisan vendor:publish --tag=wweditor-views --force

# 3. Wyczyść cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# 4. Zaktualizuj autoload
composer dump-autoload
```

## Wymagania Systemowe

- **PHP**: 8.0 lub wyższy
- **Laravel**: 9.0 lub wyższy (zalecany Laravel 12)
- **Composer**: 2.0 lub wyższy
- **Rozszerzenia PHP**: json, mbstring, fileinfo

## Konfiguracja

### 1. Service Provider

W `config/app.php` dodaj:

```php
'providers' => [
    // ...
    Softbery\WwEditor\WwEditorServiceProvider::class,
],
```

### 2. Plik konfiguracyjny

Opublikuj plik konfiguracyjny:

```bash
php artisan vendor:publish --tag=wweditor-config
```

Dostosuj `config/wweditor.php`:

```php
return [
    'route_prefix' => 'wweditor',
    'middleware' => ['web'],
    'auto_save' => true,
    'auto_save_interval' => 60,
    'theme' => 'default',
];
```

### 3. Zmienne środowiskowe

W `.env`:

```env
WWEDITOR_ROUTE_PREFIX=editor
WWEDITOR_MIDDLEWARE=web,auth
WWEDITOR_AUTO_SAVE=true
WWEDITOR_AUTO_SAVE_INTERVAL=60
```

## Użycie

### Podstawowy edytor

```php
<x-wweditor::editor 
    id="content" 
    content="<h1>Hello World</h1>" 
    height="500px"
/>
```

### Edytor z autozapisem

```php
<x-wweditor::editor 
    id="content" 
    :auto-save="true"
    height="600px"
/>
```

### Niestandardowy toolbar

```php
<x-wweditor::editor 
    id="content" 
    :toolbar="['bold', 'italic', 'underline', '|', 'createLink']"
    height="400px"
/>
```

### Ograniczone tryby

```php
<x-wweditor::editor 
    id="content" 
    :modes="['wysiwyg', 'html']"
    height="400px"
/>
```

## Przykład w Controller

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function create()
    {
        return view('posts.create');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'css' => 'nullable|string'
        ]);
        
        Post::create($validated);
        
        return redirect()->route('posts.index');
    }
    
    public function edit(Post $post)
    {
        return view('posts.edit', compact('post'));
    }
    
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'css' => 'nullable|string'
        ]);
        
        $post->update($validated);
        
        return redirect()->route('posts.index');
    }
}
```

## Przykład w Blade

```php
<!-- resources/views/posts/create.blade.php -->
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nowy Post</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @stack('styles')
</head>
<body>
    <form method="POST" action="{{ route('posts.store') }}">
        @csrf
        
        <div class="form-group">
            <label>Tytuł</label>
            <input type="text" name="title" required>
        </div>
        
        <div class="form-group">
            <label>Treść</label>
            <x-wweditor::editor 
                id="post-content" 
                name="content"
                height="500px"
                :auto-save="false"
            />
        </div>
        
        <button type="submit">Zapisz</button>
    </form>

    @stack('scripts')
</body>
</html>
```

## API

### Zapis treści

```javascript
const editor = new WwEditorLaravel('my-editor', {
    autoSave: true,
    saveUrl: '/wweditor/save'
});

// Ręczny zapis
editor.saveContent();
```

### Wczytanie treści

```javascript
// Wczytaj po ID
editor.loadContent('content-id');

// Wczytaj listę
fetch('/wweditor/list')
    .then(response => response.json())
    .then(data => console.log(data));
```

## Troubleshooting

### Common Issues

1. **Assets nie ładują się**
   ```bash
   php artisan vendor:publish --tag=wweditor-assets --force
   php artisan optimize:clear
   ```

2. **Service provider nie działa**
   - Sprawdź `config/app.php`
   - Uruchom `php artisan config:clear`

3. **Autozapis nie działa**
   - Sprawdź CSRF token
   - Sprawdź uprawnienia storage

4. **Błędy uprawnień**
   ```bash
   chmod -R 775 storage
   php artisan storage:link
   ```

### Debugowanie

Włącz tryb debugowania:

```php
// config/wweditor.php
'debug' => env('APP_DEBUG', false),
```

## Produkcja

### Optymalizacja

```bash
# Instalacja dla produkcji
./install.sh --production

# Lub ręcznie
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### CDN vs Local

W `.env`:

```env
WWEDITOR_USE_EXTERNAL_LIBRARIES=true  # CDN
WWEDITOR_USE_EXTERNAL_LIBRARIES=false # Local
```

## Aktualizacja

```bash
# Aktualizacja pakietu
composer update softbery/laravel-wweditor

# Ponowna publikacja zasobów
php artisan vendor:publish --tag=wweditor-assets --force

# Wyczyszczenie cache
php artisan optimize:clear
```

## Odinstalowanie

```bash
# Usuń pakiet
composer remove softbery/laravel-wweditor

# Usuń service provider z config/app.php

# Usuń pliki konfiguracyjne
rm config/wweditor.php

# Usuń zasoby
rm -rf public/vendor/wweditor
rm -rf resources/views/vendor/wweditor

# Wyczyść cache
php artisan optimize:clear
```

## Wsparcie

- **GitHub**: https://github.com/softbery/laravel-wweditor
- **Issues**: https://github.com/softbery/laravel-wweditor/issues
- **Dokumentacja**: https://github.com/softbery/laravel-wweditor/wiki
