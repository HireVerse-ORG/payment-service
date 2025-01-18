import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_plan_usage')
export class CompanySubscriptionUsage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'varchar',
        length: 24,
    })
    userId!: string;

    @Column({
        type: 'int',
        default: 0,
    })
    jobsPosted!: number; 

    @Column({
        type: 'int',
        default: 0,
    })
    resumesAccessed!: number;

    @Column({
        type: 'int',
        default: 0,
    })
    profilesViewed!: number; 

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastUpdated!: Date;
}
