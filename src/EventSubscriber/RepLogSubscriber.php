<?php

namespace App\EventSubscriber;

use App\Security\RepLogVoter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

class RepLogSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 2]
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if (!$exception instanceof AccessDeniedException) {
            return;
        }

        // Customize your response object to display the exception details
        if ($event->getRequest()->isXmlHttpRequest() && $exception->getAttributes() === RepLogVoter::DELETE) {
            $event->setResponse(new JsonResponse([
                'error' => $exception->getMessage(),
                'code' => $exception->getCode()
            ], $exception->getCode()));
        }
    }
}