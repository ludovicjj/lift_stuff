<?php

namespace App\Tests\Functional\RepLog;

use App\Tests\FunctionalTestTrait;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class AddRepLogTest extends PantherTestCase
{
    use ResetDatabase, Factories, FunctionalTestTrait;

    public function testAddRepLogWithBadToken()
    {
        $client = static::createPantherClient(
            [],
            [],
            [
                'capabilities' => [
                    'goog:loggingPrefs' => [
                        'browser' => 'ALL'
                    ],
                ]
            ]
        );
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        $values = [
            'item' => 'cat',
            'reps' => '5',
        ];
        $client->executeScript("document.querySelector('.js-new-rep-log-form input[type=\"hidden\"').value = 'fail'");
        $form = $crawler->filter('.js-new-rep-log-form')->form($values);
        $this->assertSame(['item' => 'cat','reps' => '5','_token' => 'fail'], $form->getValues());
        $crawler->filter('.js-new-rep-log-form button')->click();
        sleep(1);
        $logs = $client->getWebDriver()->manage()->getLog('browser');
        $this->assertCount(2, $logs);
        $this->assertStringContainsString(
            "Invalid CSRF token.",
            $logs[1]['message']
        );
    }

    public function testAddRepLogWithEmptyForm()
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');

        $crawler->filter('.js-new-rep-log-form button')->click();
        sleep(1);
        $this->assertEquals(2, $crawler->filter('div.invalid-feedback')->count());

        $this->assertEquals(
            'What did you lift ?',
            $crawler->filter('div.invalid-feedback')->getElement(0)->getText()
        );
        $this->assertEquals(
            'how many times did you lift this ?',
            $crawler->filter('div.invalid-feedback')->getElement(1)->getText()
        );
    }

    public function testAddRepLogWithEmptyItem()
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        $values = [
            'item' => '',
            'reps' => '5'
        ];
        $crawler->filter('.js-new-rep-log-form')->form($values);
        $crawler->filter('.js-new-rep-log-form button')->click();
        sleep(1);
        $this->assertEquals(1, $crawler->filter('div.invalid-feedback')->count());
    }

    public function testAddRepLogWithEmptyReps()
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        $values = [
            'item' => 'cat',
            'reps' => ''
        ];
        $crawler->filter('.js-new-rep-log-form')->form($values);
        $crawler->filter('.js-new-rep-log-form button')->click();
        sleep(1);
        $this->assertEquals(1, $crawler->filter('div.invalid-feedback')->count());
    }

    public function testAddRepLogSuccess()
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');
        $values = [
            'item' => 'cat',
            'reps' => '5'
        ];
        $crawler->filter('.js-new-rep-log-form')->form($values);
        $crawler->filter('.js-new-rep-log-form button')->click();
        sleep(1);

        $this->assertEquals(6, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $row = $crawler->filter('.js-rep-log-table tbody tr')->last();
        $this->assertEquals('Cat', $row->filter('td')->getElement(0)->getText());
        $this->assertEquals('5', $row->filter('td')->getElement(1)->getText());
        $this->assertEquals('45', $row->filter('td')->getElement(2)->getText());
    }
}