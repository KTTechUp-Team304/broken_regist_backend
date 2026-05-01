import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cors_policies' })
export class CorsPolicy {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'allowed_origin', type: 'varchar', length: 255 })
  allowedOrigin!: string;

  @Column({ name: 'allowed_methods', type: 'varchar', length: 200 })
  allowedMethods!: string;

  @Column({ name: 'allowed_headers', type: 'varchar', length: 500 })
  allowedHeaders!: string;

  @Column({ name: 'allow_credentials', type: 'boolean', default: false })
  allowCredentials!: boolean;

  @Column({ name: 'max_age', type: 'int', default: 0 })
  maxAge!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
