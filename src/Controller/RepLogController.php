<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Entity\User;
use App\Exception\ValidationException;
use App\Repository\RepLogRepository;
use App\Security\RepLogVoter;
use App\Service\ErrorValidationFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route("/api", name: "rep_log_")]
class RepLogController extends BaseController
{
    public function __construct(private EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        parent::__construct($serializer);
    }

    #[Route("/reps/{id}", name: "delete", methods: ['DELETE'])]
    public function deleteRepLog(RepLogRepository $repLogRepository, Request $request): JsonResponse
    {
        if ($request->isXmlHttpRequest()) {
            $this->denyAccessUnlessGranted('ROLE_USER');
            $repLog = $repLogRepository->find($request->attributes->get('id'));

            if (!$repLog) {
                throw new NotFoundHttpException("Not found.", null, Response::HTTP_NOT_FOUND);
            }

            $this->denyAccessUnlessGranted(RepLogVoter::DELETE, $repLog, "You are not allow to do this action");

            $this->entityManager->remove($repLog);
            $this->entityManager->flush();
            return new JsonResponse(null, 204);
        }

        return new JsonResponse([
            'message' => 'Request header X-Requested-With is missing'
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * @throws ValidationException
     */
    #[Route("/reps", name: "add", methods: ['POST'])]
    public function addRepLog(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
    ): Response
    {
        if ($request->isXmlHttpRequest()) {
            $this->denyAccessUnlessGranted('ROLE_USER');

            if (!$this->isCsrfTokenValid('add_rep_log_item', $request->toArray()['_token'] ?? null)) {
                throw new InvalidCsrfTokenException('Invalid CSRF token.');
            }

            /** @var RepLog $repLog */
            $repLog = $serializer->deserialize($request->getContent(), RepLog::class, 'json', ['groups' => 'add_rep_log']);
            /** @var User $user */
            $user = $this->getUser();
            $repLog->setUser($user);

            $contraintList = $validator->validate($repLog);
            ErrorValidationFactory::buildError($contraintList);

            $this->entityManager->persist($repLog);
            $this->entityManager->flush();

            $apiModel = $this->createRepLogModel($repLog);
            return $this->createApiResponse($apiModel, 201);
        }

        return new JsonResponse([
            'message' => 'Request header X-Requested-With is missing'
        ], Response::HTTP_BAD_REQUEST);
    }
}