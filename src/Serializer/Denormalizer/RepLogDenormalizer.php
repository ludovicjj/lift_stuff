<?php

namespace App\Serializer\Denormalizer;

use App\Entity\RepLog;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class RepLogDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED = 'REP_LOG_DENORMALIZER_ALREADY_CALLED';

    public function supportsDenormalization($data, string $type, string $format = null, array $context = [])
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return RepLog::class === $type;
    }

    public function denormalize($data, string $type, string $format = null, array $context = [])
    {
        $context[self::ALREADY_CALLED] = true;

        // trans-type reps to integer
        if (isset($data['reps']) && is_string($data['reps'])) {
            $data['reps'] = (int)$data['reps'];
        }

        return $this->denormalizer->denormalize($data, $type, $format, $context);
    }
}