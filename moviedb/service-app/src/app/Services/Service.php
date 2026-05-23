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
        $model = $this->model->firstOrNew(['id' => $data->id], $data->toArray());
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

    // public function select(string $id, array $params = [], $default = null)
    // {
    //   dd($this);
    //   if (!property_exists($this, 'model')) return null;
    //   $params['only'] = $id;
    //   return FactoryStageSearch::first($params) ?? $default;
    // }

    protected function searchExport($query, $params, $options)
    {
        $headers = [];
        foreach ($this->model->getFillable() as $field) {
            $headers[$field] = $field;
        }
        $download_data = [$headers];

        foreach ($query->get() as $item) {
            $item_data = [];
            foreach ($this->model->getFillable() as $field) {
                $item_data[$field] = $item->$field;
            }
            $download_data[] = $item_data;
        }

        return $download_data;
    }
}
