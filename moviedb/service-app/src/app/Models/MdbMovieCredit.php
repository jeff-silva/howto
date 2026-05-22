<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'MdbMovieCredit',
    title: 'MdbMovieCredit',
    description: 'Representa os créditos (elenco e equipe) de um filme',
    properties: [
        new OA\Property(property: 'movie_id', type: 'integer', description: 'ID do filme (chave primária e estrangeira)', example: 19995),
        new OA\Property(property: 'title', type: 'string', description: 'Título do filme', example: 'Avatar'),
        new OA\Property(property: 'cast', type: 'array', items: new OA\Items(type: 'object'), description: 'Atores do elenco (formato JSONB)'),
        new OA\Property(property: 'crew', type: 'array', items: new OA\Items(type: 'object'), description: 'Equipe técnica (formato JSONB)'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', description: 'Data de criação do registro')
    ]
)]
class MdbMovieCredit extends Model
{
    protected $table = 'mdb_movie_credit';
    protected $primaryKey = 'movie_id';
    public $incrementing = false;
    protected $keyType = 'int';

    const UPDATED_AT = null;

    protected $fillable = [
        'movie_id',
        'title',
        'cast',
        'crew',
    ];

    protected $casts = [
        'movie_id' => 'integer',
        'cast' => 'array',
        'crew' => 'array',
    ];

    // Relacionamento com o filme
    public function movie()
    {
        return $this->belongsTo(MdbMovie::class, 'movie_id', 'id');
    }
}
