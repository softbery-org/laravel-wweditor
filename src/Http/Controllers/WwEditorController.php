<?php

namespace Softbery\WwEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class WwEditorController extends Controller
{
    public function assets(Request $request): JsonResponse
    {
        $assets = [
            'css' => asset('vendor/wweditor/css/wweditor.css'),
            'js' => asset('vendor/wweditor/js/wweditor.js'),
            'fonts' => [
                'font-awesome' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                'codemirror' => 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css'
            ],
            'scripts' => [
                'codemirror' => 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js',
                'codemirror-xml' => 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js',
                'codemirror-css' => 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js',
                'codemirror-html' => 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js'
            ]
        ];

        return response()->json($assets);
    }

    public function save(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'css' => 'nullable|string',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'id' => $request->input('id', uniqid('wweditor_')),
            'content' => $request->input('content'),
            'css' => $request->input('css', ''),
            'title' => $request->input('title', 'Untitled'),
            'description' => $request->input('description', ''),
            'created_at' => now(),
            'updated_at' => now()
        ];

        $saved = $this->saveToStorage($data);

        if ($saved) {
            return response()->json([
                'success' => true,
                'message' => 'Content saved successfully',
                'data' => $data
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to save content'
        ], 500);
    }

    public function load($id): JsonResponse
    {
        $content = $this->loadFromStorage($id);

        if ($content) {
            return response()->json([
                'success' => true,
                'data' => $content
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Content not found'
        ], 404);
    }

    public function list(Request $request): JsonResponse
    {
        $contents = $this->listFromStorage();
        
        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    public function delete($id): JsonResponse
    {
        $deleted = $this->deleteFromStorage($id);

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Content deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to delete content'
        ], 500);
    }

    protected function saveToStorage(array $data): bool
    {
        try {
            $storagePath = 'wweditor/contents/' . $data['id'] . '.json';
            Storage::disk(config('wweditor.disk', 'local'))->put($storagePath, json_encode($data));
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function loadFromStorage(string $id): ?array
    {
        try {
            $storagePath = 'wweditor/contents/' . $id . '.json';
            $content = Storage::disk(config('wweditor.disk', 'local'))->get($storagePath);
            return $content ? json_decode($content, true) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function listFromStorage(): array
    {
        try {
            $disk = Storage::disk(config('wweditor.disk', 'local'));
            $files = $disk->files('wweditor/contents');
            $contents = [];

            foreach ($files as $file) {
                if (str_ends_with($file, '.json')) {
                    $content = json_decode($disk->get($file), true);
                    if ($content) {
                        $contents[] = [
                            'id' => $content['id'],
                            'title' => $content['title'],
                            'description' => $content['description'],
                            'created_at' => $content['created_at'],
                            'updated_at' => $content['updated_at']
                        ];
                    }
                }
            }

            return $contents;
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function deleteFromStorage(string $id): bool
    {
        try {
            $storagePath = 'wweditor/contents/' . $id . '.json';
            Storage::disk(config('wweditor.disk', 'local'))->delete($storagePath);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
