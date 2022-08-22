<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Form\Type\RepLogType;
use App\Repository\RepLogRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class HomeController extends BaseController
{
    #[Route("/", name: "home")]
    #[IsGranted("ROLE_USER")]
    public function index(RepLogRepository $repLogRepository, SerializerInterface $serializer): Response
    {
        $form = $this->createForm(RepLogType::class);
        //$form->handleRequest($request);
        $repLogModel = $this->findAllRepLogsModelByUser();
        $repLogJson = $serializer->serialize($repLogModel, 'json');

        return $this->render('home/index.html.twig',[
            'formLift'      => $form->createView(),
            'itemsModal'    => RepLog::ALLOWED_LIFT_ITEMS,
            'leadBoard'     => $this->getLeadBoard($repLogRepository),
            'repLogsJson'   => $repLogJson
        ]);
    }

    private function getLeadBoard(RepLogRepository $repLogRepository): array
    {
        $leadBoardDetails = $repLogRepository->getLeadBoardDetails();
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