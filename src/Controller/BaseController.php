<?php

namespace App\Controller;

use App\Api\RepLogModelApi;
use App\Entity\RepLog;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class BaseController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    protected function createRepLogModel(RepLog $repLog): RepLogModelApi
    {
        $model = new RepLogModelApi();
        $model->id = $repLog->getId();
        $model->reps = $repLog->getReps();
        $model->item = $repLog->getItem();
        $model->totalWeightLifted = $repLog->getTotalWeightLifted();
        $model->addLink('self', '');

        return $model;
    }

    protected function createApiResponse($data, $statusCode = 200): Response
    {
        $json = $this->serializer->serialize($data, 'json');
        return new JsonResponse($json, $statusCode, [], true);
    }
}