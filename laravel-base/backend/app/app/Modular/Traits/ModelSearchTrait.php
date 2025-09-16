<?php

namespace App\Modular\Traits;

trait ModelSearchTrait
{
    public static function searchQuery($query)
    {
        return $query;
    }

    public static function searchQueryDefault()
    {
        $query = self::query();
        $query = self::searchQuery($query);
        return $query;
    }

    public static function searchParams()
    {
        return [];
    }

    public static function searchParamsDefault(array $params = [])
    {
        return array_merge([
            'page' => 1,
            'per_page' => 10,
            'order' => 'id:desc',
        ], self::searchParams(), $params);
    }

    public static function searchOptions()
    {
        //
    }

    public static function searchOptionsDefault()
    {
        //
    }

    public static function search(array $data = [])
    {
        $query = self::searchQueryDefault();
        return $query;
    }

    public static function searchPaginated(array $params = [])
    {
        $params = self::searchParamsDefault($params);
        $paginated = self::searchQueryDefault()->paginate($params['per_page'])->toArray();
        return [
            'params' => $params,
            'pagination' => [
                'page' => $params['page'],
                'total' => $paginated['total'],
                'pages' => $paginated['to'],
            ],
            'data' => $paginated['data'],
        ];
    }
}
