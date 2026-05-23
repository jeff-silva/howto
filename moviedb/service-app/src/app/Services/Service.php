<?php

namespace App\Services;

use App\Exceptions\ErrorException;
use App\ModelSpecs\Search\FactoryStageSearch;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use Illuminate\Database\Eloquent\Model;

/** @property \Illuminate\Database\Eloquent\Model $model */
abstract class Service
{
    static function make()
    {
        return app(static::class);
    }

    public function __construct()
    {
        if ($this->model) {
            $this->model = app($this->model);
        }
    }

    public function makeModel(array $data = [])
    {
        return $this->model->make($data);
    }

    public function upsertBulk(array $items, array $params = [])
    {
        $return = [];

        foreach ($items as $item) {
            try {
                $return[] = $this->upsert($item, $params);
            } catch (ErrorException $e) {
                $return[] = [
                    'message' => $e->getMessage(),
                    'errors' => $e->errors,
                    'data' => $item,
                ];
            } catch (\Exception $e) {
                $return[] = [
                    'message' => $e->getMessage(),
                    'errors' => [],
                    'data' => $item,
                ];
            }
        }

        return $return;
    }

    public function upsert(array $data = [], array $params = [])
    {
        if (!property_exists($this, 'model')) return null;

        if (isset($data['bulk']) and is_array($data['bulk'])) {
            return $this->upsertBulk($data['bulk'], $params);
        }

        $data = new Fluent($data);

        $model = $this->model->newInstance();
        if ($data->id) {
            $model = $this->model->find($data->id);
        }

        $model->fill($data->toArray())->save();
        return $this->select($model->id, $model);
    }

    public function select(int | string $id, $default = null): null | Model
    {
        if (!property_exists($this, 'model')) return null;
        return $this->model->find($id) ?? $default;
    }

    public function delete(string $id)
    {
        if ($entity = $this->select($id)) {
            $entity->delete();
            return $entity;
        }
        return null;
    }
}
