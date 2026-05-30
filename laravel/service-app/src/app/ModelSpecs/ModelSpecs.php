<?php

namespace App\ModelSpecs;

use Illuminate\Support\Facades\File;

class ModelSpecs
{
    public $slug;
    public $name;
    public $icon;
    public $active;

    static function specsList()
    {
        $classRef = new \ReflectionClass(static::class);
        $dirname = dirname($classRef->getFileName());
        $namespace = $classRef->getNamespaceName();
        $files = File::files($dirname);
        $items = collect([]);

        foreach ($files as $file) {
            if ($classRef->getFileName() == $file->getRealPath()) continue;
            try {
                $class = app("{$namespace}\\" . $file->getFilenameWithoutExtension());
                $items->push($class);
            } catch (\Exception $e) {
            }
        }

        static::onSpecsList($items);

        return $items->filter(function ($item) {
            if (!$item) return false;
            return $item->active;
        });
    }

    static function make($slug = null)
    {
        if ($slug === null) {
            return app(static::class);
        }

        $item = self::specsList()->firstWhere('slug', $slug);
        if (!$item) throw new \Exception("Item {$slug} não existe.");
        return $item;
    }

    public function __construct()
    {
        $this->init();
    }

    protected function onInit() {}
    protected static function onSpecsList($items)
    {
        return $items;
    }

    protected function init()
    {
        $this->onInit();
    }
}
