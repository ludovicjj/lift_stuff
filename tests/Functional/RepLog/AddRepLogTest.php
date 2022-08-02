<?php

namespace App\Tests\Functional\RepLog;

use App\Tests\FunctionalTestTrait;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class AddRepLogTest extends PantherTestCase
{
    use ResetDatabase, Factories, FunctionalTestTrait;

    public function testAddRepLogWithInvalidToken()
    {
        $client = static::createPantherClient();
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

        $client->waitForVisibility('.swal2-modal');

        $modalTitleError = $crawler->filter('.swal2-modal #swal2-title')->getText();
        $modalTextError = $crawler->filter('.swal2-modal #swal2-html-container')->getText();
        $this->assertSame('Oops...', $modalTitleError);
        $this->assertSame('Something went wrong! (Invalid CSRF token.)', $modalTextError);
        $client->takeScreenshot('./var/screenshots/add-lift-invalid-csrf-token.png');
    }

    public function testAddRepLogWithEmptyForm()
    {
        $client = static::createPantherClient();
        $this->loadFixtures();

        $this->loginPantherClient($client);
        $crawler = $client->request('GET', '/');

        $crawler->filter('.js-new-rep-log-form button')->click();

        $client->waitFor('.invalid-feedback');

        $this->assertEquals(2, $crawler->filter('div.invalid-feedback')->count());
        $this->assertEquals(
            'What did you lift ?',
            $crawler->filter('div.invalid-feedback')->getElement(0)->getText()
        );
        $this->assertEquals(
            'how many times did you lift this ?',
            $crawler->filter('div.invalid-feedback')->getElement(1)->getText()
        );
        $client->takeScreenshot('./var/screenshots/add-lift-empty-form.png');
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

        $client->waitFor('.invalid-feedback');

        $this->assertSelectorWillExist('#item.is-invalid');
        $this->assertSame('What did you lift ?',  $crawler->filter('.invalid-feedback')->getText());
        $client->takeScreenshot('./var/screenshots/add-lift-empty-form-item.png');
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

        $client->waitFor('.invalid-feedback');

        $this->assertSelectorWillExist('#reps.is-invalid');
        $this->assertSame('how many times did you lift this ?',  $crawler->filter('.invalid-feedback')->getText());
        $client->takeScreenshot('./var/screenshots/add-lift-empty-form-reps.png');
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

        $client->waitForVisibility('.swal2-modal');


        $this->assertSame("Your lift have been added with success", $crawler->filter('.swal2-html-container')->getText());
        $client->takeScreenshot('./var/screenshots/add-lift-success-modal.png');

        $crawler->filter('.swal2-actions .swal2-confirm')->click();
        $client->waitForInvisibility('.swal2-modal');

        $this->assertEquals(4, $crawler->filter('.js-rep-log-table tbody tr')->count());
        $row = $crawler->filter('.js-rep-log-table tbody tr')->last();
        $this->assertEquals('Cat', $row->filter('td')->getElement(0)->getText());
        $this->assertEquals('5', $row->filter('td')->getElement(1)->getText());
        $this->assertEquals('45', $row->filter('td')->getElement(2)->getText());
        $client->takeScreenshot('./var/screenshots/add-lift-success.png');
    }
}