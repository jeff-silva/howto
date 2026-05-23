<?php

namespace App\Services;

use App\Models\AppUser;
use App\Exceptions\ErrorException;
use Illuminate\Support\Facades\Http;

class SupabaseService extends Service
{
    public function __construct() {}

    public function request()
    {
        return Http::baseUrl('http://kong:8000')
            ->timeout(120)
            ->withHeaders([
                'apikey' => env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
                // 'Authorization' => 'Bearer ' . env('SERVICE_SUPABASE_ANON_KEY'),
                'Authorization' => 'Bearer ' . env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
                'Content-Type' => 'application/json',
            ]);
    }

    public function embedding(string $text)
    {
        $response = $this->request()->post('/functions/v1/embedding', ['text' => $text]);
        if ($response->successful()) return $response->json('embedding', null);
        return null;
    }

    public function userUpsert(array $data)
    {
        $headers = [
            'apikey' => env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
            'Authorization' => 'Bearer ' . env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
            'Content-Type' => 'application/json',
        ];

        $exists = false;
        if (isset($data['email'])) {
            $exists = Http::withHeaders($headers)->get("http://kong:8000/auth/v1/admin/users?filter={$data['email']}")->json();
            if (isset($exists['users'][0])) {
                $exists = $exists['users'][0];
            } else {
                $exists = false;
            }
        }

        if ($exists) {
            $data = array_merge($exists, $data);
            $response = Http::withHeaders($headers)->put("http://kong:8000/auth/v1/admin/users/{$data['id']}", $data);
            if (!$response->successful()) throw new \Exception('Erro Supabase Auth: ' . $response->body());
            return (object) $response->json();
        }

        $data['email_confirm'] = true;
        $response = Http::withHeaders($headers)->post("http://kong:8000/auth/v1/admin/users", $data);
        if (!$response->successful()) throw new \Exception('Erro Supabase Auth: ' . $response->body());

        return (object) $response->json();
    }

    public function fileUpload(string | array | object $fileData)
    {
        if (is_string($fileData)) {
            $fileData = (object) ['url' => $fileData];
        }

        $fileData = (object) array_merge(['url' => null], (array) $fileData);

        if (strpos($fileData->url, 'data:') === 0) {
            $file = (object) [
                'name' => null,
                'mime' => null,
                'size' => null,
                'ext' => null,
                'url' => null,
            ];

            list($type, $data) = explode(';', $fileData->url);
            list(, $data)      = explode(',', $data);
            $file->mime = str_replace('data:', '', $type);
            $file->ext = explode('/', $file->mime)[1] ?? 'bin';

            if ($file->ext == 'jpeg') {
                $file->ext = 'jpg';
            }

            $content = base64_decode($data);
            $file->name = md5($content) . ".{$file->ext}";
            $file->size = strlen($content);

            $bucket = env('SERVICE_SUPABASE_STORAGE_BUCKET');
            $url = "http://kong:8000/storage/v1/object/$bucket/$file->name";

            $response = Http::withHeaders([
                'apikey' => env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
                'Authorization' => 'Bearer ' . env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
                'Content-Type' => $file->mime,
            ])->withBody($content, $file->mime)->post($url);

            $SERVICE_SUPABASE_URL = env('SERVICE_SUPABASE_URL');
            $supabase_bucket = env('SERVICE_SUPABASE_STORAGE_BUCKET');

            if (!$response->successful()) {
                // throw new \Exception('Erro upload Supabase: ' . $response->body());
                $file->url = "{$SERVICE_SUPABASE_URL}/storage/v1/object/public/{$supabase_bucket}/{$file->name}";
                return $file;
            }

            $data = $response->json();
            $file->url = "{$SERVICE_SUPABASE_URL}/storage/v1/object/public/{$data['Key']}";

            return $file;
        }

        return $fileData;
    }

    public function fileDelete($path)
    {
        $bucket = env('SERVICE_SUPABASE_STORAGE_BUCKET');
        $url = "http://kong:8000/storage/v1/object/$bucket/$path";

        $response = Http::withHeaders([
            'apikey' => env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
            'Authorization' => 'Bearer ' . env('SERVICE_SUPABASE_SERVICE_ROLE_KEY'),
            'Content-Type' => 'application/json',
        ])->delete($url);

        if (!$response->successful()) {
            throw new \Exception('Erro delete Supabase: ' . $response->body());
        }

        return (object) $response->json();
    }

    public function fileList()
    {
        $SERVICE_SUPABASE_STORAGE_BUCKET = env('SERVICE_SUPABASE_STORAGE_BUCKET');
        $SERVICE_SUPABASE_SERVICE_ROLE_KEY = env('SERVICE_SUPABASE_SERVICE_ROLE_KEY');
        $SERVICE_SUPABASE_URL = env('SERVICE_SUPABASE_URL');
        $files = [];
        $has_more = true;
        $offset = 0;
        $limit = 1000;

        while ($has_more) {
            try {
                $resp = "http://kong:8000/storage/v1/object/list/{$SERVICE_SUPABASE_STORAGE_BUCKET}";
                $resp = Http::withHeaders(['Authorization' => "Bearer {$SERVICE_SUPABASE_SERVICE_ROLE_KEY}"])->post($resp, [
                    'prefix' => '',
                    'limit' => $limit,
                    'offset' => $offset,
                ])->json();

                $has_more = sizeof($resp) == $limit;

                foreach ($resp as $file) {
                    $files[] = array_merge([
                        'url' => "{$SERVICE_SUPABASE_URL}/storage/v1/object/public/{$SERVICE_SUPABASE_STORAGE_BUCKET}/{$file['name']}",
                    ], $file);
                }
            } catch (\Exception $e) {
                $has_more = false;
            }
        }

        return $files;
    }
}
