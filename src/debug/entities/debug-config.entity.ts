import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'debug_configs' })
export class DebugConfig {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'config_key', type: 'varchar', length: 100, unique: true })
  configKey!: string;

  @Column({ name: 'config_value', type: 'text' })
  configValue!: string;

  @Column({ name: 'is_sensitive', type: 'boolean', default: false })
  isSensitive!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy!: number | null;
}
