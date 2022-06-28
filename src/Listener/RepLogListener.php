<?php

namespace App\Listener;

use App\Entity\RepLog;

class RepLogListener
{
    public function prePersist(RepLog $repLog)
    {
        // Item or reps are null or item is not allowed
        if (
            !$repLog->getItem() ||
            !$repLog->getReps() ||
            !array_key_exists($repLog->getItem(), RepLog::ALLOWED_LIFT_ITEMS)
        )
        {
            throw new \LogicException("Unable to set total weights lifted with the values given for item or reps");
        }

        // Get weight for the given item
        $weight = RepLog::ALLOWED_LIFT_ITEMS[$repLog->getItem()];
        $totalWeight = $repLog->getReps() * $weight;
        $repLog->setTotalWeightLifted($totalWeight);
    }
}