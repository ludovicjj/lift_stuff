<?php

namespace App\Repository;

use App\Entity\RepLog;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RepLog>
 *
 * @method RepLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method RepLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method RepLog[]    findAll()
 * @method RepLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RepLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepLog::class);
    }

    public function add(RepLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getLeadBoardDetails(): array
    {
        return $this->createQueryBuilder('rl')
            ->select('IDENTITY(rl.user) as user_id, SUM(rl.totalWeightLifted) as weightSum, u.email as user_email')
            ->innerJoin(User::class, 'u', Join::WITH, 'u.id = user_id')
            ->groupBy('user_id')
            ->orderBy('weightSum', 'DESC')
            ->getQuery()
            ->execute();
    }

//    /**
//     * @return RepLog[] Returns an array of RepLog objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RepLog
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
