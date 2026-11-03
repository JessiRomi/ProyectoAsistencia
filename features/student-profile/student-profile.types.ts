
export interface StudentProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    studentNumber: string;
    phone: string | null;
    email: string;
    photoUrl: string | null;
    birthDate: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface StudentProfileResponse {
    success: boolean;
    data: StudentProfile;
    timestamp: string;
}
