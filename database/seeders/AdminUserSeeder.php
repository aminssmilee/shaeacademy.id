<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'salisahmad48@gmail.com',
            ],
            [
                'name'     => 'aminsdev',
                'password' => Hash::make('Lemongan123'),
                'role'     => 'admin',
            ]
        );
    }
}
