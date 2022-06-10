<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220610092741 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add relation ManyToOne between RepLog and User';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__rep_log AS SELECT id, reps, item, totalWeightLifted FROM rep_log');
        $this->addSql('DROP TABLE rep_log');
        $this->addSql('CREATE TABLE rep_log (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, reps INTEGER NOT NULL, item VARCHAR(50) NOT NULL, totalWeightLifted DOUBLE PRECISION NOT NULL, CONSTRAINT FK_A460CE79A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO rep_log (id, reps, item, totalWeightLifted) SELECT id, reps, item, totalWeightLifted FROM __temp__rep_log');
        $this->addSql('DROP TABLE __temp__rep_log');
        $this->addSql('CREATE INDEX IDX_A460CE79A76ED395 ON rep_log (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_A460CE79A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__rep_log AS SELECT id, reps, item, totalWeightLifted FROM rep_log');
        $this->addSql('DROP TABLE rep_log');
        $this->addSql('CREATE TABLE rep_log (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, reps INTEGER NOT NULL, item VARCHAR(50) NOT NULL, totalWeightLifted DOUBLE PRECISION NOT NULL)');
        $this->addSql('INSERT INTO rep_log (id, reps, item, totalWeightLifted) SELECT id, reps, item, totalWeightLifted FROM __temp__rep_log');
        $this->addSql('DROP TABLE __temp__rep_log');
    }
}
