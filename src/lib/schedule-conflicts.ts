/**
 * Conflict detection logic for instructor schedules
 */

interface Schedule {
  id: string
  instructorId: string
  instructorName?: string
  classroomId: string
  classroomName?: string
  locationId: string
  locationName?: string
  dayOfWeek: number | null
  startTime: Date | string
  endTime: Date | string
  isRecurring: boolean
  startDate: Date | string | null
  endDate: Date | string | null
}

export interface Conflict {
  instructorId: string
  instructorName: string
  conflictingSchedules: Array<{
    scheduleId: string
    classroomName: string
    locationName: string
    startTime: Date | string
    endTime: Date | string
    dayOfWeek?: number | null
  }>
}

/**
 * Check if two time slots overlap
 */
export function timeSlotsOverlap(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = new Date(start1).getTime()
  const e1 = new Date(end1).getTime()
  const s2 = new Date(start2).getTime()
  const e2 = new Date(end2).getTime()
  return s1 < e2 && s2 < e1
}

/**
 * Check if two recurring schedules overlap on the same day
 */
function recurringSchedulesOverlap(
  schedule1: Schedule,
  schedule2: Schedule
): boolean {
  // Check if date ranges overlap (required for both daily and weekly)
  if (!schedule1.startDate || !schedule1.endDate || !schedule2.startDate || !schedule2.endDate) {
    return false
  }

  const s1Start = new Date(schedule1.startDate).getTime()
  const s1End = new Date(schedule1.endDate).getTime()
  const s2Start = new Date(schedule2.startDate).getTime()
  const s2End = new Date(schedule2.endDate).getTime()

  // Date ranges don't overlap
  if (s1End < s2Start || s2End < s1Start) {
    return false
  }

  // For daily schedules (dayOfWeek === null), they overlap if date ranges overlap and times overlap
  if (schedule1.dayOfWeek === null && schedule2.dayOfWeek === null) {
    return timeSlotsOverlap(
      schedule1.startTime,
      schedule1.endTime,
      schedule2.startTime,
      schedule2.endTime
    )
  }

  // For weekly schedules, must be same day of week
  if (schedule1.dayOfWeek !== null && schedule2.dayOfWeek !== null) {
    if (schedule1.dayOfWeek !== schedule2.dayOfWeek) {
      return false
    }
    // Same day of week, check if times overlap
    return timeSlotsOverlap(
      schedule1.startTime,
      schedule1.endTime,
      schedule2.startTime,
      schedule2.endTime
    )
  }

  // Mixed: one daily, one weekly - check if any day in the date range matches the weekly day
  const dailySchedule = schedule1.dayOfWeek === null ? schedule1 : schedule2
  const weeklySchedule = schedule1.dayOfWeek === null ? schedule2 : schedule1

  // For daily vs weekly, they conflict if:
  // 1. Date ranges overlap
  // 2. Times overlap
  // 3. At least one day in the overlapping date range matches the weekly day
  if (!timeSlotsOverlap(
    schedule1.startTime,
    schedule1.endTime,
    schedule2.startTime,
    schedule2.endTime
  )) {
    return false
  }

  // Check if any day in the overlapping date range matches the weekly day
  const overlapStart = Math.max(s1Start, s2Start)
  const overlapEnd = Math.min(s1End, s2End)
  const overlapStartDate = new Date(overlapStart)
  const overlapEndDate = new Date(overlapEnd)
  
  let current = new Date(overlapStartDate)
  while (current <= overlapEndDate) {
    if (current.getDay() === weeklySchedule.dayOfWeek) {
      return true
    }
    current.setDate(current.getDate() + 1)
  }

  return false
}

/**
 * Check if a one-time schedule overlaps with another schedule
 */
