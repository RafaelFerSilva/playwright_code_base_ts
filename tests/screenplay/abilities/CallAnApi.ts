import { Ability } from '@interfaces/IAbility';
import { IAccountApiPort } from '@interfaces/IAccountApiPort';

export class CallAnApi implements Ability  {
  constructor(private readonly apiClient: IAccountApiPort) {}

  static using(apiClient: IAccountApiPort): CallAnApi {
    return new CallAnApi(apiClient);
  }

  get client(): IAccountApiPort {
    return this.apiClient;
  }
}
