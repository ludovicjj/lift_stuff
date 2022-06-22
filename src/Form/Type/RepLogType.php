<?php

namespace App\Form\Type;

use App\Entity\RepLog;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RepLogType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('reps', IntegerType::class, [
                'label' => false
            ])
            ->add('item', ChoiceType::class, [
                'label' => false,
                'placeholder' => "What did you lift ?",
                'choices' => RepLog::getLiftedItemChoices()
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class'        => RepLog::class,
            'csrf_protection'   => true,
            'csrf_token_id'     => 'add_rep_log_item',
        ]);
    }

    // Change form attr name
    public function getBlockPrefix(): string
    {
        return '';
    }
}