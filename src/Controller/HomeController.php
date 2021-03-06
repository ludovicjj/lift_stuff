<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Entity\User;
use App\Form\Type\RepLogType;
use App\Repository\RepLogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    public function __construct(
        private RepLogRepository $repLogRepository,
        private EntityManagerInterface $entityManager
    )
    {
    }

    #[Route("/", name: "home")]
    #[IsGranted("ROLE_USER")]
    public function index(Request $request): Response
    {
        $form = $this->createForm(RepLogType::class);
        $form->handleRequest($request);

        $repLogs = $this->repLogRepository->findBy([
            'user' => $this->getUser()
        ]);
        $totalWeight = 0;
        $totalReps = 0;
        foreach ($repLogs as $repLog) {
            $totalWeight += $repLog->getTotalWeightLifted();
            $totalReps += $repLog->getReps();
        }

        return $this->render('home/index.html.twig',[
            'repLogs' => $repLogs,
            'totalWeight' => $totalWeight,
            'totalReps' => $totalReps,
            'formLift' => $form->createView(),
            'items' => RepLog::ALLOWED_LIFT_ITEMS,
            'leadBoard' => $this->getLeadBoard()
        ]);
    }

    private function getLeadBoard(): array
    {
        $leadBoardDetails = $this->repLogRepository->getLeadBoardDetails();
        $leadBoard = [];

        foreach ($leadBoardDetails as $detail) {
            $leadBoard[] = [
                'weight' => $detail['weightSum'],
                'username' => strstr($detail['user_email'],'@', true)
            ];
        }
        return $leadBoard;
    }
}