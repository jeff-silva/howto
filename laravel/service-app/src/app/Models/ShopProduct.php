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
    new OA\Property(property: 'price', type: 'number', format: 'float', description: 'Preço original do produto', example: 1799.00),
    new OA\Property(property: 'promo_price', type: 'number', format: 'float', nullable: true, description: 'Preço promocional do produto (se houver)', example: 1528.97),
    new OA\Property(property: 'promo_start', type: 'string', format: 'date', nullable: true, description: 'Data de início da promoção', example: '2026-05-28'),
    new OA\Property(property: 'promo_final', type: 'string', format: 'date', nullable: true, description: 'Data de término da promoção', example: '2026-06-10'),
    new OA\Property(property: 'image', type: 'string', description: 'URL da imagem do produto', example: 'https://loremflickr.com/500/500/motorola,smartphone?lock=0'),
    new OA\Property(property: 'description', type: 'string', description: 'Descrição detalhada do produto', example: 'O Motorola Moto G84 5G oferece fotos ultra nítidas...'),
    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', description: 'Data de criação do registro'),
    new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', description: 'Data de atualização do registro')
  ]
)]

class ShopProduct extends Model
{
  protected $table = 'shop_product';
  protected $primaryKey = 'id';
  protected $keyType = 'int';

  protected $fillable = [
    'name',
    'price',
    'promo_price',
    'promo_start',
    'promo_final',
    'image',
    'description',
    'embedding',
    'embedding_text',
  ];

  protected $casts = [
    'price' => 'float',
    'promo_price' => 'float',
    'promo_start' => 'date',
    'promo_final' => 'date',
  ];

  protected $hidden = [
    'embedding',
    'embedding_text',
  ];
}
