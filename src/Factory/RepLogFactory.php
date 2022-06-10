<?php

namespace App\Factory;

use App\Entity\RepLog;
use App\Repository\RepLogRepository;
use Zenstruck\Foundry\RepositoryProxy;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;

/**
 * @extends ModelFactory<RepLog>
 *
 * @method static RepLog|Proxy createOne(array $attributes = [])
 * @method static RepLog[]|Proxy[] createMany(int $number, array|callable $attributes = [])
 * @method static RepLog|Proxy find(object|array|mixed $criteria)
 * @method static RepLog|Proxy findOrCreate(array $attributes)
 * @method static RepLog|Proxy first(string $sortedField = 'id')
 * @method static RepLog|Proxy last(string $sortedField = 'id')
 * @method static RepLog|Proxy random(array $attributes = [])
 * @method static RepLog|Proxy randomOrCreate(array $attributes = [])
 * @method static RepLog[]|Proxy[] all()
 * @method static RepLog[]|Proxy[] findBy(array $attributes)
 * @method static RepLog[]|Proxy[] randomSet(int $number, array $attributes = [])
 * @method static RepLog[]|Proxy[] randomRange(int $min, int $max, array $attributes = [])
 * @method static RepLogRepository|RepositoryProxy repository()
 * @method RepLog|Proxy create(array|callable $attributes = [])
 */
final class RepLogFactory extends ModelFactory
{
    public function __construct()
    {
        parent::__construct();

        // TODO inject services if required (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services)
    }

    protected function getDefaults(): array
    {
        return [
            // TODO add your default values here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories)
            'reps' => 5,
            'item' => 'chat',
        ];
    }

    protected function initialize(): self
    {
        // see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
        return $this
            // ->afterInstantiate(function(RepLog $repLog): void {})
        ;
    }

    protected static function getClass(): string
    {
        return RepLog::class;
    }
}
