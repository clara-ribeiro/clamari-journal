import type { Goals } from "@/domain/entities";
import type { GoalsRepository } from "@/application/repositories/goals-repository";
import goalsData from "@/data/goals.json";

export class FileGoalsRepository implements GoalsRepository {
  get(): Goals {
    return goalsData as Goals;
  }
}

export const goalsRepository = new FileGoalsRepository();
