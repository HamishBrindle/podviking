import {
  IRequestArguments,
} from '@/lib/interfaces';

/**
 * A Model's API service wrapper
 */
export interface IAuthService {
  [func: string]: (args: any) => Promise<any>;

  /**
   * Login as existing user
   */
  login(args: ILoginArguments): Promise<any>;

  /**
   * Register a new user
   */
  register(args: IRegisterArguments): Promise<any>;

  /**
   * Confirm user registration
   */
  confirmation(args: IConfirmationArguments): Promise<any>;

  sendPasswordResetEmail(args: ISendPasswordResetEmailArguments): Promise<any>;

  resetPassword(args: IResetPasswordArugments): Promise<any>;
}

/**
 * Interface for logging in a User via API
 */
interface ILoginArguments extends IRequestArguments {
  /**
   * Access token for the OrderFormEndpoint
   */
  access_token: string;
  /**
   * User data for login
   */
  user_login: {
    email: string;
    password: string;
  };
}

/**
 * Interface for registering a new User via API
 */
interface IRegisterArguments extends IRequestArguments {
  /**
   * Access token for the OrderFormEndpoint
   */
  access_token: string;
  /**
   * User data for registration
   */
  order_form_user: {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
  };
}

interface IConfirmationArguments extends IRequestArguments {
  /**
   * Confirmation token for the OrderFormUser registration
   */
  confirmation_token: string;
}

interface ISendPasswordResetEmailArguments extends IRequestArguments {
    /**
   * Access token for the OrderFormEndpoint
   */
  access_token: string;

  /**
   * User email for password reset
   */
  email: string;
}

interface IResetPasswordArugments extends IRequestArguments {
  /**
   * Reset password token for the OrderFormUser password reset
   */
  reset_password_token: string;

  /**
   * New password
   */
  password: string;
  password_confirmation: string;
}

