
import { IUser, IUserCreationResponse } from '@interfaces/IUser';

export interface IAccountApiPort {
  createUser(user: IUser): Promise<IUserCreationResponse>;
  deleteUser(userId: string): Promise<void>;
  getUserInfo(userId: string): Promise<any>;
}
