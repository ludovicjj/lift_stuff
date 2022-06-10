<?php

namespace App\DataFixtures;

use App\Entity\RepLog;
use App\Factory\RepLogFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = UserFactory::createOne(['email' => 'user@example.com', 'password' => 'pass-42']);
        $items = array_flip(RepLog::getAllowedLiftItems());

        RepLogFactory::createMany(
            3,
            function () use ($user, $items) {
                return [
                    'reps' => rand(1, 30),
                    'item' => array_rand($items),
                    'user' => $user
                ];
            }
        );
    }
}
