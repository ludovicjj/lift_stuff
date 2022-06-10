<?php

namespace App\DataFixtures;

use App\Entity\RepLog;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $items = array_flip(RepLog::getAllowedLiftItems());

        // hashed password
        $password = $this->passwordHasher->hashPassword($user, 'pass-42');

        $user
            ->setEmail('user@email.com')
            ->setPassword($password);

        $manager->persist($user);

        for($i = 0; $i < rand(1, 3); $i++) {
            $repLog = new RepLog();
            $repLog
                ->setUser($user)
                ->setReps(rand(1, 30))
                ->setItem(array_rand($items));
            $manager->persist($repLog);
        }

        $manager->flush();
    }
}
