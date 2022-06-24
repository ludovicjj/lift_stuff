<?php

namespace App\Service;

use App\Exception\ValidationException;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\HttpFoundation\Response;

class ErrorValidationFactory
{
    public static function buildError(ConstraintViolationListInterface $constraintViolationList)
    {
        if (count($constraintViolationList) > 0) {
            $errors = [];
            /** @var ConstraintViolationInterface $constraint */
            foreach ($constraintViolationList as $constraint) {
                $errors[] = [
                    'property' => $constraint->getPropertyPath(),
                    'message' => $constraint->getMessage()
                ];
            }

            throw new ValidationException(
                $errors,
                'unprocessable entity',
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }
}