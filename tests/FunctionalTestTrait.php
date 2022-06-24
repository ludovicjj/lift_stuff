<?php

namespace App\Tests;

use App\Entity\RepLog;
use App\Factory\RepLogFactory;
use App\Factory\UserFactory;
use Symfony\Component\Panther\Client;

trait FunctionalTestTrait
{
    private function loadFixtures(): void
    {
        $items = array_flip(RepLog::getAllowedLiftItems());

        $user = UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'password'
        ]);
        RepLogFactory::new(['user' => $user])
            ->withItem($items)
            ->many(5)
            ->create()
        ;
    }

    private function loginPantherClient(Client $client): void
    {
        $crawler = $client->request('GET', '/login');
        $form = $crawler->filter('form[name=login]')->form([
            '_email' => 'test@example.com',
            '_password' => "password"
        ]);
        $client->submit($form);
    }
}