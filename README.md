# devOz — AWS CDK Infrastructure

**devOz** is an AWS CDK (TypeScript) project for deploying cloud infrastructure for a SaaS platform.  
It provisions and manages AWS resources needed for authentication, APIs, and automation services.

---

## 🚀 Overview

This repository contains the Infrastructure as Code (IaC) to build and maintain the cloud environment behind **devOz**.  
It leverages the **AWS Cloud Development Kit (CDK)** in **TypeScript** to define and deploy resources such as:

- **Amazon Cognito** — User pools for authentication and user management.
- **API Gateway & Lambda** — Serverless API endpoints.
- **DynamoDB / Other Services** — (Add your specific services here).
- **Additional integrations** — AI orchestration, automation, and third-party API connections.

---

## 🗂 Project Structure


---

## 📦 Useful Commands

| Command                          | Description |
|----------------------------------|-------------|
| `npm run build`                  | Compile TypeScript to JavaScript |
| `npm run watch`                  | Watch for changes and recompile |
| `npm run test`                   | Run Jest unit tests |
| `npx cdk deploy`                 | Deploy the stack to your AWS account/region |
| `npx cdk diff`                   | Compare deployed stack with current state |
| `npx cdk synth`                  | Synthesize the CloudFormation template |

---

## 🔑 Cognito Tip: Change User Password
To set a permanent password for a Cognito user:
```bash
aws cognito-idp admin-set-user-password \
  --user-pool-id <your-user-pool-id> \
  --username <username> \
  --password <password> \
  --permanent


---
