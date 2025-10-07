<?php

namespace App\Http\Controllers;

use App\Models\AppFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AppFileCreateController extends Controller
{
    public $methods = ['post'];
    public $route = '/app_file';

    public function __invoke(Request $request)
    {
        // $data = $request->validate([
        //     'name' => ['required'],
        // ]);

        // $entity = AppFile::create($data);
        // return compact(['entity']);

        $scope = new \stdClass;
        $scope->uploads = [];

        foreach ($request->allFiles() as $file) {
            $info = (object) pathinfo($file->getClientOriginalName());
            $info->mime = $file->getMimeType();
            $info->size = $file->getSize();
            $info->md5 = md5($file->get());
            $info->description = $info->filename;
            $info->name = "{$info->md5}.{$info->extension}";

            if ($appFile = AppFile::where('name', $info->name)->first()) {
                $scope->uploads[] = $appFile;
                continue;
            }

            if (Storage::put($info->name, $file->get())) {
                $scope->uploads[] = AppFile::create([
                    'name' => $info->name,
                    'md5' => $info->md5,
                    'mime' => $info->mime,
                    'size' => $info->size,
                    'description' => $info->description,
                ]);
            }
        }

        $scope->files = [];
        // $scope->files = Storage::allFiles();
        // $scope->config = config('filesystems');

        return $scope;
    }

    public function openApiModel()
    {
        return AppFile::class;
    }

    public function openApiData()
    {
        return [
            'tags' => ['app_file'],
        ];
    }

    public function openApiParams()
    {
        return [
            [
                'name' => 'file',
                'in' => 'body',
                'example' => '',
            ],
        ];
    }
}
