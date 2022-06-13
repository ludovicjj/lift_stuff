<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class UnsplashProvider
{
    public function __construct(
        private HttpClientInterface $client,
        private string $unsplashClientId)
    {
    }

    public function loadPictureFromUnsplash(): array
    {
        $options = [
            "headers" => [
                "Accept" => "application/json",
                "Content-Type" => "application/json"
            ],
            "query" => [
                "client_id" => $this->unsplashClientId,
            ]
        ];

        $response = $this->client->request("GET", "https://api.unsplash.com/photos/l1ICIlRbL9I", $options);
        $data = $response->toArray();

        ["urls" => $urls, "user" => $user] = $data;

        return [
            'url' => $urls["raw"],
            'author_name' => $user['name'],
            'author_avatar' => $user['profile_image']['small']
        ];
    }
}