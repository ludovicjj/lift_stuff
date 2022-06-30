<?php

namespace App\Serializer\Denormalizer;

use App\Entity\RepLog;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\PropertyInfo\DoctrineExtractor;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\PropertyInfo\PropertyInfoExtractor;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\PropertyInfo\Extractor\SerializerExtractor;

class RepLogDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED = 'REP_LOG_DENORMALIZER_ALREADY_CALLED';

    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return RepLog::class === $type;
    }

    public function denormalize($data, string $type, string $format = null, array $context = []): mixed
    {
        $context[self::ALREADY_CALLED] = true;

        $properties = $this->getPropertiesBySerializerGroups($type, $context);
        $data = $this->getFilterData($data, $properties);
        $this->transformDataValuesTypeOrUnset($data, $type);

        return $this->denormalizer->denormalize($data, $type, $format, $context);
    }

    private function getPropertiesBySerializerGroups(string $type, array $context): array
    {
        $groups = $context['groups'] ?? null;
        $serializerClassMetadataFactory = new ClassMetadataFactory(
            new AnnotationLoader(new AnnotationReader)
        );
        $serializerExtractor = new SerializerExtractor($serializerClassMetadataFactory);
        return $serializerExtractor->getProperties($type, ['serializer_groups' => [$groups]]);
    }

    private function getFilterData($data, array $properties): array
    {
        return array_filter($data, function($value, $key) use ($properties) {
            return $value !== '' && in_array($key, $properties);
        }, ARRAY_FILTER_USE_BOTH);
    }

    private function transformDataValuesTypeOrUnset(&$data, string $type): void
    {
        $propertyInfo = $this->getPropertyInfoExtractor();
        foreach ($data as $key => $value) {
            $propertyType = $propertyInfo->getTypes($type, $key)[0]->getBuiltinType();
            $isValidType = $this->isValidType($propertyType, $data, $key);
            if (!$isValidType) {
                unset($data[$key]);
                continue;
            }
            settype($value, $propertyType);
            $data[$key] = $value;
        }
    }

    private function isValidType(string $type, array $data, string $key): bool
    {
        switch ($type) {
            case 'string':
                if (!is_string($data[$key])) {
                    return false;
                }
                break;
            case 'int':
                if (!is_numeric($data[$key])) {
                    return false;
                }
                break;
        }
        return true;
    }

    private function getPropertyInfoExtractor(): PropertyInfoExtractor
    {
        $reflectionExtractor = new ReflectionExtractor();
        $doctrineExtractor = new DoctrineExtractor($this->entityManager);

        return new PropertyInfoExtractor(
            [
                $reflectionExtractor,
                $doctrineExtractor
            ],
            [
                $doctrineExtractor,
                $reflectionExtractor
            ]
        );
    }
}