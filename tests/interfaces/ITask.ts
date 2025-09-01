import { Actor } from "@screenplay/core/Actor";


export interface Task {
  performAs(actor: Actor): Promise<void>;
}
