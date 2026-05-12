#!/bin/bash

# Laravel 12 wwEditor Installation Script
# This script installs wwEditor package in Laravel 12

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in a Laravel project
check_laravel_project() {
    print_step "Checking if this is a Laravel project..."
    
    if [ ! -f "artisan" ]; then
        print_error "This is not a Laravel project. Please run this script from the root of your Laravel project."
        exit 1
    fi
    
    if [ ! -f "composer.json" ]; then
        print_error "composer.json not found. Please ensure this is a Composer-based project."
        exit 1
    fi
    
    # Check Laravel version
    if command -v php >/dev/null 2>&1; then
        LARAVEL_VERSION=$(php artisan --version | grep -oP 'Laravel Framework \K[0-9]+\.[0-9]+' | head -1)
        if [ -n "$LARAVEL_VERSION" ]; then
            print_status "Laravel version detected: $LARAVEL_VERSION"
            MAJOR_VERSION=$(echo $LARAVEL_VERSION | cut -d. -f1)
            if [ "$MAJOR_VERSION" -lt "9" ]; then
                print_warning "Laravel $LARAVEL_VERSION detected. wwEditor requires Laravel 9.0 or higher."
                read -p "Do you want to continue anyway? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
            fi
        else
            print_warning "Could not detect Laravel version."
        fi
    else
        print_warning "PHP not found in PATH. Cannot verify Laravel version."
    fi
    
    print_status "Laravel project confirmed."
}

# Check PHP requirements
check_php_requirements() {
    print_step "Checking PHP requirements..."
    
    if command -v php >/dev/null 2>&1; then
        PHP_VERSION=$(php -v | head -1 | grep -oP 'PHP \K[0-9]+\.[0-9]+' | head -1)
        if [ -n "$PHP_VERSION" ]; then
            print_status "PHP version detected: $PHP_VERSION"
            MAJOR_VERSION=$(echo $PHP_VERSION | cut -d. -f1)
            MINOR_VERSION=$(echo $PHP_VERSION | cut -d. -f2)
            
            if [ "$MAJOR_VERSION" -lt "8" ] || ([ "$MAJOR_VERSION" -eq "8" ] && [ "$MINOR_VERSION" -lt "0" ]); then
                print_error "PHP 8.0 or higher is required. Found: $PHP_VERSION"
                exit 1
            fi
        else
            print_warning "Could not detect PHP version."
        fi
    else
        print_error "PHP not found. Please install PHP 8.0 or higher."
        exit 1
    fi
    
    # Check required PHP extensions
    REQUIRED_EXTENSIONS=("json" "mbstring" "fileinfo")
    for ext in "${REQUIRED_EXTENSIONS[@]}"; do
        if php -m | grep -q "$ext"; then
            print_status "PHP extension '$ext' is installed."
        else
            print_warning "PHP extension '$ext' is not installed. wwEditor may not work properly."
        fi
    done
}

# Check Composer
check_composer() {
    print_step "Checking Composer..."
    
    if command -v composer >/dev/null 2>&1; then
        COMPOSER_VERSION=$(composer --version | grep -oP 'Composer version \K[0-9]+\.[0-9]+')
        print_status "Composer version detected: $COMPOSER_VERSION"
    else
        print_error "Composer not found. Please install Composer."
        exit 1
    fi
}

# Backup existing files
backup_existing() {
    print_step "Backing up existing files..."
    
    BACKUP_DIR="wweditor-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "config/wweditor.php" ]; then
        cp config/wweditor.php "$BACKUP_DIR/"
        print_status "Backed up config/wweditor.php"
    fi
    
    if [ -d "public/vendor/wweditor" ]; then
        cp -r public/vendor/wweditor "$BACKUP_DIR/"
        print_status "Backed up public/vendor/wweditor"
    fi
    
    if [ -d "resources/views/vendor/wweditor" ]; then
        cp -r resources/views/vendor/wweditor "$BACKUP_DIR/"
        print_status "Backed up resources/views/vendor/wweditor"
    fi
}

# Install the package
install_package() {
    print_step "Installing wwEditor package..."
    
    # Add package to composer.json if not already present
    if ! grep -q "softbery/laravel-wweditor" composer.json; then
        print_status "Adding package to composer.json..."
        composer require softbery/laravel-wweditor
    else
        print_status "Package already in composer.json, updating..."
        composer update softbery/laravel-wweditor
    fi
}

# Publish assets and config
publish_assets() {
    print_step "Publishing wwEditor assets and configuration..."
    
    php artisan vendor:publish --tag=wweditor-assets --force
    print_status "Published wwEditor assets"
    
    php artisan vendor:publish --tag=wweditor-config --force
    print_status "Published wwEditor configuration"
    
    php artisan vendor:publish --tag=wweditor-views --force
    print_status "Published wwEditor views"
}

# Update composer autoload
update_autoload() {
    print_step "Updating Composer autoload..."
    
    composer dump-autoload
    print_status "Updated Composer autoload"
}

# Clear caches
clear_caches() {
    print_step "Clearing Laravel caches..."
    
    php artisan config:clear
    php artisan cache:clear
    php artisan view:clear
    
    if [ -f "bootstrap/cache/config.php" ]; then
        rm bootstrap/cache/config.php
    fi
    
    print_status "Cleared Laravel caches"
}

