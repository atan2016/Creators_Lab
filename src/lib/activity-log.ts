import { prisma } from './prisma'

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum ActivityEntityType {
  CLASSROOM = 'CLASSROOM',
  RESOURCE = 'RESOURCE',
  SYLLABUS = 'SYLLABUS',
  SCHEDULE = 'SCHEDULE',
}

export interface LogActivityParams {
  userId: string
  action: ActivityAction
  entityType: ActivityEntityType
  entityId: string
  entityName: string
  description?: string
}

/**
 * Log an activity to the activity log
 */
export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  entityName,
  description,
}: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        entityName,
        description: description || null,
      },
    })
  } catch (error) {
    console.error('Error logging activity:', error)
    // Don't throw - activity logging should not break the main operation
  }
}

/**
 * Log a classroom activity
 */
export async function logClassroomActivity(
  userId: string,
  action: ActivityAction,
  classroomId: string,
  classroomName: string
): Promise<void> {
  const description = `${action.toLowerCase()}d Classroom: ${classroomName}`
  await logActivity({
    userId,
    action,
    entityType: ActivityEntityType.CLASSROOM,
    entityId: classroomId,
    entityName: classroomName,
    description,
  })
}

/**
 * Log a resource activity
 */
export async function logResourceActivity(
  userId: string,
  action: ActivityAction,
  resourceId: string,
  resourceTitle: string,
  resourceType?: string
): Promise<void> {
  const description = resourceType
    ? `${action.toLowerCase()}d Resource: ${resourceTitle} (${resourceType})`
    : `${action.toLowerCase()}d Resource: ${resourceTitle}`
  await logActivity({
    userId,
    action,
    entityType: ActivityEntityType.RESOURCE,
    entityId: resourceId,
    entityName: resourceTitle,
    description,
  })
}

/**
 * Log a syllabus activity
 */
export async function logSyllabusActivity(
  userId: string,
  action: ActivityAction,
  entryId: string,
  classroomName: string,
  date?: string
): Promise<void> {
  const dateStr = date ? ` for ${date}` : ''
  const description = `${action.toLowerCase()}d Syllabus entry${dateStr} in ${classroomName}`
  await logActivity({
    userId,
    action,
    entityType: ActivityEntityType.SYLLABUS,
    entityId: entryId,
    entityName: `${classroomName} - ${date || 'Entry'}`,
    description,
  })
}

/**
 * Log a schedule activity
 */
export async function logScheduleActivity(
  userId: string,
  action: ActivityAction,
  scheduleId: string,
  classroomName: string,
  locationName: string,
  timeInfo?: string
): Promise<void> {
  const timeStr = timeInfo ? ` @ ${timeInfo}` : ''
  const description = `${action.toLowerCase()}d Schedule: ${classroomName} @ ${locationName}${timeStr}`
  await logActivity({
    userId,
    action,
    entityType: ActivityEntityType.SCHEDULE,
    entityId: scheduleId,
    entityName: `${classroomName} @ ${locationName}`,
    description,
  })
}

/**
 * Clean up activity logs older than 90 days
 * Returns the count of deleted logs
 */
export async function cleanupOldLogs(): Promise<number> {
  try {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: ninetyDaysAgo,
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('Error cleaning up old logs:', error)
    throw error
  }
}
