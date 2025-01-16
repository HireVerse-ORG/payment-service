import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('seeker_plan_usage')
export class SeekerSubscriptionUsage {
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
    jobApplicationsUsed!: number; 

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP', 
    })
    lastUpdated!: Date;  
}
