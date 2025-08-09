import bcrypt from "bcryptjs";
import { ICredentials } from "../interfaces/login.interface";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from "@aws-sdk/client-secrets-manager";

import { config } from "process";

export class LoginService {
  constructor() {}

  public async login(body: ICredentials) {
    console.log("login");
    const secretName = process.env.SECRET_ID || "";
    const secret = await this.getSecret(secretName);
    console.log(secret);
    console.log("validation");
    const validation = await this.validateCredentials(
      {
        user: secret.user,
        password: secret.password,
      },
      body
    );
    console.log("after all");
    return {
      message: "vlidation process",
      decission: validation,
    };
  }

  private async getSecret(SecretId: string) {
    console.log("secret");
    const client = new SecretsManagerClient(config);
    const input = {
      SecretId: SecretId, // required
    };
    const command = new GetSecretValueCommand(input);
    const secretValue = (await client.send(command)).SecretString || "";
    console.log(secretValue)
    return JSON.parse(secretValue);
  }

  private async validateCredentials(
    secret: ICredentials,
    credentials: ICredentials
  ): Promise<boolean> {
    try {
      console.log("not validating a shit");
      console.log("Comparing passwords:", {
        credentialsPasswordType: typeof credentials.password,
        secretPasswordType: typeof secret.password,
        credentialsPassword: credentials.password
          ? "[REDACTED]"
          : credentials.password,
        secretPassword: secret.password ? "[REDACTED]" : secret.password,
      });
      const result = await bcrypt.compare(
        credentials.password,
        secret.password
      );
      console.log("it failed");
      if (result) {
        console.log("Passwords match! User authenticated.");
        return true;
      } else {
        console.log("Passwords do not match! Authentication failed.");
        return false;
      }
    } catch (err) {
      console.error("bcrypt.compare error:", err);
      // Depending on your logic, either:
      // throw err;  // to propagate and cause 500
      // or
      return false; // treat error as failed login
    }
  }
}
