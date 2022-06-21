<?php

namespace App\Tests\Functional\Home;

use App\Entity\RepLog;
use App\Factory\RepLogFactory;
use App\Factory\UserFactory;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use Symfony\Component\Panther\Client;

class HomeTest extends PantherTestCase
{
    use ResetDatabase, Factories;

    public function testDeleteOneRep(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        $this->assertSelectorTextContains('h2', 'Your Lift History');

        $this->assertEquals(5, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();

        $deleteLink->click();
        sleep(1);

        $this->assertEquals(4, $crawler->filter('.js-rep-log-table tbody tr')->count());
    }

    public function testTotalWeightUpdated(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $rowWeight = $crawler->filter('.js-rep-log-table tbody tr')->first()->getAttribute('data-weight');
        $totalWeight = $crawler->filter('.js-total-weight')->text();

        $deleteLink->click();
        sleep(1);

        $this->assertEquals((string)($totalWeight - $rowWeight), $crawler->filter('.js-total-weight')->text());
    }

    public function testTotalRepsUpdated(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();
        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $rowReps = $crawler->filter('.js-rep-log-table tbody tr')->first()->getAttribute('data-reps');
        $totalReps = $crawler->filter('.js-total-reps')->text();

        $deleteLink->click();
        sleep(1);

        $this->assertEquals(
            (string)($totalReps - $rowReps),
            $crawler->filter('.js-total-reps')->text()
        );
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
}