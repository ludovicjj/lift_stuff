<?php

namespace App\Security;

use App\Entity\RepLog;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class RepLogVoter extends Voter
{
    const DELETE = 'delete';

    protected function supports(string $attribute, $subject): bool
    {
        if (!in_array($attribute, [self::DELETE])) {
            return false;
        }

        if (!$subject instanceof RepLog) {
            return false;
        }

        return true;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        /** @var RepLog $repLog */
        $repLog = $subject;

        switch ($attribute) {
            case self::DELETE:
                return $this->canDelete($repLog, $user);
        }

        throw new \LogicException('This code should not be reached!');
    }

    private function canDelete(RepLog $repLog, User $user): bool
    {
        return $repLog->getUser() === $user;
    }
}