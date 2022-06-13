<?php

namespace App\Tests\Functional\Security;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Zenstruck\Foundry\Test\ResetDatabase;
use Zenstruck\Foundry\Test\Factories;

class LoginTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testLogin(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'email' => 'john@example.com',
            'password' => 'pass-123'
        ]);

        /** @var UrlGeneratorInterface $urlGenerator */
        $urlGenerator = $client->getContainer()->get("router");
        $crawler = $client->request(Request::METHOD_GET, $urlGenerator->generate('login'));

        $form = $crawler->filter('form[name=login]')->form([
            '_email' => "john@example.com",
            '_password' => "pass-123"
        ]);
        $client->submit($form);

        $this->assertResponseStatusCodeSame(Response::HTTP_FOUND);
        $client->followRedirect();
        $this->assertRouteSame("home");
    }

    public function testLoginWithWrongPassword(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'pass-123'
        ]);
        /** @var UrlGeneratorInterface $urlGenerator */
        $urlGenerator = $client->getContainer()->get("router");
        $crawler = $client->request(Request::METHOD_GET, $urlGenerator->generate('login'));

        $form = $crawler->filter('form[name=login]')->form([
            '_email' => "john@example.com",
            '_password' => "fail",
        ]);

        $client->submit($form);
        $this->assertResponseStatusCodeSame(Response::HTTP_FOUND);
        $client->followRedirect();
        $this->assertRouteSame("login");
        $this->assertSelectorTextContains("div.alert-danger", "Invalid credentials.");
    }

    public function testLoginWithWrongEmail(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'pass-123'
        ]);
        /** @var UrlGeneratorInterface $urlGenerator */
        $urlGenerator = $client->getContainer()->get("router");
        $crawler = $client->request(Request::METHOD_GET, $urlGenerator->generate('login'));

        $form = $crawler->filter('form[name=login]')->form([
            '_email' => "fail@example.com",
            '_password' => "pass-123",
        ]);

        $client->submit($form);
        $this->assertResponseStatusCodeSame(Response::HTTP_FOUND);
        $client->followRedirect();
        $this->assertRouteSame("login");
        $this->assertSelectorTextContains("div.alert-danger", "Invalid credentials.");
    }

    public function testLoginWithWrongCsrfToken(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'email' => 'test@example.com',
            'password' => 'pass-123'
        ]);
        /** @var UrlGeneratorInterface $urlGenerator */
        $urlGenerator = $client->getContainer()->get("router");
        $crawler = $client->request(Request::METHOD_GET, $urlGenerator->generate('login'));

        $form = $crawler->filter('form[name=login]')->form([
            '_email' => "test@example.com",
            '_password' => "pass-123",
            "_csrf_token" => "wrong_csrf_token"
        ]);

        $client->submit($form);
        $this->assertResponseStatusCodeSame(Response::HTTP_FOUND);
        $client->followRedirect();
        $this->assertRouteSame("login");
        $this->assertSelectorTextContains("div.alert-danger", "Invalid CSRF token.");
    }
}