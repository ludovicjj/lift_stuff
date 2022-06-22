<?php

namespace App\EventSubscriber;

use App\Exception\TokenCsrfException;
use App\Exception\AccessDeniedException;
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
        $exception = $event->getThrowable();
        switch (get_class($exception)) {
            case TokenCsrfException::class:
                $this->jsonResponseException($event);
                break;
            case AccessDeniedException::class:
                $this->jsonResponseException($event);
        }
    }

    public function jsonResponseException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        $event->setResponse(new JsonResponse([
            'message'   => $exception->getMessage(),
            'code'      => $exception->getCode()
        ], $event->getThrowable()->getCode()));
    }
}