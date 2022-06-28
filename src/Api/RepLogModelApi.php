<?php

namespace App\Api;

class RepLogModelApi
{
    public string $id;

    public int $reps;

    public string $item;

    public float $totalWeightLifted;

    private array $links = [];

    public function addLink($ref, $url)
    {
        $this->links[$ref] = $url;
    }

    public function getLinks(): array
    {
        return $this->links;
    }
}