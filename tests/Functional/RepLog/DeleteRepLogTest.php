<?php

namespace App\Tests\Functional\RepLog;

use App\Tests\FunctionalTestTrait;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class DeleteRepLogTest extends PantherTestCase
{
    use ResetDatabase, Factories, FunctionalTestTrait;

    public function testDeleteOneRep(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        sleep(1);
        $this->assertSelectorTextContains('.card-reps h2', 'Your Lift History');

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
        sleep(1);

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
        sleep(1);

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

    public function testDeleteRepLogNotExist(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();
        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        sleep(1);

        $client->executeScript("document.querySelector('.js-delete-rep-log').setAttribute('data-url', '/api/reps/752')");

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $deleteLink->click();
        sleep(1);

        $this->assertEquals(5, $crawler->filter('.js-rep-log-table tbody tr')->count());
    }
}