<?php

namespace App\Controller;

use App\Service\UnsplashProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    public function __construct(
        private UnsplashProvider $unsplashProvider
    )
    {
    }

    #[Route('/login', name: 'login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $data = $this->unsplashProvider->loadPictureFromUnsplash();

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last email entered by the user
        $lastEmail = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_email' => $lastEmail,
            'error'         => $error,
            'image_url' => $data['url'],
            'author_name' => $data['author_name'],
            'author_avatar' => $data['author_avatar']
        ]);
    }

    #[Route("/logout", name: "logout", methods: ["GET"])]
    public function logout()
    {
        throw new \Exception('Don\'t forget to activate logout in security.yaml');
    }
}
