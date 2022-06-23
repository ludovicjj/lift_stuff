<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Exception\AccessDeniedException;
use App\Exception\NotFoundException;
use App\Exception\TokenCsrfException;
use App\Repository\RepLogRepository;
use App\Security\RepLogVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route("/api", name: "rep_log_")]
class RepLogController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    #[Route("/reps/{id}", name: "delete", methods: ['DELETE'])]
    public function deleteRepLog(RepLogRepository $repLogRepository, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if($request->isXmlHttpRequest()) {
            $repLog = $repLogRepository->find($request->attributes->get('id'));
            if(!$repLog) {
                throw new NotFoundException("Not found.");
            }

            if (!$this->isGranted(RepLogVoter::DELETE, $repLog)) {
                throw new AccessDeniedException("You are not allow to delete this RepLog");
            }
            $this->entityManager->remove($repLog);
            $this->entityManager->flush();
            return new JsonResponse(null, 204);
        }

        return new JsonResponse(['message' => 'Request header X-Requested-With is missing'], Response::HTTP_BAD_REQUEST);
    }

    #[Route("/reps", name: "add", methods: ['POST'])]
    public function addRepLog(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
    ): Response
    {
        if (!$this->isCsrfTokenValid('add_rep_log_item', $request->toArray()['_token'] ?? null)) {
            throw new TokenCsrfException('Invalid CSRF token.');
        }

        /** @var RepLog $repLog */
        $repLog = $serializer->deserialize($request->getContent(), RepLog::class, 'json', ['groups' => 'add_rep_log']);
        /** TODO handle validation violation */
        $contraintList = $validator->validate($repLog);

        /** TODO send JSON with violation contraints */
        /** TODO set user with authenticated user */
        /** TODO persist and flush repLog */

        return new JsonResponse(
            [
                'item'      => $repLog->getItem(),
                'reps'      => $repLog->getReps(),
                'weight'    => $repLog->getTotalWeightLifted()
            ],
            Response::HTTP_CREATED
        );
    }
}