# Optimize for production
optimize_production() {
    if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
        print_step "Optimizing for production..."
        
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        
        print_status "Optimized for production"
    fi
}

# Create example route
create_example_route() {
    print_step "Creating example route..."
    
    ROUTE_FILE="routes/web.php"
    EXAMPLE_ROUTE="
// wwEditor Example Route
Route::get('/wweditor-example', function () {
    return view('wweditor-example');
})->name('wweditor.example');"
    
    if ! grep -q "wweditor-example" "$ROUTE_FILE"; then
        echo "$EXAMPLE_ROUTE" >> "$ROUTE_FILE"
        print_status "Added example route to routes/web.php"
    else
        print_status "Example route already exists"
    fi
}

# Create example view
create_example_view() {
    print_step "Creating example view..."
    
    VIEW_DIR="resources/views"
    EXAMPLE_VIEW="$VIEW_DIR/wweditor-example.blade.php"
    
    if [ ! -f "$EXAMPLE_VIEW" ]; then
        cat > "$EXAMPLE_VIEW" << 'EOF'
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>wwEditor - Laravel 12 Example</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @stack('styles')
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>wwEditor - Laravel 12 Integration</h1>
            <p>Przykład użycia wwEditor w Laravel 12</p>
        </div>
        
        <div class="editor-section">
            <h2>Podstawowy edytor</h2>
            <x-wweditor::editor 
                id="example-editor" 
                content="<h2>Witaj w wwEditor!</h2><p>To jest przykład integracji wwEditor z Laravel 12.</p>"
                height="500px"
                :auto-save="true"
            />
        </div>
        
        <div class="editor-section">
            <h2>Edytor z niestandardową konfiguracją</h2>
            <x-wweditor::editor 
                id="custom-editor" 
                content="<h2>Edytor niestandardowy</h2><p>Ten edytor ma ograniczony toolbar.</p>"
                :toolbar="['bold', 'italic', 'underline', '|', 'createLink', 'insertImage']"
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
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3498db;
        }
        
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 18px;
        }
        
        .editor-section {
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
        }
        
        .editor-section:last-child {
            border-bottom: none;
        }
        
        .editor-section h2 {
            color: #34495e;
            margin-bottom: 20px;
        }
    </style>
</body>
</html>
EOF
        print_status "Created example view: resources/views/wweditor-example.blade.php"
    else
        print_status "Example view already exists"
    fi
}

# Verify installation
verify_installation() {
    print_step "Verifying installation..."
    
    # Check if config exists
    if [ -f "config/wweditor.php" ]; then
        print_status "✓ Configuration file exists"
    else
        print_error "✗ Configuration file missing"
        return 1
    fi
    
    # Check if assets are published
    if [ -d "public/vendor/wweditor" ]; then
        print_status "✓ Assets published"
    else
        print_error "✗ Assets not published"
        return 1
    fi
    
    # Check if views are published
    if [ -d "resources/views/vendor/wweditor" ]; then
        print_status "✓ Views published"
    else
        print_error "✗ Views not published"
        return 1
    fi
    
    # Check if package is in composer.json
    if grep -q "softbery-org/laravel-wweditor" composer.json; then
        print_status "✓ Package added to composer.json"
    else
        print_error "✗ Package not in composer.json"
        return 1
    fi
    
    print_status "✓ Installation verified successfully!"
    return 0
}

# Show next steps
show_next_steps() {
    echo
    echo -e "${GREEN}Installation completed successfully!${NC}"
    echo
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Add the service provider to config/app.php if not auto-discovered:"
    echo "   'providers' => ["
    echo "       // ..."
    echo "       Softbery\\WwEditor\\WwEditorServiceProvider::class,"
    echo "   ],"
    echo
    echo "2. Visit the example page: http://your-app.test/wweditor-example"
    echo
    echo "3. Use the editor in your Blade templates:"
    echo "   <x-wweditor::editor id=\"content\" height=\"500px\" :auto-save=\"true\"/>"
    echo
    echo "4. Configure the package in config/wweditor.php"
    echo
    echo -e "${YELLOW}Note:${NC} Make sure your storage directory is writable:"
    echo "   chmod -R 775 storage"
    echo "   php artisan storage:link"
    echo
}

# Main installation function
main() {
    echo -e "${GREEN}Laravel 12 wwEditor Installation Script${NC}"
    echo "============================================="
    echo
    
    # Check if running with production flag
    PRODUCTION_FLAG=""
    if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
        PRODUCTION_FLAG="$1"
        print_warning "Running in production mode"
    fi
    
    # Run installation steps
    check_laravel_project
    check_php_requirements
    check_composer
    backup_existing
    install_package
    publish_assets
    update_autoload
    clear_caches
    create_example_route
    create_example_view
    optimize_production "$PRODUCTION_FLAG"
    
    if verify_installation; then
        show_next_steps
    else
        print_error "Installation verification failed. Please check the errors above."
        exit 1
    fi
}

# Show help
show_help() {
    echo "Laravel 12 wwEditor Installation Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -p, --production    Optimize for production"
    echo "  -h, --help         Show this help message"
    echo
    echo "Examples:"
    echo "  $0                  Install for development"
    echo "  $0 --production     Install for production"
    echo
}

# Parse command line arguments
case "$1" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
