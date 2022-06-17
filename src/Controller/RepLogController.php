<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Security\RepLogVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api", name: "rep_log_")]
class RepLogController extends AbstractController
{
    #[Route("/reps/{id}", name: "delete", methods: ['DELETE'])]
    public function deleteRepLog(RepLog $repLog, Request $request)
    {
        $this->denyAccessUnlessGranted(RepLogVoter::DELETE, $repLog);

        return new JsonResponse(null, 204);
    }
}