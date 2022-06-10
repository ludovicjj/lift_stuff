<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route("/", name: "home")]
    public function index(): Response
    {
        $data = [
            'user',
            'email',
            'id',
            'run'
        ];

        dump($data);
        return $this->render('home/index.html.twig',[
            'data' => $data
        ]);
    }
}