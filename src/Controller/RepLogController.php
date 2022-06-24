<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Entity\User;
use App\Exception\AccessDeniedException;
use App\Exception\NotFoundException;
use App\Exception\TokenCsrfException;
use App\Repository\RepLogRepository;
use App\Repository\UserRepository;
use App\Security\RepLogVoter;
use App\Service\ErrorValidationFactory;
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
        UserRepository $userRepository
    ): Response
    {
        if (!$this->isCsrfTokenValid('add_rep_log_item', $request->toArray()['_token'] ?? null)) {
            throw new TokenCsrfException('Invalid CSRF token.');
        }

        /** @var User $user */
        $user = $this->getUser();
        if(!$user) {
            throw new AccessDeniedException('Access denied.');
        }

        /** @var RepLog $repLog */
        $repLog = $serializer->deserialize($request->getContent(), RepLog::class, 'json', ['groups' => 'add_rep_log']);
        $repLog->setUser($user);

        $contraintList = $validator->validate($repLog);
        ErrorValidationFactory::buildError($contraintList);

        $this->entityManager->persist($repLog);
        $this->entityManager->flush();

        return new JsonResponse(
            $serializer->serialize($repLog,'json', ['groups' => "read_rep_log"]),
            Response::HTTP_CREATED,
            [],
            true
        );
    }
}