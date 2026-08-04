import type { Goals } from "@/domain/entities";

export interface GoalsRepository {
  get(): Goals;
}
