import { Injectable } from '@nestjs/common';

interface PatientVector {
  mgmt_status: number;
  idh_status: number;
  age_bracket: number;
  kps_score: number;
  treatment_phase: number;
  time_since_diagnosis: number;
  user_type: number;
}

const FEATURE_WEIGHTS = {
  mgmt_status: 1.0,
  idh_status: 1.0,
  age_bracket: 0.7,
  kps_score: 0.6,
  treatment_phase: 0.5,
  time_since_diagnosis: 0.4,
  user_type: 0.3,
};

@Injectable()
export class MatchingService {
  async getMatches(userId: string, limit: number = 10) {
    // TODO: Implement with actual patient data from database
    // For now, return mock matches
    return {
      matches: [
        { userId: 'match-1', name: 'Robert K.', similarity: 0.92, phase: 'Adjuvant TMZ' },
        { userId: 'match-2', name: 'Linda S.', similarity: 0.87, phase: 'Concurrent RT/TMZ' },
        { userId: 'match-3', name: 'David H.', similarity: 0.84, phase: 'Adjuvant TMZ' },
      ],
    };
  }

  calculateSimilarity(user1: PatientVector, user2: PatientVector): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const feature of Object.keys(FEATURE_WEIGHTS) as (keyof PatientVector)[]) {
      const weight = FEATURE_WEIGHTS[feature];
      const v1 = user1[feature] * weight;
      const v2 = user2[feature] * weight;

      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Encode patient data to vector for similarity calculation
  encodePatientToVector(profile: any): PatientVector {
    return {
      mgmt_status: this.encodeMgmt(profile.mgmtStatus),
      idh_status: this.encodeIdh(profile.idhStatus),
      age_bracket: this.encodeAge(profile.ageAtDiagnosis),
      kps_score: this.normalizeKps(profile.karnofskyScore),
      treatment_phase: this.encodeTreatmentPhase(profile.currentTreatmentPhase),
      time_since_diagnosis: this.encodeTimeSinceDiagnosis(profile.timeSinceDiagnosis),
      user_type: 0, // patient = 0, caregiver = 1
    };
  }

  private encodeMgmt(status: string | null): number {
    switch (status) {
      case 'methylated': return 2;
      case 'unmethylated': return 1;
      default: return 0;
    }
  }

  private encodeIdh(status: string | null): number {
    switch (status) {
      case 'mutant': return 2;
      case 'wildtype': return 1;
      default: return 0;
    }
  }

  private encodeAge(age: number | null): number {
    if (!age) return 0;
    if (age < 40) return 1;
    if (age < 55) return 2;
    if (age < 70) return 3;
    return 4;
  }

  private normalizeKps(score: number | null): number {
    if (!score) return 0.5;
    return score / 100;
  }

  private encodeTreatmentPhase(phase: string | null): number {
    const phases = [
      'pre_treatment',
      'initial_surgery',
      'concurrent_chemoradiation',
      'adjuvant_chemotherapy',
      'maintenance',
      'recurrence',
      'clinical_trial',
      'palliative',
    ];
    return phase ? (phases.indexOf(phase) + 1) / phases.length : 0;
  }

  private encodeTimeSinceDiagnosis(time: string | null): number {
    switch (time) {
      case 'newly_diagnosed': return 0.1;
      case '1_month': return 0.2;
      case '3_months': return 0.4;
      case '6_months': return 0.6;
      case '1_year_plus': return 1.0;
      default: return 0;
    }
  }
}
