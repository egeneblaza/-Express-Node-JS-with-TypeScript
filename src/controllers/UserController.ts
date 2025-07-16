import { Request, Response } from 'express';
import { UserInput,DeleteUserParams } from '../types/User.js';
import { 
  createUserService,deleteUserByIdService
} from '../services/UserServices.js';
import { userInputSchema } from '../validations/userValidation.js';



export const createUser = async (
  req: Request<{}, {}, UserInput>,
  res: Response
): Promise<void> => {
  try {
    const parsedInput = userInputSchema.safeParse(req.body);
    if (!parsedInput.success) {
      res.status(400).json({
        success: false,
        errors: parsedInput.error.flatten().fieldErrors,
      });
      return; 
    }
    const user = await createUserService(parsedInput.data);
    res.status(200).json({ success: true, data: user });
  } catch (err: unknown) {
    console.error('User creation failed:', err);
    const message = err instanceof Error ? err.message : 'Error creating user';
    res.status(500).json({ success: false, message });
  }
};


export const deleteUserById = async (
  req: Request<DeleteUserParams>,
  res: Response
): Promise<void> => {
  try {
    const user = await deleteUserByIdService(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('User deletion failed:', err);
    const message = err instanceof Error ? err.message : 'Error deleting user';
    res.status(500).json({ success: false, message });
  }
};

