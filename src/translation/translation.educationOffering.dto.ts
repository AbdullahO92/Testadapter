import { Type } from 'class-transformer'
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    IsNumber,
    IsUUID,
    IsISO8601,
    ValidateNested,
} from 'class-validator'

/**
 * Enum for EducationOfferingType.
 */
export enum EducationOfferingTypeEnum {
    Collection = 'collection',
    Course = 'course',
    Component = 'component',
    ExtAnnouncement = 'ext:announcement',
}

/**
 * Enum for OfferingFormat.
 */
export enum OfferingFormatEnum {
    Online = 'online',
    FaceToFace = 'faceToFace',
    Hybrid = 'hybrid',
}

/**
 * Enum for RegistrationStatus.
 */
export enum RegistrationStatusEnum {
    Open = 'open',
    Closed = 'closed',
    Waitlist = 'waitlist',
}

/**
 * Enum for RecordStatusType.
 */
export enum RecordStatusTypeEnum {
    Active = 'active',
    Inactive = 'inactive',
}

/**
 * Enum for Synchronicity.
 */
export enum SynchronicityEnum {
    Synchronous = 'synchronous',
    Asynchronous = 'asynchronous',
}

/**
 * DTO for language-typed string fields.
 */
export class LanguageTypedString {
    /**
     * Language code (e.g., 'en').
     */
    @IsString()
    @IsNotEmpty()
    language: string

    /**
     * Value in the specified language.
     */
    @IsString()
    @IsNotEmpty()
    value: string
}

/**
 * DTO for identifier entries.
 */
export class IdentifierEntry {
    /**
     * Identifier type (e.g., 'canvas_course_code').
     */
    @IsString()
    @IsNotEmpty()
    type: string

    /**
     * Identifier value.
     */
    @IsString()
    @IsNotEmpty()
    identifier: string
}

/**
 * DTO for referencing an organization by GUID.
 */
export class OrganizationGUIDRef {
    /**
     * Organization sourcedId (UUID).
     */
    @IsUUID()
    sourcedId: string
}

/**
 * DTO for referencing an academic session by GUID.
 */
export class AcademicSessionGUIDRef {
    /**
     * Academic session sourcedId (UUID).
     */
    @IsString()
    @IsNotEmpty()
    sourcedId: string
}

/**
 * DTO for IMS Global Edu-API v1.0 EducationOffering.
 */
export class EducationOfferingDto {
    /**
     * Unique identifier (UUID).
     */
    @IsUUID()
    sourcedId: string

    /**
     * Offering type.
     */
    @IsEnum(EducationOfferingTypeEnum)
    offeringType: EducationOfferingTypeEnum

    /**
     * Record language (default: 'en').
     */
    @IsString()
    @IsNotEmpty()
    recordLanguage: string

    /**
     * Title(s) of the offering.
     */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LanguageTypedString)
    title: LanguageTypedString[]

    /**
     * Description(s) of the offering.
     */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LanguageTypedString)
    description: LanguageTypedString[]

    /**
     * Primary code for the offering.
     */
    @ValidateNested()
    @Type(() => IdentifierEntry)
    primaryCode: IdentifierEntry

    /**
     * Other codes for the offering.
     */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IdentifierEntry)
    @IsOptional()
    otherCodes?: IdentifierEntry[]

    /**
     * Credit type (optional).
     */
    @IsString()
    @IsOptional()
    creditType?: string

    /**
     * Locations (optional).
     */
    @IsArray()
    @IsOptional()
    locations?: string[]

    /**
     * Organization reference.
     */
    @ValidateNested()
    @Type(() => OrganizationGUIDRef)
    organization: OrganizationGUIDRef

    /**
     * Academic session reference.
     */
    @ValidateNested()
    @Type(() => AcademicSessionGUIDRef)
    academicSession: AcademicSessionGUIDRef

    /**
     * Organization code (optional).
     */
    @IsString()
    @IsOptional()
    organizationCode?: string

    /**
     * Academic session code (optional).
     */
    @IsString()
    @IsOptional()
    academicSessionCode?: string

    /**
     * Offering format.
     */
    @IsEnum(OfferingFormatEnum)
    offeringFormat: OfferingFormatEnum

    /**
     * Pace of study (optional).
     */
    @IsNumber()
    @IsOptional()
    paceOfStudy?: number

    /**
     * Registration status.
     */
    @IsEnum(RegistrationStatusEnum)
    registrationStatus: RegistrationStatusEnum

    /**
     * Start date (ISO8601).
     */
    @IsISO8601()
    startDate: string

    /**
     * End date (ISO8601).
     */
    @IsISO8601()
    endDate: string

    /**
     * Teaching language (optional).
     */
    @IsString()
    @IsOptional()
    teachingLanguage?: string

    /**
     * Maximum number of students (optional).
     */
    @IsNumber()
    @IsOptional()
    maxNumberStudents?: number

    /**
     * Minimum number of students (optional).
     */
    @IsNumber()
    @IsOptional()
    minNumberStudents?: number

    /**
     * Enrolled number of students (optional).
     */
    @IsNumber()
    @IsOptional()
    enrolledNumberStudents?: number

    /**
     * Pending number of students (optional).
     */
    @IsNumber()
    @IsOptional()
    pendingNumberStudents?: number

    /**
     * Role enablement (optional).
     */
    @IsArray()
    @IsOptional()
    roleEnablement?: any[]

    /**
     * Record status.
     */
    @IsEnum(RecordStatusTypeEnum)
    recordStatus: RecordStatusTypeEnum

    /**
     * Last modified date (optional, ISO8601).
     */
    @IsISO8601()
    @IsOptional()
    dateLastModified?: string

    /**
     * Synchronicity (optional).
     */
    @IsEnum(SynchronicityEnum)
    @IsOptional()
    synchronicity?: SynchronicityEnum

    /**
     * Extensions (optional).
     */
    @IsOptional()
    extensions?: any
}
