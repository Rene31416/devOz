import { ICredentials } from "../interfaces/login.interface";

import AWS from "aws-sdk";

export class LoginService {
  public readonly secretsManager = new AWS.SecretsManager();

  constructor() {

  }

  private async getSecret(SecretId :string): Promise<Record<any,any>> {
    AWS.config.update({ region: 'ca-central-1' })
    return await this.secretsManager.getSecretValue({SecretId });
  }

  public async login(credentials: ICredentials) {
    const secretArn = process.env.SECRET_ARN || ''
    const secret = await this.getSecret(secretArn);

    if(secret){
        console.log(`retrieving secret correct ${secretArn}`)
    }
  }
}
