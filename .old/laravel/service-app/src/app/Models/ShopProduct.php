<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
  schema: 'ShopProduct',
  title: 'ShopProduct',
  description: 'Representa um produto do e-commerce',
  properties: [
    new OA\Property(property: 'id', type: 'integer', description: 'ID único do produto', example: 1),
    new OA\Property(property: 'name', type: 'string', description: 'Nome do produto', example: 'Smartphone Motorola Moto G84 5G 256GB'),
    new OA\Property(property: 'description', type: 'string', description: 'Descrição detalhada do produto', example: 'O Motorola Moto G84 5G oferece fotos ultra nítidas...'),
    new OA\Property(property: 'image', type: 'string', description: 'URL da imagem principal do produto', example: 'https://m.media-amazon.com/images/I/71cWJvVGYtL._SL1500_.jpg'),
    new OA\Property(property: 'price', type: 'number', format: 'float', nullable: true, description: 'Preço original do produto', example: 1799.00),
    new OA\Property(property: 'promotional_price', type: 'number', format: 'float', nullable: true, description: 'Preço promocional do produto', example: 1528.97),
    new OA\Property(property: 'rating', type: 'number', format: 'float', nullable: true, description: 'Avaliação média do produto', example: 4.8),
    new OA\Property(property: 'categories', type: 'array', items: new OA\Items(type: 'string'), description: 'Lista de categorias do produto', example: ['Eletrônicos', 'Smartphones']),
    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', description: 'Data de criação do registro')
  ]
)]
class ShopProduct extends Model
{
  protected $table = 'shop_product';
  protected $primaryKey = 'id';
  protected $keyType = 'int';

  // O Supabase tem apenas o created_at, então desativamos o updated_at no Laravel
  const UPDATED_AT = null;
  public $timestamps = true;

  protected $fillable = [
    'name',
    'description',
    'image',
    'price',
    'promotional_price',
    'rating',
    'categories',
    'embedding',
    'embedding_text',
  ];

  protected $casts = [
    'price' => 'float',
    'promotional_price' => 'float',
    'rating' => 'float',
    'categories' => 'array',
  ];

  protected $hidden = [
    'embedding',
    'embedding_text',
  ];
}
