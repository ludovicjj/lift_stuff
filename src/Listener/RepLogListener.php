<?php

namespace App\Listener;

use App\Entity\RepLog;

class RepLogListener
{
    public function prePersist(RepLog $repLog)
    {

        // Missing item or reps
        if (!$repLog->getItem() || !$repLog->getReps()) {
            $repLog->setTotalWeightLifted(null);
            return;
        }

        // Item input is not an allowed item
        if (!array_key_exists($repLog->getItem(), RepLog::ALLOWED_LIFT_ITEMS)) {
            $repLog->setTotalWeightLifted(null);
            return;
        }

        // Get weight for the given item
        $weight = RepLog::ALLOWED_LIFT_ITEMS[$repLog->getItem()];
        $totalWeight = $repLog->getReps() * $weight;
        $repLog->setTotalWeightLifted($totalWeight);
    }
}