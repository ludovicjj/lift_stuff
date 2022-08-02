<?php

namespace App\Tests\Functional\RepLog;

use App\Tests\FunctionalTestTrait;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class DeleteRepLogTest extends PantherTestCase
{
    use ResetDatabase, Factories, FunctionalTestTrait;

    public function testDeleteRepLogSuccess(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        // loading lift items
        $client->waitForVisibility('.js-rep-log-table tbody tr');
        $this->assertSelectorTextContains('.card-reps h2', 'Your Lift History');

        $this->assertEquals(3, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();

        $deleteLink->click();

        $client->waitForVisibility('.swal2-icon-question');
        $crawler->filter('.swal2-icon-question .swal2-confirm')->click();
        $client->waitForVisibility('.swal2-icon-success');
        $client->takeScreenshot('./var/screenshots/delete-lift-success-modal.png');
        $crawler->filter('.swal2-icon-success .swal2-confirm')->click();
        $client->waitForInvisibility('.swal2-icon-success');

        $this->assertEquals(2, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $client->takeScreenshot('./var/screenshots/delete-lift-success.png');
    }

    public function testTotalWeightUpdated(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        // loading lift items
        $client->waitForVisibility('.js-rep-log-table tbody tr');

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $deleteRowWeight = $crawler->filter('.js-rep-log-table tbody tr')->first()->getAttribute('data-weight');
        $totalWeight = $crawler->filter('.js-total-weight')->text();

        $deleteLink->click();
        $client->waitForVisibility('.swal2-icon-question');
        $crawler->filter('.swal2-icon-question .swal2-confirm')->click();
        $client->waitForVisibility('.swal2-icon-success');
        $crawler->filter('.swal2-icon-success .swal2-confirm')->click();

        // TotalWeight and Reps are updated with setInterval with timer 0.5s
        sleep(1);

        $this->assertEquals((string)($totalWeight - $deleteRowWeight), $crawler->filter('.js-total-weight')->text());
        $client->takeScreenshot('./var/screenshots/delete-lift-total-weight.png');
    }

    public function testTotalRepsUpdated(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();
        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        // loading lift items
        $client->waitForVisibility('.js-rep-log-table tbody tr');

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $rowReps = $crawler->filter('.js-rep-log-table tbody tr')->first()->getAttribute('data-reps');
        $totalReps = $crawler->filter('.js-total-reps')->text();

        $deleteLink->click();
        $client->waitForVisibility('.swal2-icon-question');
        $crawler->filter('.swal2-icon-question .swal2-confirm')->click();
        $client->waitForVisibility('.swal2-icon-success');
        $crawler->filter('.swal2-icon-success .swal2-confirm')->click();

        // TotalWeight and Reps are updated with setInterval with timer 0.5s
        sleep(1);

        $this->assertEquals(
            (string)($totalReps - $rowReps),
            $crawler->filter('.js-total-reps')->text()
        );
        $client->takeScreenshot('./var/screenshots/delete-lift-total-reps.png');
    }

    public function testDeleteRepLogNotExist(): void
    {
        $client = static::createPantherClient();
        $this->loadFixtures();
        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        // loading lift items
        $client->waitForVisibility('.js-rep-log-table tbody tr');

        $client->executeScript("document.querySelector('.js-delete-rep-log').setAttribute('data-url', '/api/reps/752')");

        $deleteLink = $crawler->filter('.js-delete-rep-log')->first();
        $deleteLink->click();
        $client->waitForVisibility('.swal2-icon-question');
        $crawler->filter('.swal2-icon-question .swal2-confirm')->click();
        $client->waitForVisibility('.swal2-icon-error');
        $this->assertSame('Something went wrong! (Not found.)', $crawler->filter('.swal2-icon-error .swal2-html-container')->getText());
        $crawler->filter('.swal2-icon-error .swal2-confirm')->click();

        $this->assertEquals(3, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $client->takeScreenshot('./var/screenshots/delete-lift-not-found.png');
    }
}