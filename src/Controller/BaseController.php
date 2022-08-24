<?php

namespace App\Controller;

use App\Api\RepLogModelApi;
use App\Entity\RepLog;
use App\Repository\RepLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class BaseController extends AbstractController
{
    public function __construct(private SerializerInterface $serializer, private RepLogRepository $repLogRepository)
    {
    }

    protected function createRepLogModel(RepLog $repLog): RepLogModelApi
    {
        $model = new RepLogModelApi();
        $model->id = $repLog->getId();
        $model->reps = $repLog->getReps();
        $model->item = $repLog->getItemLabel();
        $model->totalWeightLifted = $repLog->getTotalWeightLifted();
        $model->addLink('self', $this->generateUrl('rep_log_delete', ['id' => $repLog->getId()]));

        return $model;
    }

    protected function createApiResponse($data, $statusCode = 200): Response
    {
        $json = $this->serializer->serialize($data, 'json');
        return new JsonResponse($json, $statusCode, [], true);
    }

    /**
     * @return RepLogModelApi[]
     */
    protected function findAllRepLogsModelByUser(): array
    {
        $repLogs = $this->repLogRepository->findBy(['user' => $this->getUser()]);
        $models = [];

        foreach ($repLogs as $repLog) {
            $models[] = $this->createRepLogModel($repLog);
        }
        return $models;
    }
}