<?php

namespace App\Exception;

use Throwable;

class TokenCsrfException extends \Exception
{
    public function __construct(string $message = "", int $code = 403, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

}