<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Repository\RepLogRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    public function __construct(
        private RepLogRepository $repLogRepository,
    )
    {
    }

    #[Route("/", name: "home")]
    #[IsGranted("ROLE_USER")]
    public function index(): Response
    {
        $repLogs = $this->repLogRepository->findBy([
            'user' => $this->getUser()
        ]);

        $totalWeight = 0;

        foreach ($repLogs as $repLog) {
            $totalWeight += $repLog->getTotalWeightLifted();
        }

        return $this->render('home/index.html.twig',[
            'repLogs' => $repLogs,
            'totalWeight' => $totalWeight
        ]);
    }
}