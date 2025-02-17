import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CompanySubscriptionPlans {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
}

@Entity('company_subscription_plan')
export class CompanySubscriptionPlan {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'varchar',
        length: 24,
    })
    userId!: string;

    @Column({
        type: 'enum',
        enum: CompanySubscriptionPlans,
        default: CompanySubscriptionPlans.FREE,
    })
    plan!: CompanySubscriptionPlans;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    paymentIdentifier?: string | null;

    @Column({
        type: 'int',
        default: 1, 
    })
    jobPostLimit!: number;

    @Column({
        type: 'int',
        default: 5, 
    })
    applicantionAccessLimit!: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    startDate!: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    endDate?: Date;
}
