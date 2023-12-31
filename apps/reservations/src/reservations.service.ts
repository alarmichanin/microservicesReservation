import {Inject, Injectable} from '@nestjs/common';
import {CreateReservationDto} from './reservations/dto/create-reservation.dto';
import {UpdateReservationDto} from './reservations/dto/update-reservation.dto';
import {ReservationsRepository} from "./reservations.repository";
import {PAYMENTS_SERVICE} from "@app/common";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class ReservationsService {
    constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy) {
    }

    async create(createReservationDto: CreateReservationDto, userId: string) {
        this.paymentService.send(
            'create_charge',
            createReservationDto.charge
        ).subscribe(async (response)=>{
            console.log(response)
            return this.reservationsRepository.create({
                ...createReservationDto,
                timestamp: new Date(),
                userId,
            })
        })
    }

    async findAll() {
        return this.reservationsRepository.find({})
    }

    async findOne(_id: string) {
        return this.reservationsRepository.findOne({_id})
    }

    async update(_id: string, updateReservationDto: UpdateReservationDto) {
        return this.reservationsRepository.findOneAndUpdate(
            {_id},
            {$set: updateReservationDto}
        )
    }

    async remove(_id: string) {
        return this.reservationsRepository.findOneAndDelete({_id});
    }
}
