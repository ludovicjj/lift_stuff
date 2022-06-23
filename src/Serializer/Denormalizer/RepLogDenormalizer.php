<?php

namespace App\Serializer\Denormalizer;

use App\Entity\RepLog;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\PropertyInfo\Extractor\SerializerExtractor;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;

class RepLogDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED = 'REP_LOG_DENORMALIZER_ALREADY_CALLED';

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
        $filterData = $this->getFilterData($data, $properties);

        $phpDocExtractor = new PhpDocExtractor();
        $filterAndTypedData = $this->convertDataTypeUsingPropertyType($filterData, $phpDocExtractor , $type);

        return $this->denormalizer->denormalize($filterAndTypedData, $type, $format, $context);
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

    private function convertDataTypeUsingPropertyType(
        array $data,
        PhpDocExtractor $phpDocExtractor,
        string $type
    ): array
    {
        foreach ($data as $key => $value) {
            $propertyInfoType = $phpDocExtractor->getTypes($type, $key)[0] ?? null;
            $propertyType = $propertyInfoType?->getBuiltinType();

            if ($propertyType) {
                $isValidType = $this->unsetInvalidType($propertyType, $data, $key);
                if (!$isValidType) {
                    // stop current loop and run next or key will be redefined key/value bellow
                    continue;
                };
                settype($value, $propertyType);
                $data[$key] = $value;
            }
        }
        return $data;
    }

    /**
     * Supprime des elements du tableau si le type de la valeur est invalide.
     * Exemple de donnée rentrante : ["reps" => "patate"] (Ici la valeur pour la clé 'reps' est 'string')
     * PropertyType : return 'int' car dans RepLog::reps a l'annotation param null|int
     * Donc la paire (clé/valeur) ici "reps" => "patate" est supprimé du tableau
     */
    private function unsetInvalidType(string $propertyType, array &$filterData, string $key)
    {
        switch ($propertyType) {
            case 'string':
                if (!is_string($filterData[$key])) {
                    unset($filterData[$key]);
                    return false;
                }
                break;
            case 'int':
                if (!is_numeric($filterData[$key])) {
                    unset($filterData[$key]);
                    return false;
                }
                break;
        }
        return true;
    }
}