function oneTimeScheduleOverlaps(
  schedule1: Schedule,
  schedule2: Schedule
): boolean {
  // If schedule2 is recurring
  if (schedule2.isRecurring) {
    const schedule1Date = new Date(schedule1.startTime)
    
    // Check if schedule1's date is within schedule2's date range
    if (!schedule2.startDate || !schedule2.endDate) {
      return false
    }

    const s1Date = schedule1Date.getTime()
    const s2Start = new Date(schedule2.startDate).getTime()
    const s2End = new Date(schedule2.endDate).getTime()

    if (s1Date < s2Start || s1Date > s2End) {
      return false
    }

    // For daily recurring (dayOfWeek === null), any day in the range conflicts if times overlap
    if (schedule2.dayOfWeek === null) {
      const s1Time = new Date(schedule1.startTime)
      const s1EndTime = new Date(schedule1.endTime)
      const s2Time = new Date(schedule2.startTime)
      const s2EndTime = new Date(schedule2.endTime)

      // Set same date for comparison
      const baseDate = new Date(s1Time)
      baseDate.setHours(0, 0, 0, 0)
      s2Time.setFullYear(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
      s2EndTime.setFullYear(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())

      return timeSlotsOverlap(s1Time, s1EndTime, s2Time, s2EndTime)
    }

    // For weekly recurring, check if schedule1's date falls on schedule2's day
    const schedule1DayOfWeek = schedule1Date.getDay()
    if (schedule1DayOfWeek !== schedule2.dayOfWeek) {
      return false
    }

    // Extract time from schedule1 and compare with schedule2's time
    const s1Time = new Date(schedule1.startTime)
    const s1EndTime = new Date(schedule1.endTime)
    const s2Time = new Date(schedule2.startTime)
    const s2EndTime = new Date(schedule2.endTime)

    // Set same date for comparison
    const baseDate = new Date(s1Time)
    baseDate.setHours(0, 0, 0, 0)
    s2Time.setFullYear(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
    s2EndTime.setFullYear(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())

    return timeSlotsOverlap(s1Time, s1EndTime, s2Time, s2EndTime)
  }

  // Both are one-time, check if dates and times overlap
  return timeSlotsOverlap(
    schedule1.startTime,
    schedule1.endTime,
    schedule2.startTime,
    schedule2.endTime
  )
}

/**
 * Detect conflicts in schedules
 * A conflict occurs when the same instructor has overlapping schedules at different locations
 */
export function detectConflicts(schedules: Schedule[]): Conflict[] {
  const conflicts: Conflict[] = []
  const instructorSchedules = new Map<string, Schedule[]>()

  // Group schedules by instructor
  for (const schedule of schedules) {
    if (!instructorSchedules.has(schedule.instructorId)) {
      instructorSchedules.set(schedule.instructorId, [])
    }
    instructorSchedules.get(schedule.instructorId)!.push(schedule)
  }

  // Check each instructor's schedules for conflicts
  for (const [instructorId, instructorScheduleList] of instructorSchedules) {
    const conflictingGroups: Schedule[][] = []

    // Compare each schedule with every other schedule for this instructor
    for (let i = 0; i < instructorScheduleList.length; i++) {
      const schedule1 = instructorScheduleList[i]
      const conflictsWithSchedule1: Schedule[] = [schedule1]

      for (let j = i + 1; j < instructorScheduleList.length; j++) {
        const schedule2 = instructorScheduleList[j]

        // Only conflict if different locations
        if (schedule1.locationId === schedule2.locationId) {
          continue
        }

        // Check for overlap
        let overlaps = false
        if (schedule1.isRecurring && schedule2.isRecurring) {
          overlaps = recurringSchedulesOverlap(schedule1, schedule2)
        } else if (!schedule1.isRecurring && !schedule2.isRecurring) {
          overlaps = oneTimeScheduleOverlaps(schedule1, schedule2)
        } else {
          // One is recurring, one is not
          if (schedule1.isRecurring) {
            overlaps = oneTimeScheduleOverlaps(schedule2, schedule1)
          } else {
            overlaps = oneTimeScheduleOverlaps(schedule1, schedule2)
          }
        }

        if (overlaps) {
          if (!conflictsWithSchedule1.includes(schedule2)) {
            conflictsWithSchedule1.push(schedule2)
          }
        }
      }

      if (conflictsWithSchedule1.length > 1) {
        // Check if this conflict group is already recorded
        const isDuplicate = conflictingGroups.some((group) =>
          group.every((s) => conflictsWithSchedule1.includes(s))
        )

        if (!isDuplicate) {
          conflictingGroups.push(conflictsWithSchedule1)
        }
      }
    }

    // Create conflict entries
    for (const conflictGroup of conflictingGroups) {
      const firstSchedule = conflictGroup[0]
      conflicts.push({
        instructorId,
        instructorName: firstSchedule.instructorName || 'Unknown Instructor',
        conflictingSchedules: conflictGroup.map((s) => ({
          scheduleId: s.id,
          classroomName: s.classroomName || 'Unknown Classroom',
          locationName: s.locationName || 'Unknown Location',
          startTime: s.startTime,
          endTime: s.endTime,
          dayOfWeek: s.dayOfWeek,
        })),
      })
    }
  }

  return conflicts
}
