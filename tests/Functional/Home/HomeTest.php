<?php

namespace App\Tests\Functional\Home;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class HomeTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testHomePageWhileLoggedIn(): void
    {
        $client = static::createClient();
        $proxy = UserFactory::createOne([
            'email' => 'john@example.com',
            'password' => 'pass-123'
        ]);

        $user = $proxy->object();
        $client->loginUser($user);

        // user is now logged in, so you can test protected resources
        $client->request(Request::METHOD_GET, "/");
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h5', 'Your Lift History');
        $this->assertSelectorTextContains('td[colspan=4]', "Let's start to lift something !");
    }
}