<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_successfully(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Ahmad Kurniawan',
            'email'                 => 'ahmad@example.com',
            'phone_number'          => '081299887766',
            'password'              => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'name'  => 'Ahmad Kurniawan',
                        'email' => 'ahmad@example.com',
                        'role'  => 'pelanggan',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'ahmad@example.com',
            'role'  => 'pelanggan',
        ]);
    }

    public function test_register_validation_fails_with_indonesian_messages(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => '',
            'email'                 => 'not-an-email',
            'phone_number'          => '',
            'password'              => 'short',
            'password_confirmation' => 'diff',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'errors' => ['name', 'email', 'phone_number', 'password']
            ]);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email'    => 'budi@example.com',
            'password' => bcrypt('password123'),
            'role'     => 'pelanggan',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'budi@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => ['user', 'token']
            ]);
    }

    public function test_login_fails_with_incorrect_password(): void
    {
        User::factory()->create([
            'email'    => 'budi@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'budi@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Kombinasi email dan kata sandi tidak cocok.',
            ]);
    }

    public function test_authenticated_user_can_access_me_and_logout(): void
    {
        $user = User::factory()->create([
            'role' => 'pelanggan',
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        // Test GET /api/auth/me
        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id'    => $user->id,
                    'email' => $user->email,
                ]
            ]);

        // Test POST /api/auth/logout
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}

