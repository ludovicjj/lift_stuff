<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Security\RepLogVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api", name: "rep_log_")]
class RepLogController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    #[Route("/reps/{id}", name: "delete", methods: ['DELETE'])]
    public function deleteRepLog(RepLog $repLog, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if($request->isXmlHttpRequest()) {
            $this->denyAccessUnlessGranted(RepLogVoter::DELETE, $repLog, "You are not allow to delete this RepLog");
            $this->entityManager->remove($repLog);
            $this->entityManager->flush();
            return new JsonResponse(null, 204);
        }

        return new JsonResponse(['message' => 'Request header X-Requested-With is missing'], Response::HTTP_BAD_REQUEST);
    }
}