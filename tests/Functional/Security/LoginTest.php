<?php

namespace App\Tests\Functional\Security;

use App\Factory\UserFactory;
use JetBrains\PhpStorm\NoReturn;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Zenstruck\Foundry\Test\ResetDatabase;
use Zenstruck\Foundry\Test\Factories;

class LoginTest extends WebTestCase
{
    use ResetDatabase, Factories;

    #[NoReturn] public function testLogin(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'email' => 'john@example.com',
            'password' => 'pass-123'
        ]);

        /** @var UrlGeneratorInterface $urlGenerator */
        $urlGenerator = $client->getContainer()->get("router");
        $crawler = $client->request(Request::METHOD_GET, $urlGenerator->generate('login'));

        $form = $crawler->filter('form')->form([
            '_email' => "john@example.com",
            '_password' => "pass-123"
        ]);
        $client->submit($form);

        $this->assertResponseStatusCodeSame(Response::HTTP_FOUND);
        $client->followRedirect();
        $this->assertRouteSame("home");
    }
}