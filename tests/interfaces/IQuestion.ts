import { Actor } from "@screenplay/core/Actor";

export interface Question<T = any> {
  answeredBy(actor: Actor): Promise<T>;

  stepName?(): string;
}
