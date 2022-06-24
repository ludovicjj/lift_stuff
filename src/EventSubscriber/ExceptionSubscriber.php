<?php

namespace App\EventSubscriber;

use App\Exception\NotFoundException;
use App\Exception\TokenCsrfException;
use App\Exception\AccessDeniedException;
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
        $exception = $event->getThrowable();
        switch (get_class($exception)) {
            case AccessDeniedException::class:
            case TokenCsrfException::class:
            case NotFoundException::class:
                $this->jsonResponseException($event);
                break;
            case ValidationException::class:
                $this->processValidatorException($event);
        }
    }

    public function jsonResponseException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $event->setResponse(new JsonResponse([
            'message'   => $exception->getMessage(),
            'code'      => $exception->getCode()
        ], $exception->getCode()));
    }

    public function processValidatorException(ExceptionEvent $event): void
    {
        /** @var ValidationException $exception */
        $exception = $event->getThrowable();
        $event->setResponse(new JsonResponse([
            'message'   => $exception->getMessage(),
            'errors'    => $exception->getErrors(),
            'code'      => $exception->getCode()
        ], $exception->getCode()));
    }
}