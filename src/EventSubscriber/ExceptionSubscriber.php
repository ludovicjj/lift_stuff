<?php

namespace App\EventSubscriber;

use App\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 2]
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();
        if ($request->isXmlHttpRequest()) {
            $this->sendJsonResponseException($event);
        }
    }

    public function sendJsonResponseException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $statusCode = $exception->getCode() ?: 400;
        $data = [
            'message'   => $exception->getMessage(),
            'code'      => $statusCode
        ];
        if ($exception instanceof ValidationException) {
            $data['errors'] = $exception->getErrors();
        }

        $event->setResponse(new JsonResponse($data, $statusCode));
    }
}