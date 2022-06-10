<?php

namespace App\Entity;

use App\Repository\RepLogRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepLogRepository::class)]
class RepLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(name: 'reps', type: 'integer')]
    private int $reps;

    #[ORM\Column(name: "item", type: "string", length: 50)]
    private string $item;

    #[ORM\Column(name: "totalWeightLifted", type: "float")]
    private float $totalWeightLifted;

    public function getId(): ?int
    {
        return $this->id;
    }
}
