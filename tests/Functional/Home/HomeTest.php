<?php

namespace App\Tests\Functional\Home;

use App\Entity\User;
use App\Factory\UserFactory;
use Symfony\Component\Panther\PantherTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;
use Symfony\Component\Panther\Client;

class HomeTest extends PantherTestCase
{
    use ResetDatabase, Factories;

    public function testHomePageWhileLoggedIn(): void
    {
       $client = static::createPantherClient();

        $user = UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        $this->loginPantherClient($client);
        $client->request('GET', '/');
        $this->assertSelectorTextContains('h2', 'Your Lift History');
        $this->assertSelectorTextContains('td[colspan="4"]', "Let's start to lift something !");
        //$client->takeScreenshot('./var/error-screenshots/home.png');
    }

    private function loginPantherClient(Client $client)
    {
        $crawler = $client->request('GET', '/login');
        $form = $crawler->filter('form[name=login]')->form([
            '_email' => 'test@example.com',
            '_password' => "password"
        ]);
        $client->submit($form);
    }
}