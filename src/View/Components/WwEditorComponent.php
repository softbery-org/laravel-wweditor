<?php

namespace Softbery\WwEditor\View\Components;

use Illuminate\View\Component;
use Illuminate\Support\Facades\View;

class WwEditorComponent extends Component
{
    public $id;
    public $content;
    public $css;
    public $height;
    public $toolbar;
    public $modes;
    public $autoSave;
    public $theme;

    public function __construct(
        string $id = 'wweditor',
        string $content = '',
        string $css = '',
        string $height = '600px',
        array $toolbar = [],
        array $modes = ['wysiwyg', 'html', 'css', 'preview'],
        bool $autoSave = true,
        string $theme = 'default'
    ) {
        $this->id = $id;
        $this->content = $content;
        $this->css = $css;
        $this->height = $height;
        $this->toolbar = $toolbar ?: config('wweditor.toolbar', $this->getDefaultToolbar());
        $this->modes = $modes;
        $this->autoSave = $autoSave;
        $this->theme = $theme;
    }

    public function render()
    {
        return View::make('wweditor::components.editor');
    }

    protected function getDefaultToolbar(): array
    {
        return [
            'undo', 'redo', '|',
            'formatBlock', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|',
            'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', '|',
            'createLink', 'insertImage', 'insertTable', 'insertHorizontalRule', '|',
            'fontSize', 'textColor', 'bgColor', '|',
            'removeFormat', 'subscript', 'superscript'
        ];
    }

    public function getCommandTitle($command): string
    {
        $titles = [
            'undo' => 'Cofnij',
            'redo' => 'Ponów',
            'bold' => 'Pogrubienie',
            'italic' => 'Kursywa',
            'underline' => 'Podkreślenie',
            'strikethrough' => 'Przekreślenie',
            'justifyLeft' => 'Wyrównaj do lewej',
            'justifyCenter' => 'Wyśrodkuj',
            'justifyRight' => 'Wyrównaj do prawej',
            'justifyFull' => 'Wyjustuj',
            'insertOrderedList' => 'Lista numerowana',
            'insertUnorderedList' => 'Lista wypunktowana',
            'outdent' => 'Zmniejsz wcięcie',
            'indent' => 'Zwiększ wcięcie',
            'createLink' => 'Wstaw link',
            'insertImage' => 'Wstaw obraz',
            'insertTable' => 'Wstaw tabelę',
            'insertHorizontalRule' => 'Wstaw linię',
            'removeFormat' => 'Usuń formatowanie',
            'subscript' => 'Indeks dolny',
            'superscript' => 'Indeks górny'
        ];

        return $titles[$command] ?? $command;
    }

    public function getCommandIcon($command): string
    {
        $icons = [
            'undo' => 'fa-undo',
            'redo' => 'fa-redo',
            'bold' => 'fa-bold',
            'italic' => 'fa-italic',
            'underline' => 'fa-underline',
            'strikethrough' => 'fa-strikethrough',
            'justifyLeft' => 'fa-align-left',
            'justifyCenter' => 'fa-align-center',
            'justifyRight' => 'fa-align-right',
            'justifyFull' => 'fa-align-justify',
            'insertOrderedList' => 'fa-list-ol',
            'insertUnorderedList' => 'fa-list-ul',
            'outdent' => 'fa-outdent',
            'indent' => 'fa-indent',
            'createLink' => 'fa-link',
            'insertImage' => 'fa-image',
            'insertTable' => 'fa-table',
            'insertHorizontalRule' => 'fa-minus',
            'removeFormat' => 'fa-eraser',
            'subscript' => 'fa-subscript',
            'superscript' => 'fa-superscript'
        ];

        return $icons[$command] ?? 'fa-question';
    }

    public function getModeIcon($mode): string
    {
        $icons = [
            'wysiwyg' => 'fa-eye',
            'html' => 'fa-code',
            'css' => 'fa-palette',
            'preview' => 'fa-desktop'
        ];

        return $icons[$mode] ?? 'fa-question';
    }

    public function getModeTitle($mode): string
    {
        $titles = [
            'wysiwyg' => 'Podgląd',
            'html' => 'HTML',
            'css' => 'CSS',
            'preview' => 'Podgląd strony'
        ];

        return $titles[$mode] ?? $mode;
    }
}
