<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Security\RepLogVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api", name: "rep_log_")]
class RepLogController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    #[Route("/reps/{id}", name: "delete", methods: ['DELETE'])]
    public function deleteRepLog(RepLog $repLog): JsonResponse
    {
        $this->denyAccessUnlessGranted(RepLogVoter::DELETE, $repLog);
        $this->entityManager->remove($repLog);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }
}