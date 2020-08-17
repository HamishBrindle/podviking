/**
 * Object returned from the deployment's configuration file
 */
export type Config = {
  /**
   * Options for the OrderFormEndpoint
   */
  order_form_endpoint: {
    /**
     * Unique identifier for this deployment in Order Marshal
     */
    access_token: string;
  };

  /**
   * Information pertaining to this particular deployment of the
   * dashboard
   */
  app_info: {
    /**
     * Name of the application
     */
    app_name: string;

    /**
     * Shortened name of application
     */
    app_name_short: string;
  };
}
