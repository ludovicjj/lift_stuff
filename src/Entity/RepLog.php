<?php

namespace App\Entity;

use App\Repository\RepLogRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepLogRepository::class)]
class RepLog
{
    const ALLOWED_LIFT_ITEMS = [
        'chat' => '9',
        'ordinateur' => '4.5',
        'tasse_à_café' => '.5',
        'gros_chat' => '18'
    ];

    const ITEM_LABEL_PREFIX = "liftable_thing.";

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

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setReps(int $reps): self
    {
        $this->reps = $reps;
        return $this;
    }

    public function getReps(): int
    {
        return $this->reps;
    }

    public function setItem($item): self
    {
        if (!array_key_exists($item, self::ALLOWED_LIFT_ITEMS)) {
            throw new \InvalidArgumentException(sprintf('Oops, vous ne pouvez pas levez "%s" !', $item));
        }

        $this->item = $item;
        $this->calculateTotalLifted();
        return $this;
    }

    public function getItem(): string
    {
        return $this->item;
    }

    public function getItemLabel(): string
    {
        return self::ITEM_LABEL_PREFIX.$this->getItem();
    }

    public function getTotalWeightLifted(): float
    {
        return $this->totalWeightLifted;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    private function calculateTotalLifted()
    {
        if (!$this->getItem()) {
            return;
        }

        // forcer le type en float ?
        $weight = self::ALLOWED_LIFT_ITEMS[$this->getItem()];
        $totalWeight = $this->getReps() * $weight;

        $this->totalWeightLifted = $totalWeight;
    }

    /**
     * @return string[]
     */
    public static function getAllowedLiftItems(): array
    {
        return array_keys(self::ALLOWED_LIFT_ITEMS);
    }
}
