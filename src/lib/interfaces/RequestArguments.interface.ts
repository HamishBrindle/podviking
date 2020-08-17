/**
 * General interface for arguments going to the API
 */
export interface IRequestArguments {
  [field: string]: any;
}

/**
 * Interface for create arguments going to the API
 */
export interface ICreateArguments extends IRequestArguments {
  authentication_token: string;
}

/**
 * Interface for update arguments going to the API
 */
export interface IUpdateArguments extends IRequestArguments {
  id: string | number;
  authentication_token: string;
}

/**
 * Interface for find-one arguments going to the API
 */
export interface IFindOneArguments extends IRequestArguments {
  id: string | number;
  authentication_token: string;
}

/**
 * Interface for find arguments going to the API
 */
export interface IFindArguments extends IRequestArguments {
  authentication_token: string;
}

/**
 * Interface for destroy arguments going to the API
 */
export interface IDestroyArguments extends IRequestArguments {
  id: string | number;
  authentication_token: string;
}

export default IRequestArguments;
