<?php

namespace App\ModelSpecs\Search;

use App\Exceptions\ErrorException;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use App\ModelSpecs\ModelSpecs;
use Illuminate\Database\Eloquent\Collection;

class Search extends ModelSpecs
{
    public $model = null;
    public $query = null;

    protected function onInit()
    {
        // dump(get_called_class());
        $this->model = app($this->model);
    }

    public function onQuery($query, $params)
    {
        return $query;
    }

    public function query(array $params = [])
    {
        $params = $this->params($params);

        $query = $this->model->newQuery();
        $query = $this->onQuery($query, $params);

        // Get with relationships
        // ?with=relation1
        // ?with=relation1,relation2
        if ($params->with) {
            $withs = array_filter(explode(',', $params->with));
            foreach ($withs as $with) {
                if (!is_callable([$query, $with])) continue;
                call_user_func([$query, 'with'], $with);
            }
        }

        // Selected
        // ?selected=uuid1,uuid2,uuid3
        if ($selected = $params->selected) {
            $selected = array_filter(explode(',', $selected));

            // Add selected IDs to except
            $except = array_filter(explode(',', $scope->params->except ?? ''));
            foreach ($selected as $id) $except[] = $id;
            $params->except = join(',', $except);
        }

        // Only items by ID or slug
        // ?only=aaa
        // ?only=aaa,bbb
        if ($params->only) {
            $query->where(function ($query) use ($params) {
                $only_items = array_filter(explode(',', $params->only));
                if (empty($only_items)) return;

                foreach ($only_items as $only) {
                    if (Str::isUuid($only)) {
                        $query->orWhere('id', $only);
                    } elseif (in_array('slug', $this->model->getFillable())) {
                        $query->orWhere('slug', $only);
                    }
                }
            });
        }

        // Except items by ID or slug
        // ?except=aaa
        // ?except=aaa,bbb
        if ($params->except) {
            $query->where(function ($query) use ($params) {
                $except = explode(',', $params->except);
                $query->whereNotIn('id', $except);

                if (in_array('slug', $this->model->getFillable())) {
                    $query->orWhereNotIn('slug', $except);
                }
            });
        }

        // Order by
        // ?order=id:desc
        if ($order = $params->order) {
            $order = explode(':', $params->order);
            $query->orderBy($order[0], $order[1]);
        }

        // if ($export = $params->export) {
        //     $data = $this->onExport($query, $params);
        //     $file = \ConverterHelper::from('array', $data)->to($export);
        //     header("Content-Type: {$file->mime}");
        //     header("Content-Transfer-Encoding: Binary");
        //     header("Content-disposition: attachment; filename=\"{$file->name}\"");
        //     echo $file->raw;
        //     // dd($data);
        //     die;
        // }

        return $query;
    }

    public function onParams()
    {
        return [];
    }

    public function params(array $params = [])
    {
        return new Fluent(
            array_merge(
                [
                    'order' => 'id:desc',
                    'page' => 1,
                    'per_page' => 10,
                    'only' => null,
                    'except' => null,
                    'with' => null,
                    'selected' => null,
                ],
                $this->onParams(),
                $params,
            )
        );
    }

    public function options($scope, $params, $query)
    {
        return $scope;
    }

    public function getOptions($params, $query)
    {
        $params = $this->params($params);
        $scope = (object) [];

        $scope->order = collect([
            [
                'id' => 'id:desc',
                'name' => 'Primeiro > Último',
            ],
            [
                'id' => 'id:desc',
                'name' => 'Último > Primeiro',
            ],
            [
                'id' => 'name:asc',
                'name' => 'Alfabética A-Z',
            ],
            [
                'id' => 'name:desc',
                'name' => 'Alfabética Z-A',
            ],
        ]);

        return $this->options($scope, $params, $query);
    }

    public function onExport($query, $params)
    {
        $fields = $query->getModel()->getFillable();
        $data = [$fields];
        foreach ($query->get() as $item) {
            $row = [];
            foreach ($fields as $field) {
                $value = $item->$field;
                if (is_array($value) or is_object($value)) {
                    $value = json_encode($value);
                }
                $row[] = $value;
            }
            $data[] = $row;
        }
        return $data;
    }

    public static function export(array $params = [])
    {
        $instance = static::make();
        $query = $instance->query($params);
        return $instance->onExport($query, $params);
    }

    public static function first(array $params = [], $default = null)
    {
        $instance = static::make();
        $query = $instance->query($params);
        return $query->first() ?? $default;
    }

    public static function firstOrError(array $params = [])
    {
        $entity = static::first($params);
        if (!$entity) throw new ErrorException(404, 'Registro não encontrado');
        return $entity;
    }

    public static function all(array $params = []): Collection
    {
        $instance = static::make();
        $query = $instance->query($params);

        $data = new Collection();

        $params = $instance->params($params);

        // Selected
        // ?selected=uuid1,uuid2,uuid3
        if ($selected = $params->selected) {
            $items = static::all(['only' => $selected]);
            foreach ($items as $item) {
                $data->push($item);
            }
        }

        foreach ($query->get() as $item) {
            $data->push($item);
        }

        return $data;
    }

    public static function count(array $params = [])
    {
        $instance = static::make();
        $query = $instance->query($params);
        return $query->count();
    }

    public static function paginated(array $params = [])
    {
        $scope = new Fluent([
            'pagination' => (object) [
                'results' => 0,
                'pages' => 0,
            ],
            'params' => [],
            'data' => collect([]),
            'options' => collect([]),
        ]);

        $instance = static::make();
        $query = $instance->query($params);
        $scope->options = $instance->getOptions($params, $query);

        $params = $instance->params($params);
        $scope->params = (object) $params->toArray();

        // Selected
        // ?selected=uuid1,uuid2,uuid3
        if ($selected = $params->selected) {
            $items = static::all(['only' => $selected]);
            foreach ($items as $item) {
                $scope->data->push($item);
            }
        }

        $p = $query->paginate($params->per_page);
        $scope->pagination->results = $p->total();
        $scope->pagination->pages = $p->lastPage();

        foreach ($p->items() as $item) {
            $scope->data->push($item);
        }

        return $scope;
    }
}
