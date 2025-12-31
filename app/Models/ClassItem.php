<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassItem extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'title',
        'slug',
        'category',
        'topic',
        'price',
        'poster',
        'external_link',
        'status',
        'views',
        'clicks',
    ];
}
