# AWS CI/CD Setup Guide

This project is configured with a `buildspec.yml` file and is ready to be deployed using AWS services. 

## Prerequisites
1. An AWS Account.
2. AWS CLI installed and configured locally (optional but helpful).

## Step 1: Push Code to AWS CodeCommit
Instead of GitHub, you can use AWS CodeCommit to store your code.

1. Open the **AWS CodeCommit** console.
2. Click **Create repository**. Name it `HabitTracker`.
3. Set up your Git credentials for CodeCommit (IAM -> Users -> Your User -> Security Credentials -> Git credentials for AWS CodeCommit).
4. Add the CodeCommit remote to your local repository and push:
   ```bash
   git remote add aws <your-codecommit-url>
   git push aws main
   ```

## Step 2: Configure AWS CodeBuild
CodeBuild will use the `buildspec.yml` file in the root of the project to build the frontend and package the application.

1. Open the **AWS CodeBuild** console.
2. Click **Create build project**.
3. **Source**: Select AWS CodeCommit and your repository.
4. **EnvironmentVariables**: **[CRITICAL]** Add the following variables here (Vite needs these during build time):
   - `VITE_SUPABASE_URL` = (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon Key)
5. **Buildspec**: Select "Use a buildspec file" (it will automatically find `buildspec.yml`).

## Step 3: Create AWS CodePipeline
CodePipeline will automate the flow from code change to build and deployment.

1. Open the **AWS CodePipeline** console.
2. Click **Create pipeline**.
3. **Source**: Select AWS CodeCommit, your repository, and branch `main`.
4. **Build**: Select AWS CodeBuild and the project you created in Step 2.
5. **Deploy**: 
   - For the **Frontend**: You can deploy the `dist` folder to **AWS S3** for static hosting.
   - For the **Backend**: You can deploy the `server` folder to **AWS Elastic Beanstalk** or **AWS App Runner**.

## Note on Database
The backend is now configured to connect to **Supabase** (Postgres) instead of local SQLite. This ensures that your data is not lost when the server restarts on AWS!
