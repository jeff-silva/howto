<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'MdbMovie',
    title: 'MdbMovie',
    description: 'Representa um filme da base TMDB',
    properties: [
        new OA\Property(property: 'id', type: 'integer', description: 'ID único do filme', example: 19995),
        new OA\Property(property: 'title', type: 'string', description: 'Título de exibição do filme', example: 'Avatar'),
        new OA\Property(property: 'original_title', type: 'string', description: 'Título original do filme', example: 'Avatar'),
        new OA\Property(property: 'original_language', type: 'string', description: 'Idioma original', example: 'en'),
        new OA\Property(property: 'overview', type: 'string', description: 'Sinopse/Resumo', example: 'In the 22nd century, a paraplegic Marine...'),
        new OA\Property(property: 'tagline', type: 'string', description: 'Slogan/Frase de efeito', example: 'Enter the World of Pandora.'),
        new OA\Property(property: 'status', type: 'string', description: 'Status de lançamento', example: 'Released'),
        new OA\Property(property: 'release_date', type: 'string', format: 'date', description: 'Data de lançamento', example: '2009-12-10'),
        new OA\Property(property: 'runtime', type: 'number', format: 'float', description: 'Tempo de duração em minutos', example: 162.0),
        new OA\Property(property: 'budget', type: 'integer', format: 'int64', description: 'Orçamento do filme', example: 237000000),
        new OA\Property(property: 'revenue', type: 'integer', format: 'int64', description: 'Faturamento do filme', example: 2787965087),
        new OA\Property(property: 'popularity', type: 'number', format: 'float', description: 'Índice de popularidade', example: 150.437),
        new OA\Property(property: 'vote_average', type: 'number', format: 'float', description: 'Média de votos (0 a 10)', example: 7.2),
        new OA\Property(property: 'vote_count', type: 'integer', description: 'Quantidade de votos', example: 11800),
        new OA\Property(property: 'homepage', type: 'string', description: 'Website oficial', example: 'http://www.avatarmovie.com/'),
        new OA\Property(property: 'genres', type: 'array', items: new OA\Items(type: 'object'), description: 'Lista de gêneros (formato JSONB)', example: [['id' => 28, 'name' => 'Action']]),
        new OA\Property(property: 'keywords', type: 'array', items: new OA\Items(type: 'object'), description: 'Palavras-chave (formato JSONB)'),
        new OA\Property(property: 'production_companies', type: 'array', items: new OA\Items(type: 'object'), description: 'Produtoras (formato JSONB)'),
        new OA\Property(property: 'production_countries', type: 'array', items: new OA\Items(type: 'object'), description: 'Países produtores (formato JSONB)'),
        new OA\Property(property: 'spoken_languages', type: 'array', items: new OA\Items(type: 'object'), description: 'Idiomas falados (formato JSONB)'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', description: 'Data de criação do registro')
    ]
)]

class MdbMovie extends Model
{
    protected $table = 'mdb_movie';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    const UPDATED_AT = null;

    protected $fillable = [
        'id',
        'title',
        'original_title',
        'original_language',
        'overview',
        'tagline',
        'status',
        'release_date',
        'runtime',
        'budget',
        'revenue',
        'popularity',
        'vote_average',
        'vote_count',
        'homepage',
        'genres',
        'keywords',
        'production_companies',
        'production_countries',
        'spoken_languages',
        'embedding',
    ];

    protected $casts = [
        'release_date' => 'date',
        'runtime' => 'decimal:1',
        'vote_average' => 'decimal:1',
        'budget' => 'integer',
        'revenue' => 'integer',
        'popularity' => 'float',
        'vote_count' => 'integer',
        'genres' => 'array',
        'keywords' => 'array',
        'production_companies' => 'array',
        'production_countries' => 'array',
        'spoken_languages' => 'array',
    ];

    protected $hidden = [
        'embedding',
    ];

    public function credit()
    {
        return $this->hasOne(MdbMovieCredit::class, 'movie_id', 'id');
    }
}
