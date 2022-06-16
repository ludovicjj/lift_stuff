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
        $names = ['Diane', 'Cindy', 'John', 'Ron', 'Luc', 'Fuzz'];
        $items = array_flip(RepLog::getAllowedLiftItems());

        foreach ($names as $name) {
            $user = UserFactory::new()
                ->withEmail(strtolower($name).'@example.com')
                ->create()
            ;
            RepLogFactory::new(['user' => $user])
                ->withItem($items)
                ->many(rand(1, 5))
                ->create()
            ;
        }
    }
}
