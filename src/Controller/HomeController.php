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

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var RepLog $repLog */
            $repLog = $form->getData();
            /** @var User $user */
            $user = $this->getUser();

            $repLog->setUser($user);
            $this->entityManager->persist($repLog);
            $this->entityManager->flush();
            $this->addFlash('notice', "Lift with success !");

            return $this->redirectToRoute("home");
        }

        $repLogs = $this->repLogRepository->findBy([
            'user' => $this->getUser()
        ]);
        $totalWeight = 0;
        foreach ($repLogs as $repLog) {
            $totalWeight += $repLog->getTotalWeightLifted();
        }

        return $this->render('home/index.html.twig',[
            'repLogs' => $repLogs,
            'totalWeight' => $totalWeight,
            'formLift' => $form->createView()
        ]);
    }
}