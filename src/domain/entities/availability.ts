import { dayOfWeekEnum } from '../../infra/db/schema'
import { NewAvailability } from '../../infra/repositories/availabilities.repository.impl'
import { Availability } from '../repositories/availability.repository'

export class AvailabilityEntity {
  public readonly id: string
  public readonly professionalId: string
  // Use 'typeof dayOfWeekEnum.enumValues[number]' for the specific string union type
  public readonly dayOfWeek: string
  public readonly startHour: string | null
  public readonly endHour: string | null
  public readonly shift: string | null

  constructor(props: Availability) {
    this.id = props.id
    this.professionalId = props.professionalId
    this.dayOfWeek = props.dayOfWeek
    this.startHour = props.startHour
    this.endHour = props.endHour
    this.shift = props.shift
  }

  /**
   * Maps the Domain Entity back to the Repository/DB format (NewAvailability)
   */
  public toRepository(): NewAvailability {
    // Validation logic stays here or in the constructor
    if (this.startHour && this.endHour) {
      if (this.startHour >= this.endHour) {
        throw new Error('Start time must be before end time')
      }
    }

    return {
      id: this.id,
      professionalId: this.professionalId,
      dayOfWeek: this.dayOfWeek as any,
      // Mapping back to the schema keys: 'startHour' and 'endHour'
      startHour: this.startHour,
      endHour: this.endHour,
      shift: this.shift as any, // Cast if shiftEnum is being stubborn
    }
  }
}
